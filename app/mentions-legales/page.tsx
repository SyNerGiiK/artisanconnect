import Link from 'next/link'
import Card from '@/components/ui/Card'

export const metadata = {
  title: 'Mentions Légales - ArtisanConnect',
  description: 'Mentions Légales de la plateforme ArtisanConnect',
}

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-[860px] px-7 py-12">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ac-primary-text transition-colors hover:text-ac-primary-dark"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à l&apos;accueil
        </Link>
      </div>

      <Card className="p-8 sm:p-12">
        <h1 className="mb-7 border-b border-ac-border pb-5 text-[28px] font-extrabold tracking-tight text-ac-text">
          Mentions légales
        </h1>

        <div className="mb-8 rounded-ac border border-ac-border bg-ac-bg p-4 text-sm italic text-ac-text-sub">
          <p>
            Conformément à la législation française relative à la confiance dans l&apos;économie numérique (LCEN), l&apos;omission ou l&apos;inexactitude de ces mentions vous expose à des sanctions pénales pouvant aller jusqu&apos;à un an d&apos;emprisonnement ferme et 375&nbsp;000&nbsp;euros d&apos;amende.
          </p>
        </div>

        <div className="space-y-8 text-ac-text-sub">
          <section>
            <h2 className="mb-4 text-lg font-bold text-ac-text">1. Éditeur du site / de l&apos;application</h2>
            <ul className="space-y-3">
              <li><span className="font-semibold text-ac-text">Dénomination sociale :</span> [Nom de votre société]</li>
              <li><span className="font-semibold text-ac-text">Forme juridique :</span> Société par Actions Simplifiée (SAS)</li>
              <li><span className="font-semibold text-ac-text">Capital social :</span> [Montant de votre capital de départ, ex: 1&nbsp;000] €</li>
              <li><span className="font-semibold text-ac-text">Siège social :</span> [Adresse postale complète de votre siège social]</li>
              <li><span className="font-semibold text-ac-text">Numéro SIRET :</span> [Votre numéro SIRET]</li>
              <li><span className="font-semibold text-ac-text">RCS :</span> Immatriculée au Registre du Commerce et des Sociétés de [Ville]</li>
              <li><span className="font-semibold text-ac-text">Directeur de la publication / Président :</span> [Votre Prénom et Nom]</li>
              <li><span className="font-semibold text-ac-text">Contact :</span> [Votre adresse e-mail de contact]</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-ac-text">2. Hébergement</h2>
            <ul className="space-y-3">
              <li><span className="font-semibold text-ac-text">Hébergeur :</span> [Nom de l&apos;hébergeur, ex: Vercel Inc. ou Scaleway]</li>
              <li><span className="font-semibold text-ac-text">Raison sociale de l&apos;hébergeur :</span> [Raison sociale]</li>
              <li><span className="font-semibold text-ac-text">Adresse physique :</span> [Adresse postale de l&apos;hébergeur]</li>
              <li><span className="font-semibold text-ac-text">Numéro de téléphone :</span> [Numéro de téléphone de l&apos;hébergeur]</li>
            </ul>
          </section>
        </div>
      </Card>
    </div>
  )
}
