import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const { data: artisan } = await supabase
      .from('artisans')
      .select('id, stripe_customer_id')
      .eq('profil_id', user.id)
      .single<{ id: string; stripe_customer_id: string | null }>()
    if (!artisan) return new NextResponse('Not an artisan', { status: 403 })

    // Si on a pas de prix configuré
    if (!process.env.STRIPE_PRICE_ID) {
      return new NextResponse('Stripe Price ID is missing', { status: 500 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer: artisan.stripe_customer_id || undefined,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${appUrl}/artisan/abonnement/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/artisan/abonnement/cancel`,
      metadata: {
        artisan_id: artisan.id,
      },
      client_reference_id: artisan.id,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('[STRIPE_CHECKOUT_ERROR]', err)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
