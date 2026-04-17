-- ============================================================
-- MIGRATION 009 : Support Stripe (idempotent)
-- ============================================================

ALTER TABLE artisans
  ADD COLUMN IF NOT EXISTS stripe_customer_id     text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- Un client Stripe ne peut être lié qu'à un seul artisan
ALTER TABLE artisans
  DROP CONSTRAINT IF EXISTS artisans_stripe_customer_id_unique;
ALTER TABLE artisans
  ADD CONSTRAINT artisans_stripe_customer_id_unique
    UNIQUE (stripe_customer_id);
