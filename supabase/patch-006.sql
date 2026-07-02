-- patch-006.sql — Hort classification from the source (ArcGIS ORIGEN field).
-- `subtype` refines a hort's label and drives its official-program tag:
--   'municipal'  → Xarxa d'Horts Municipals (XHM)
--   'comunitari' → community garden (no official program)
--   'social'     → social garden (no official program)
--   NULL         → plain "Hort urbà" (private/public/unknown, and all non-horts)
-- Run before re-running import-real-data.sql.

ALTER TABLE public.green_spaces
  ADD COLUMN IF NOT EXISTS subtype text;
