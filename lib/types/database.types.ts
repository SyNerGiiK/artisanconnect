/**
 * Types TypeScript manuels alignés sur le schéma Supabase.
 *
 * Structure conforme à celle produite par `supabase gen types typescript`.
 * À régénérer via CLI quand possible :
 *   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/types/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '12'
  }
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
        Relationships: []
      }
      particuliers: {
        Row: {
          id: string
          profil_id: string
          adresse: string | null
          code_postal: string | null
          ville: string | null
          credits_photos: number
        }
        Insert: {
          id?: string
          profil_id: string
          adresse?: string | null
          code_postal?: string | null
          ville?: string | null
          credits_photos?: number
        }
        Update: {
          id?: string
          profil_id?: string
          adresse?: string | null
          code_postal?: string | null
          ville?: string | null
          credits_photos?: number
        }
        Relationships: [
          {
            foreignKeyName: 'particuliers_profil_id_fkey'
            columns: ['profil_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      artisans: {
        Row: {
          id: string
          profil_id: string
          slug: string
          siret: string | null
          nom_entreprise: string
          description: string | null
          code_postal_base: string
          rayon_km: number
          abonnement_actif: boolean
          abonnement_expire_le: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          photos_realisations: string[] | null
          assurance_pro: boolean
        }
        Insert: {
          id?: string
          profil_id: string
          slug?: string
          siret?: string | null
          nom_entreprise: string
          description?: string | null
          code_postal_base: string
          rayon_km?: number
          abonnement_actif?: boolean
          abonnement_expire_le?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          photos_realisations?: string[] | null
          assurance_pro?: boolean
        }
        Update: {
          id?: string
          profil_id?: string
          slug?: string
          siret?: string | null
          nom_entreprise?: string
          description?: string | null
          code_postal_base?: string
          rayon_km?: number
          abonnement_actif?: boolean
          abonnement_expire_le?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          photos_realisations?: string[] | null
          assurance_pro?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'artisans_profil_id_fkey'
            columns: ['profil_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: 'artisan_categories_artisan_id_fkey'
            columns: ['artisan_id']
            isOneToOne: false
            referencedRelation: 'artisans'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'artisan_categories_categorie_id_fkey'
            columns: ['categorie_id']
            isOneToOne: false
            referencedRelation: 'categories_metiers'
            referencedColumns: ['id']
          }
        ]
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
          photos: string[] | null
          is_boosted: boolean
          is_urgent: boolean
          photos_unlocked: boolean
          created_at: string
          updated_at: string
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
          photos?: string[] | null
          is_boosted?: boolean
          is_urgent?: boolean
          photos_unlocked?: boolean
          created_at?: string
          updated_at?: string
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
          photos?: string[] | null
          is_boosted?: boolean
          is_urgent?: boolean
          photos_unlocked?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'projets_particulier_id_fkey'
            columns: ['particulier_id']
            isOneToOne: false
            referencedRelation: 'particuliers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'projets_categorie_id_fkey'
            columns: ['categorie_id']
            isOneToOne: false
            referencedRelation: 'categories_metiers'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: 'reponses_projet_id_fkey'
            columns: ['projet_id']
            isOneToOne: false
            referencedRelation: 'projets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reponses_artisan_id_fkey'
            columns: ['artisan_id']
            isOneToOne: false
            referencedRelation: 'artisans'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: 'conversations_projet_id_fkey'
            columns: ['projet_id']
            isOneToOne: false
            referencedRelation: 'projets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'conversations_artisan_id_fkey'
            columns: ['artisan_id']
            isOneToOne: false
            referencedRelation: 'artisans'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'conversations_particulier_id_fkey'
            columns: ['particulier_id']
            isOneToOne: false
            referencedRelation: 'particuliers'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: 'messages_conversation_id_fkey'
            columns: ['conversation_id']
            isOneToOne: false
            referencedRelation: 'conversations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'messages_auteur_id_fkey'
            columns: ['auteur_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      avis: {
        Row: {
          id: string
          particulier_id: string
          artisan_id: string
          projet_id: string
          note: number
          commentaire: string
          created_at: string
        }
        Insert: {
          id?: string
          particulier_id: string
          artisan_id: string
          projet_id: string
          note: number
          commentaire: string
          created_at?: string
        }
        Update: {
          id?: string
          particulier_id?: string
          artisan_id?: string
          projet_id?: string
          note?: number
          commentaire?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'avis_particulier_id_fkey'
            columns: ['particulier_id']
            isOneToOne: false
            referencedRelation: 'particuliers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'avis_artisan_id_fkey'
            columns: ['artisan_id']
            isOneToOne: false
            referencedRelation: 'artisans'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'avis_projet_id_fkey'
            columns: ['projet_id']
            isOneToOne: false
            referencedRelation: 'projets'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      v_conversations_details: {
        Row: {
          conversation_id: string
          projet_id: string
          artisan_id: string
          particulier_id: string
          conversation_created_at: string
          projet_titre: string
          particulier_profil_id: string
          particulier_prenom: string
          particulier_nom: string
          artisan_profil_id: string
          artisan_nom_entreprise: string
          artisan_prenom: string
          artisan_nom: string
          last_message: string | null
          last_message_date: string | null
          unread_particulier_count: number
          unread_artisan_count: number
        }
        Relationships: []
      }
      v_artisans_public: {
        Row: {
          id: string
          profil_id: string
          slug: string
          nom_entreprise: string
          description: string | null
          siret: string | null
          code_postal_base: string
          rayon_km: number
          assurance_pro: boolean
          photos_realisations: string[] | null
          updated_at: string
          note_moyenne: number
          nombre_avis: number
        }
        Relationships: []
      }
      v_profiles_public: {
        Row: {
          id: string
          prenom: string
          nom: string
        }
        Relationships: []
      }
    }
    Functions: {
      update_artisan_categories: {
        Args: {
          p_artisan_id: string
          p_categorie_ids: number[]
        }
        Returns: undefined
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
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
export type Avis = Database['public']['Tables']['avis']['Row']
