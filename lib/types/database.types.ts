/**
 * Types TypeScript générés manuellement à partir du schéma SQL.
 * À régénérer via CLI après connexion au projet Supabase :
 *   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/types/database.types.ts
 */

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'particulier' | 'artisan'
          prenom: string
          nom: string
          telephone: string | null
          created_at: string
        }
        Insert: {
          id: string
          role: 'particulier' | 'artisan'
          prenom: string
          nom: string
          telephone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          role?: 'particulier' | 'artisan'
          prenom?: string
          nom?: string
          telephone?: string | null
          created_at?: string
        }
      }
      particuliers: {
        Row: {
          id: string
          profil_id: string
          adresse: string | null
          code_postal: string | null
          ville: string | null
        }
        Insert: {
          id?: string
          profil_id: string
          adresse?: string | null
          code_postal?: string | null
          ville?: string | null
        }
        Update: {
          id?: string
          profil_id?: string
          adresse?: string | null
          code_postal?: string | null
          ville?: string | null
        }
      }
      artisans: {
        Row: {
          id: string
          profil_id: string
          siret: string | null
          nom_entreprise: string
          description: string | null
          code_postal_base: string
          rayon_km: number
          abonnement_actif: boolean
          abonnement_expire_le: string | null
        }
        Insert: {
          id?: string
          profil_id: string
          siret?: string | null
          nom_entreprise: string
          description?: string | null
          code_postal_base: string
          rayon_km?: number
          abonnement_actif?: boolean
          abonnement_expire_le?: string | null
        }
        Update: {
          id?: string
          profil_id?: string
          siret?: string | null
          nom_entreprise?: string
          description?: string | null
          code_postal_base?: string
          rayon_km?: number
          abonnement_actif?: boolean
          abonnement_expire_le?: string | null
        }
      }
      categories_metiers: {
        Row: {
          id: number
          slug: string
          libelle: string
        }
        Insert: {
          id?: number
          slug: string
          libelle: string
        }
        Update: {
          id?: number
          slug?: string
          libelle?: string
        }
      }
      artisan_categories: {
        Row: {
          artisan_id: string
          categorie_id: number
        }
        Insert: {
          artisan_id: string
          categorie_id: number
        }
        Update: {
          artisan_id?: string
          categorie_id?: number
        }
      }
      projets: {
        Row: {
          id: string
          particulier_id: string
          categorie_id: number
          titre: string
          description: string
          adresse: string
          code_postal: string
          ville: string
          statut: 'ouvert' | 'en_cours' | 'termine' | 'annule'
          created_at: string
        }
        Insert: {
          id?: string
          particulier_id: string
          categorie_id: number
          titre: string
          description: string
          adresse: string
          code_postal: string
          ville: string
          statut?: 'ouvert' | 'en_cours' | 'termine' | 'annule'
          created_at?: string
        }
        Update: {
          id?: string
          particulier_id?: string
          categorie_id?: number
          titre?: string
          description?: string
          adresse?: string
          code_postal?: string
          ville?: string
          statut?: 'ouvert' | 'en_cours' | 'termine' | 'annule'
          created_at?: string
        }
      }
      reponses: {
        Row: {
          id: string
          projet_id: string
          artisan_id: string
          message_initial: string
          statut: 'en_attente' | 'acceptee' | 'refusee'
          created_at: string
        }
        Insert: {
          id?: string
          projet_id: string
          artisan_id: string
          message_initial: string
          statut?: 'en_attente' | 'acceptee' | 'refusee'
          created_at?: string
        }
        Update: {
          id?: string
          projet_id?: string
          artisan_id?: string
          message_initial?: string
          statut?: 'en_attente' | 'acceptee' | 'refusee'
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          projet_id: string
          artisan_id: string
          particulier_id: string
          created_at: string
        }
        Insert: {
          id?: string
          projet_id: string
          artisan_id: string
          particulier_id: string
          created_at?: string
        }
        Update: {
          id?: string
          projet_id?: string
          artisan_id?: string
          particulier_id?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          auteur_id: string
          contenu: string
          lu: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          auteur_id: string
          contenu: string
          lu?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          auteur_id?: string
          contenu?: string
          lu?: boolean
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// ---- Helpers de types pour simplifier l'usage dans le code ----

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Particulier = Database['public']['Tables']['particuliers']['Row']
export type Artisan = Database['public']['Tables']['artisans']['Row']
export type CategorieMetier = Database['public']['Tables']['categories_metiers']['Row']
export type Projet = Database['public']['Tables']['projets']['Row']
export type Reponse = Database['public']['Tables']['reponses']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Message = Database['public']['Tables']['messages']['Row']

export type ProjetStatut = Projet['statut']
export type ReponseStatut = Reponse['statut']
export type UserRole = Profile['role']
