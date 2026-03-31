-- Migration 008: Support Stripe Monetization
ALTER TABLE artisans
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_subscription_id TEXT;
