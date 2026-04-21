import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

type FeatureType = 'boost' | 'urgence' | 'photos'

const FEATURE_PRICES: Record<FeatureType, string | undefined> = {
  boost: process.env.STRIPE_PRICE_ID_BOOST,
  urgence: process.env.STRIPE_PRICE_ID_URGENCE,
  photos: process.env.STRIPE_PRICE_ID_PHOTOS,
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id)
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const { data: particulier } = await supabase
      .from('particuliers')
      .select('id')
      .eq('profil_id', user.id)
      .single()
    if (!particulier) return new NextResponse('Not a particulier', { status: 403 })

    const body = await req.json().catch(() => ({}))
    const featureType = body.type as string | undefined
    const projetId = body.projet_id as string | undefined

    // Validate inputs
    if (!featureType || !projetId) {
      return new NextResponse('Missing parameters', { status: 400 })
    }

    if (!(featureType in FEATURE_PRICES) || !FEATURE_PRICES[featureType as FeatureType]) {
      return new NextResponse('Invalid feature type', { status: 400 })
    }

    // Validate UUID format to prevent injection
    if (!isValidUUID(projetId)) {
      return new NextResponse('Invalid project ID', { status: 400 })
    }

    // Verify the particulier owns this project
    const { data: projet } = await supabase
      .from('projets')
      .select('id')
      .eq('id', projetId)
      .eq('particulier_id', particulier.id)
      .single()
    if (!projet) return new NextResponse('Projet not found', { status: 404 })

    const priceId = FEATURE_PRICES[featureType as FeatureType]!
    const appUrl = body.return_url || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${appUrl}/particulier/projet/${projetId}?boost=success`,
      cancel_url: `${appUrl}/particulier/projet/${projetId}`,
      client_reference_id: particulier.id,
      metadata: { type: featureType, projet_id: projetId },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    console.error('[STRIPE_CHECKOUT_PROJET_ERROR]', err)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
