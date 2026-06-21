-- Reset completo — funciona independente do estado atual
TRUNCATE public.trees, public.green_spaces RESTART IDENTITY CASCADE;

-- Atualizar constraint de tipo
ALTER TABLE public.green_spaces DROP CONSTRAINT IF EXISTS green_spaces_type_check;
ALTER TABLE public.green_spaces ADD CONSTRAINT green_spaces_type_check
  CHECK (type IN ('park', 'garden', 'hort', 'mediator'));

-- Inserir dados com coordenadas verificadas (sem squares)
INSERT INTO public.green_spaces (name, type, description, location, district, neighborhood, needs_help, participant_count) VALUES
  -- Parcs
  ('Parc de la Ciutadella',       'park',     'El parc més gran del centre de Barcelona',              ST_Point(2.1860, 41.3867), 'Sant Martí',         'Vila Olímpica',           false, 312),
  ('Parc del Laberint d''Horta',  'park',     'El parc més antic de Barcelona',                        ST_Point(2.1463, 41.4322), 'Horta-Guinardó',     'Horta',                   false, 89),
  ('Parc de la Creueta del Coll', 'park',     'Parc amb llac artificial al turó de Collserola',        ST_Point(2.1531, 41.4120), 'Gràcia',             'Vallcarca',               true,  54),
  ('Parc de la Guineueta',        'park',     'Espai verd al nord de Nou Barris',                      ST_Point(2.1700, 41.4400), 'Nou Barris',         'La Guineueta',            false, 41),
  ('Parc de Cervantes',           'park',     'Famós pels seus jardins de roses',                      ST_Point(2.1122, 41.3887), 'Les Corts',          'Pedralbes',               false, 67),

  -- Jardins
  ('Jardins de Laribal',          'garden',   'Jardins en terrasses al turó de Montjuïc',              ST_Point(2.1542, 41.3700), 'Sants-Montjuïc',    'Font de la Guatlla',      false, 103),
  ('Jardins de Gràcia',           'garden',   'Jardins tranquils al cor de Gràcia',                    ST_Point(2.1584, 41.4020), 'Gràcia',             'Vila de Gràcia',          false, 78),
  ('Jardins de la Tamarita',      'garden',   'Jardins modernistes a l''avinguda Tibidabo',             ST_Point(2.1330, 41.4060), 'Sarrià-Sant Gervasi','Sant Gervasi-Galvany',   false, 55),
  ('Jardins de Pedralbes',        'garden',   'Jardins del Palau Reial de Pedralbes',                  ST_Point(2.1178, 41.3873), 'Les Corts',          'Pedralbes',               true,  29),

  -- Horts urbans
  ('Hort de l''Eixample',         'hort',     'Hort urbà comunitari al cor de l''Eixample',            ST_Point(2.1604, 41.3936), 'Eixample',           'Esquerra de l''Eixample', false, 48),
  ('Hort de Can Mestres',         'hort',     'Hort comunitari gestionat per veïns de Sants',          ST_Point(2.1380, 41.3778), 'Sants-Montjuïc',    'Sants',                   true,  36),
  ('Hort del Clot',               'hort',     'Hort urbà al barri del Clot',                           ST_Point(2.1944, 41.4064), 'Sant Martí',         'El Clot',                 false, 22),
  ('Hort de la Prosperitat',      'hort',     'Hort comunitari al nord de la ciutat',                  ST_Point(2.1720, 41.4370), 'Nou Barris',         'La Prosperitat',          true,  17),

  -- Punts d'informació
  ('Mercat de la Boqueria',       'mediator', 'Punt d''informació al mercat més famós de Barcelona',   ST_Point(2.1717, 41.3814), 'Ciutat Vella',       'El Raval',                false, 0),
  ('Mercat de l''Abaceria',       'mediator', 'Punt d''informació al mercat de Gràcia',                ST_Point(2.1553, 41.4029), 'Gràcia',             'Vila de Gràcia',          false, 0),
  ('CAP Gràcia',                  'mediator', 'Centre d''atenció primària — punt de difusió',           ST_Point(2.1571, 41.4015), 'Gràcia',             'Vila de Gràcia',          false, 0),
  ('Biblioteca Poblenou',         'mediator', 'Biblioteca municipal — punt d''informació',              ST_Point(2.2002, 41.4017), 'Sant Martí',         'Poblenou',                false, 0);

-- 2 àrbres de prova (desvinculats d'ambaixadors)
INSERT INTO public.trees (name, species, location, health, notes) VALUES
  ('Om de l''Eixample',  'Ulmus minor',       ST_Point(2.1620, 41.3950), 'good',      'Arbre de prova'),
  ('Plàtan de Gràcia',   'Platanus hispanica', ST_Point(2.1530, 41.4010), 'excellent', 'Arbre de prova');
