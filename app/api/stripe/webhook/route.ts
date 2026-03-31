import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('Stripe-Signature') as string

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  // Utilisation de la clé d'administration pour forcer la mise à jour (Bypass RLS)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const artisanId = session.client_reference_id || session.metadata?.artisan_id;
        
        if (artisanId) {
          await supabaseAdmin.from('artisans').update({
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            abonnement_actif: true
          }).eq('id', artisanId);
        }
        break;
      }
      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const isActive = subscription.status === 'active' || subscription.status === 'trialing';
        
        await supabaseAdmin.from('artisans').update({
          abonnement_actif: isActive,
          stripe_subscription_id: subscription.id
        }).eq('stripe_customer_id', subscription.customer);
        break;
      }
    }

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return new NextResponse('Internal Webhook Error', { status: 500 })
  }
}
