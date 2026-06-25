-- Add 'reserva' (reserva de biodiversitat) to the green_spaces type constraint.
-- The "Cessió d'Espais Municipals" program cedes unused plots to non-profit
-- entities to become horts, jardins comunitaris OR reserves de biodiversitat.
-- We already cover the first two (hort/garden); 'reserva' is the missing type.
ALTER TABLE public.green_spaces DROP CONSTRAINT IF EXISTS green_spaces_type_check;
ALTER TABLE public.green_spaces ADD CONSTRAINT green_spaces_type_check
  CHECK (type IN ('park', 'garden', 'hort', 'mediator', 'reserva'));

-- 2 reserves de biodiversitat de mostra (perquè el mapa tingui què mostrar).
-- El nom de la primera coincideix amb un MOCK_OVERRIDES a app/utils/cessions.js
-- perquè la demo mostri sempre "Gestionat per ...".
INSERT INTO public.green_spaces (name, type, description, location, district, neighborhood, needs_help, participant_count) VALUES
  ('Reserva de Biodiversitat de Vallcarca', 'reserva', 'Solar municipal cedit, naturalitzat com a refugi de biodiversitat urbana', ST_Point(2.1450, 41.4150), 'Gràcia',     'Vallcarca', false, 0),
  ('Refugi de Biodiversitat del Poblenou',  'reserva', 'Espai cedit a una entitat per crear un refugi de fauna i flora autòctona',  ST_Point(2.2010, 41.4050), 'Sant Martí', 'Poblenou',  false, 0);
