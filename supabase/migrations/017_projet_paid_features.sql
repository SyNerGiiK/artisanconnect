-- Add paid client feature columns to projets table
ALTER TABLE projets
  ADD COLUMN IF NOT EXISTS is_boosted boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_urgent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS photos text[] NOT NULL DEFAULT '{}';
