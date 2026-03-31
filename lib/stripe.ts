import Stripe from 'stripe'

// Initialiser Stripe avec la clé secrète, on fallback sur une fake key si non définie pour ne pas crasher le build Next.js
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  typescript: true,
})
