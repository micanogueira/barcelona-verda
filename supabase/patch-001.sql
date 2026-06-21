-- Remove plaça/square type (não faz parte do conceito)
DELETE FROM public.green_spaces WHERE type = 'square';

-- Corrigir coordenadas incorrectas
UPDATE public.green_spaces SET location = ST_Point(2.1542, 41.3680) WHERE name = 'Jardins de Laribal';
UPDATE public.green_spaces SET location = ST_Point(2.1380, 41.3778) WHERE name = 'Hort de Can Mestres';

-- Remover square do constraint de tipo
ALTER TABLE public.green_spaces DROP CONSTRAINT IF EXISTS green_spaces_type_check;
ALTER TABLE public.green_spaces ADD CONSTRAINT green_spaces_type_check
  CHECK (type IN ('park', 'garden', 'hort', 'mediator'));

-- 2 árvores de teste (desvinculadas de embaixadors por agora)
INSERT INTO public.trees (name, species, location, health, notes) VALUES
  ('Om de l''Eixample',   'Ulmus minor',         ST_Point(2.1620, 41.3950), 'good',      'Arbre de prova'),
  ('Plàtan de Gràcia',    'Platanus hispanica',   ST_Point(2.1530, 41.4010), 'excellent', 'Arbre de prova');
