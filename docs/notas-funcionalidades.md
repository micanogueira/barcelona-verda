# Notas de funcionalidades — Barcelona Verd

Notas técnicas de funcionalidades discutidas mas ainda não implementadas. Cada seção descreve a estrutura por trás de uma ideia, para referência futura.

---

## Cuida l'escocell — padrinho/madrinha com histórico e disponibilidade no mapa

**Ideia:** o card "Cuida l'escocell" em `participar.vue` descreve o programa oficial (apadrinhar até 3 escocells). A plataforma agregaria: visibilidade de quem é padrinho/madrinha de cada escocell no mapa, foto e histórico de cuidado, há quanto tempo a pessoa é padrinho (mandato de 1 ano), e a possibilidade de se candidatar a um escocell livre direto pelo mapa.

**Schema atual relevante** (`supabase/schema.sql`):
- `trees`: `id, name, species, location, green_space_id, ambassador_id → profiles, health, notes, photo_url, named_after, created_at`
- RLS em `trees`: `update` só permitido quando `auth.uid() = ambassador_id`. Não existe fluxo de autoatribuição (ninguém pode se tornar `ambassador_id` de uma árvore livre).
- Não existe tabela de histórico/log — `health` é um valor único, sobrescrito a cada update.

**Correção importante (2026-06-24):** a disponibilidade de um escocell (tem padrinho ou não) vem do site oficial da cidade, não é algo que o nosso sistema gera. Ou seja, não há autocandidatura dentro da plataforma — quem aplica, aplica no site oficial. Isso elimina a necessidade da função `claim_escocell()` da primeira versão desta nota: não existe "reivindicar" um escocell pela nossa plataforma, só *mostrar* o status (curado manualmente, já que a cidade não tem API) e linkar pra fora.

**Mudanças de schema propostas (versão simplificada):**
1. Renomear `trees.ambassador_id` → `trees.padri_id` (mesma FK para `profiles`) — continua útil para guardar quem é o padrinho/madrinha *quando essa pessoa também usa a Barcelona Verd* (visibilidade/foto/histórico voluntários da comunidade), mas não é o que determina disponibilidade.
2. Adicionar `trees.is_available` (boolean, default `false`) — atualizado manualmente por mediadores/admins com base no que veem no site oficial. É a fonte de verdade pro badge "Disponible" no mapa, não um cálculo derivado de `padri_since`.
3. `trees.padri_since` (`timestamptz`, nullable) segue como campo opcional/comunitário — "há quanto tempo essa pessoa cuida", preenchido por quem já é o padrinho oficial e quer aparecer no mapa.
4. Nova tabela `tree_care_logs` (`id, tree_id → trees, profile_id → profiles, note, photo_url, created_at`) segue igual — histórico de cuidado, alimentado por quem já é padrinho, não tem relação com a disponibilidade.

**No mapa (`BarcelonaMap.vue`):**
- Popup do escocell busca `is_available, padri_id, padri_since, photo_url` (join em `profiles.full_name`).
- Se `is_available = true`: badge "Disponible" com destaque visual + botão "Veure més" / "Sol·licitar", que leva para a MESMA URL oficial usada no card "Cuida l'escocell" de `participar.vue` (`https://ajuntament.barcelona.cat/.../cuida-lescocell`), em nova aba — exatamente o mesmo destino do botão "Accedeix al programa →".
- Se ocupado e o padrinho optou por aparecer (community layer voluntária): mostra foto, nome e "des de quan".
- Sem push/email — confirmado que não é necessário. O "alerta" é só visual: o marcador already aparece destacado no mapa quando `is_available = true`.

**Filtro no mapa (`index.vue`):** o filtro `tree` (label atual "Àrbres") já cobre essas marcações — não precisa de um filtro novo. Recomendo renomear o label para **"Àrbres (escocells)"** (ou "Arbres i escocells"), pra conectar visualmente com o nome do programa oficial que aparece em `participar.vue` e deixar claro que ao clicar num marcador desse filtro a pessoa vê o status de apadrinhamento, não só info botânica.

**Implementado (mock, 2026-06-24):** `app/utils/escocell.js` centraliza a lógica mock (`mockEscocellStatus`), usada tanto pelo mapa (`BarcelonaMap.vue`) quanto pela lista (`index.vue`), pra garantir que os dois mostrem o mesmo status pra cada escocell. A classe CSS do marcador foi nomeada de forma genérica (`has-opportunity`) e os estilos de popup também (`popup-opportunity-*`), porque a funcionalidade seguinte (horts) reaproveita o mesmo padrão visual.

---

## Xarxa d'Horts Municipals — aviso de convocatòria aberta

**Ideia:** o card "Xarxa d'Horts Municipals" afirma que a plataforma centraliza a info dos 15 horts e avisa quando abre uma nova convocatòria. A primeira parte já é estrutural (a lista/mapa já mostram cada hort com descrição, bairro etc.). A segunda parte — "avisar quando abre convocatòria" — exigia um conceito novo.

**Decisão (2026-06-24):** igual ao escocell, a informação de "convocatòria aberta" vem do site oficial da cidade (curadoria manual por mediadores, sem API oficial), não é algo a plataforma gera. Não tem push/email — o "aviso" é visual: destaque no marcador do mapa + badge na lista, reaproveitando exatamente o padrão visual já criado pro escocell (`has-opportunity` no mapa, `.list-item-available` na lista).

**Schema proposto:** `green_spaces.accepting_applications` (boolean, default `false`, curado manualmente). Por enquanto mockado em `app/utils/horts.js` (`mockAcceptingApplications`), determinístico por id, só pra `type === 'hort'`.

**No mapa:** marcador do hort ganha o mesmo ponto de destaque amarelo (`has-opportunity`) e o popup mostra "Convocatòria oberta" + link pra `OFFICIAL_PROGRAM.hort.url` (mesma URL do card em `participar.vue`).

**Na lista (`index.vue`):** badge "Convocatòria oberta" no lugar de "Cal ajuda"/"Disponible" quando aplicável (mesma classe `.list-item-available`, ordem de prioridade: ajuda > escocell disponível > convocatòria oberta).

---

## Cessió d'Espais Municipals — visibilidade da entidade gestora

**Ideia:** o card afirma centralizar espaços cedidos ativos e avisar de próximas convocatórias. Na prática, são duas afirmações de viabilidade muito diferente.

**O que o programa real cobre** (confirmado na página oficial, 2026-06-24): a Prefeitura cede solars municipais inativos a **entitats sense ànim de lucre** (não empresas) para criar horts, jardins comunitaris OU reserves de biodiversitat — não é restrito a jardins. O espaço continua de uso comunitário/autogestionado; a Prefeitura mantém a titularidade.

**Parte inviável:** "properes convocatòries" se refere a solars que ainda não foram cedidos — não existe nenhuma linha em `green_spaces` pra isso, já que a tabela só tem espaços já ativos. Não há nada pra mostrar no mapa; essa parte do texto foi descartada.

**Parte viável (mockada):** mostrar qual entidade já gere um espaço cedido. Implementado em `app/utils/cessions.js` (`mockCededTo`), badge "Gestionat per [entitat]" no popup do mapa (`BarcelonaMap.vue`) e meta-line equivalente na lista (`index.vue`), pra lista espelhar o mapa. Sem ponto de destaque no marcador (é informativo, não uma oportunidade de ação).

**Escopo do mock (atualizado 2026-06-24):** aplicado a `garden` (jardí comunitari), `hort` e ao novo type `reserva` (reserva de biodiversitat) — exatamente os três resultados que o programa oficial cobre. Decisão confirmada com a Micaelle: **um type pode pertencer a mais de um programa** (ex.: `hort` também aparece em "Xarxa d'Horts Municipals", `garden` também em "Cogestió d'Espais Públics") — a sobreposição é aceitável, então nenhum type é excluído. O `park` foi **removido** do escopo: a cessão é sobre solars/terrenos pequenos cedidos, não parques municipais grandes já existentes.

**Type `reserva` (criado 2026-06-24):** novo valor no constraint de `green_spaces.type` (`supabase/patch-003.sql`), com 2 reserves de mostra seedadas. Registrado no frontend: ícone `seedling`, cor `#0d9488` (teal), label "Reserva de biodiversitat", filtro próprio "Reserves de biodiversitat", e `OFFICIAL_PROGRAM.reserva` → "Cessió d'Espais Municipals".

**Schema proposto (entidade gestora):** `green_spaces.ceded_to_entity_name` (text, nullable, curado manualmente) ou uma tabela `entities` própria se o produto crescer (nome, tipo de entidade, contato).
