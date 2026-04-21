-- Migration 023: Add credits_photos to particuliers
ALTER TABLE particuliers ADD COLUMN IF NOT EXISTS credits_photos INT DEFAULT 0 NOT NULL;
