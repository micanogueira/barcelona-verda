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
