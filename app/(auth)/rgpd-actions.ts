'use server'

import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Supprime de manière irréversible le compte de l'utilisateur.
 * L'API Admin de Supabase doit être utilisée pour supprimer dans auth.users.
 * La suppression s'occupera d'effacer les profils, les projets, et les messages via ON DELETE CASCADE.
 */
export async function deleteUserAccount(password: string) {
  const supabaseServer = await createServerClient()
  const { data: { user } } = await supabaseServer.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  // Vérifier le mot de passe avant suppression
  const { error: authError } = await supabaseServer.auth.signInWithPassword({
    email: user.email!,
    password,
  })
  if (authError) return { error: 'Mot de passe incorrect' }

  // Utiliser le Service Role Key pour contourner RLS et interagir avec l'Auth Admin
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id)

  if (error) {
    console.error('GDPR Deletion Error:', error)
    return { error: "Une erreur critique est survenue lors de la suppression du compte." }
  }

  // Déconnexion de la session locale et redirection
  await supabaseServer.auth.signOut()
  redirect('/?deleted=true')
}
