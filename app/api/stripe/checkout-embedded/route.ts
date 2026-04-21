import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { data: particulier } = await supabase
      .from('particuliers')
      .select('id')
      .eq('profil_id', session.user.id)
      .single()

    if (!particulier) {
      return NextResponse.json({ error: 'Profil particulier introuvable' }, { status: 404 })
    }

    const { return_url } = await req.json()

    if (!process.env.STRIPE_PRICE_ID_PHOTOS) {
      return NextResponse.json({ error: 'Prix manquant dans la configuration' }, { status: 500 })
    }

    // Create a Checkout Session with ui_mode: 'embedded'
    const checkoutSession = await stripe.checkout.sessions.create({
      ui_mode: 'embedded' as any,
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_PHOTOS,
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: return_url,
      client_reference_id: particulier.id,
      metadata: { type: 'pack_photos_credit' }
    })

    if (!checkoutSession.client_secret) {
      return NextResponse.json({ error: 'Erreur génération du paiement' }, { status: 500 })
    }

    return NextResponse.json({ clientSecret: checkoutSession.client_secret })
  } catch (err: any) {
    console.error('Stripe Embedded Checkout Error:', err)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
