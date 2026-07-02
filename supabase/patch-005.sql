-- patch-005.sql — Distinguish curated example rows from imported real data.
-- `source` marks provenance ('example' = our demo rows; 'ajuntament' = imported
-- from the city's open data). `external_id` is the idempotency key for upserts.
-- Existing rows become 'example' via the column default, so the demos that show
-- the program integrations / "cal ajuda" / escocell states stay exactly as they are.

-- green_spaces
ALTER TABLE public.green_spaces
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'example',
  ADD COLUMN IF NOT EXISTS external_id text;

-- One row per (source, external_id) when external_id is set → idempotent imports.
CREATE UNIQUE INDEX IF NOT EXISTS green_spaces_source_external_idx
  ON public.green_spaces (source, external_id)
  WHERE external_id IS NOT NULL;

-- trees (all current trees are curated escocell examples)
ALTER TABLE public.trees
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'example';
