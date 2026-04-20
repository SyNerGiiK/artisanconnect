import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('Stripe-Signature') as string

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Webhook signature verification failed:', msg)
    return new NextResponse(`Webhook Error: ${msg}`, { status: 400 })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const featureType = session.metadata?.type;
        const projetId = session.metadata?.projet_id;
        const particulierId = session.client_reference_id;

        // Client feature purchase (boost / urgence / photos)
        if (featureType && projetId && particulierId) {
          // Verify projet ownership before updating
          const { data: projet, error: fetchError } = await supabaseAdmin
            .from('projets')
            .select('id, particulier_id')
            .eq('id', projetId)
            .eq('particulier_id', particulierId)
            .single();

          if (fetchError || !projet) {
            console.error('Projet not found or ownership mismatch', { projetId, particulierId });
            break;
          }

          const updates: Record<string, boolean> = {}
          if (featureType === 'boost') updates.is_boosted = true
          if (featureType === 'urgence') updates.is_urgent = true
          if (featureType === 'photos') updates.photos_unlocked = true

          if (Object.keys(updates).length > 0) {
            await supabaseAdmin.from('projets').update(updates).eq('id', projetId)
          }
          break
        }

        // Artisan subscription purchase
        const artisanId = session.client_reference_id;
        if (artisanId) {
          // Verify artisan exists before updating
          const { data: artisan, error: fetchError } = await supabaseAdmin
            .from('artisans')
            .select('id')
            .eq('id', artisanId)
            .single();

          if (!fetchError && artisan) {
            await supabaseAdmin.from('artisans').update({
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
              abonnement_actif: true
            }).eq('id', artisanId);
          }
        }
        break;
      }
      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const isActive = subscription.status === 'active' || subscription.status === 'trialing';

        if (subscription.customer) {
          await supabaseAdmin.from('artisans').update({
            abonnement_actif: isActive,
            stripe_subscription_id: subscription.id
          }).eq('stripe_customer_id', subscription.customer as string);
        }
        break;
      }
    }

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return new NextResponse('Internal Webhook Error', { status: 500 })
  }
}
