import Link from 'next/link'

export const metadata = {
  title: 'Mentions Légales - ArtisanConnect',
  description: 'Mentions Légales de la plateforme ArtisanConnect',
}

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-20 lg:py-24">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à l'accueil
        </Link>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100 sm:p-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8 pb-4 border-b">
          MENTIONS LÉGALES
        </h1>

        <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 italic">
          <p>
            Conformément à la législation française relative à la confiance dans l'économie numérique (LCEN), l'omission ou l'inexactitude de ces mentions vous expose à des sanctions pénales pouvant aller jusqu'à un an d'emprisonnement ferme et 375 000 euros d'amende.
          </p>
        </div>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Éditeur du site / de l'application</h2>
            <ul className="space-y-3">
              <li><span className="font-medium text-gray-900">Dénomination sociale :</span> [Nom de votre société]</li>
              <li><span className="font-medium text-gray-900">Forme juridique :</span> Société par Actions Simplifiée (SAS)</li>
              <li><span className="font-medium text-gray-900">Capital social :</span> [Montant de votre capital de départ, ex: 1 000] €</li>
              <li><span className="font-medium text-gray-900">Siège social :</span> [Adresse postale complète de votre siège social]</li>
              <li><span className="font-medium text-gray-900">Numéro SIRET :</span> [Votre numéro SIRET]</li>
              <li><span className="font-medium text-gray-900">RCS :</span> Immatriculée au Registre du Commerce et des Sociétés de [Ville]</li>
              <li><span className="font-medium text-gray-900">Directeur de la publication / Président :</span> [Votre Prénom et Nom]</li>
              <li><span className="font-medium text-gray-900">Contact :</span> [Votre adresse e-mail de contact]</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Hébergement</h2>
            <ul className="space-y-3">
              <li><span className="font-medium text-gray-900">Hébergeur :</span> [Nom de l'hébergeur, ex: Vercel Inc. ou Scaleway]</li>
              <li><span className="font-medium text-gray-900">Raison sociale de l'hébergeur :</span> [Raison sociale]</li>
              <li><span className="font-medium text-gray-900">Adresse physique :</span> [Adresse postale de l'hébergeur]</li>
              <li><span className="font-medium text-gray-900">Numéro de téléphone :</span> [Numéro de téléphone de l'hébergeur]</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
