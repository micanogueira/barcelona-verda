-- patch-004.sql — Remove em-dashes ("—") from two Catalan mediator descriptions,
-- reordered as "Type: Place" (per Micaelle's preference against em-dashes in copy).
-- seed-mock.sql already carries the new text for fresh seeds; run this in the
-- Supabase SQL editor to update the rows that already exist in the live database.

UPDATE public.green_spaces
SET description = 'Punt de difusió: Centre d''atenció primària'
WHERE description = 'Centre d''atenció primària — punt de difusió';

UPDATE public.green_spaces
SET description = 'Punt d''informació: Biblioteca municipal'
WHERE description = 'Biblioteca municipal — punt d''informació';
