-- patch-007.sql — Expand the mediator network with example info-points:
-- two universities, a secondary school and a civic centre. These are example
-- rows (source 'example'), so the real-data import's full refresh never touches
-- them. Idempotent: skips any row whose name already exists (safe to re-run).

INSERT INTO public.green_spaces (name, type, description, location, district, neighborhood, source)
SELECT v.name, 'mediator', v.description, st_point(v.lng, v.lat), v.district, v.neighborhood, 'example'
FROM (VALUES
  ('Universitat de Barcelona', 'Punt d''informació a la Universitat de Barcelona', 2.1634784, 41.3868595, 'Eixample',     'l''Antiga Esquerra de l''Eixample'),
  ('Universitat Pompeu Fabra', 'Punt d''informació a la Universitat Pompeu Fabra', 2.1911055, 41.3892781, 'Sant Martí',   'la Vila Olímpica del Poblenou'),
  ('Institut Jaume Balmes',    'Punt d''informació a l''institut Jaume Balmes',    2.1667258, 41.3923084, 'Eixample',     'la Dreta de l''Eixample'),
  ('Centre Cívic Pati Llimona','Punt de difusió al centre cívic Pati Llimona',     2.1792828, 41.3817452, 'Ciutat Vella', 'el Barri Gòtic')
) AS v(name, description, lng, lat, district, neighborhood)
WHERE NOT EXISTS (SELECT 1 FROM public.green_spaces g WHERE g.name = v.name);
