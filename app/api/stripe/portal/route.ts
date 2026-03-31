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
    if (!artisan || !artisan.stripe_customer_id) {
        return new NextResponse('Customer not found', { status: 404 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: artisan.stripe_customer_id,
      return_url: `${appUrl}/artisan/profil`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (err: any) {
    console.error('[STRIPE_PORTAL_ERROR]', err)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
