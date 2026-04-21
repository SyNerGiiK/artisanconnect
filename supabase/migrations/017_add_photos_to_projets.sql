-- Add photos column to projets table
ALTER TABLE projets ADD COLUMN IF NOT EXISTS photos text[] DEFAULT '{}'::text[];
