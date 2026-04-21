'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { validateString, validateCodePostal, validateInt } from '@/lib/utils/validation'
import { stripe } from '@/lib/stripe'

const FEATURE_PRICES: Record<string, string | undefined> = {
  boost: process.env.STRIPE_PRICE_ID_BOOST,
  urgence: process.env.STRIPE_PRICE_ID_URGENCE,
  photos: process.env.STRIPE_PRICE_ID_PHOTOS,
}

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const { data: particulier } = await supabase
    .from('particuliers')
    .select('id')
    .eq('profil_id', user.id)
    .single()

  if (!particulier) redirect('/particulier/onboarding')

  let titre, description, categorieId, adresse, codePostal, ville;
  try {
    titre = validateString(formData.get('titre'), 'Titre', 5, 150)
    description = validateString(formData.get('description'), 'Description', 20, 2000)
    categorieId = validateInt(formData.get('categorie_id'), 'Catégorie', 1)
    adresse = validateString(formData.get('adresse'), 'Adresse', 5, 200)
    codePostal = validateCodePostal(formData.get('code_postal'))
    ville = validateString(formData.get('ville'), 'Ville', 2, 100)
  } catch (e) {
    return { error: (e as Error).message }
  }

  const { data: insertedProjet, error } = await supabase
    .from('projets')
    .insert({
      particulier_id: particulier.id,
      categorie_id: categorieId,
      titre,
      description,
      adresse,
      code_postal: codePostal,
      ville,
    })
    .select('id')
    .single()

  if (error || !insertedProjet) {
    return { error: error?.message || 'Erreur lors de la création' }
  }

  // Handle Premium features
  const opt_boost = formData.get('opt_boost') === 'on'
  const opt_urgence = formData.get('opt_urgence') === 'on'
  const opt_photos = formData.get('opt_photos') === 'on'

  const line_items = []
  const featuresList = []

  if (opt_boost && FEATURE_PRICES.boost) {
    line_items.push({ price: FEATURE_PRICES.boost, quantity: 1 })
    featuresList.push('boost')
  }
  if (opt_urgence && FEATURE_PRICES.urgence) {
    line_items.push({ price: FEATURE_PRICES.urgence, quantity: 1 })
    featuresList.push('urgence')
  }
  if (opt_photos && FEATURE_PRICES.photos) {
    line_items.push({ price: FEATURE_PRICES.photos, quantity: 1 })
    featuresList.push('photos')
  }

  if (line_items.length > 0) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${appUrl}/particulier/projet/${insertedProjet.id}?premium=success`,
      cancel_url: `${appUrl}/particulier/projet/${insertedProjet.id}`,
      client_reference_id: particulier.id,
      metadata: { type: featuresList.join(','), projet_id: insertedProjet.id },
    })

    if (session.url) {
      redirect(session.url)
    }
  }

  redirect('/particulier/dashboard')
}
