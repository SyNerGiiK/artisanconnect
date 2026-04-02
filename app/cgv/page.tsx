import Link from 'next/link'

export const metadata = {
  title: 'Conditions Générales de Vente - ArtisanConnect',
  description: 'Conditions Générales de Vente applicables aux Professionnels (B2B)',
}

export default function CGVPage() {
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
          CONDITIONS GÉNÉRALES DE VENTE (CGV) - Applicables aux Professionnels (B2B)
        </h1>
        <p className="text-gray-600 mb-8 italic">
          Ces CGV matérialisent le socle contractuel avec les artisans abonnés à notre plateforme.
        </p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 1 : Objet et Champ d'application</h2>
            <p className="mb-3">Les présentes Conditions Générales de Vente (CGV) définissent les relations contractuelles entre la Plateforme et le Professionnel (ci-après le "Partenaire") souscrivant à nos services d'abonnement SaaS.</p>
            <p>Le Partenaire agissant dans le cadre de son activité principale, les dispositions du Code de la consommation relatives au droit de rétractation ne sont pas applicables à ce contrat B2B.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 2 : Description du Service (Abonnement SaaS)</h2>
            <p className="mb-3">La Plateforme fournit un service d'intermédiation numérique permettant aux Partenaires d'accéder à des demandes de devis qualifiées déposées par des particuliers.</p>
            <p className="mb-3">Le service repose sur un modèle d'abonnement forfaitaire garantissant :</p>
            <ul className="list-disc pl-5 space-y-2 mb-3">
              <li>0 % de commission sur les chantiers signés.</li>
              <li>Une limitation stricte de la concurrence (les coordonnées d'un prospect ne sont accessibles qu'à un maximum de 3 artisans).</li>
            </ul>
            <p className="mb-3">La Plateforme intervient comme simple fournisseur de moyens et d'intermédiaire.</p>
            <p>Elle ne garantit en aucun cas la conclusion d'un contrat final avec le client, sa solvabilité, ni l'exactitude absolue des informations fournies par ce dernier.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 3 : Tarification et Modalités de Paiement</h2>
            <p className="mb-3">L'accès aux services est facturé sous forme d'un abonnement (mensuel ou annuel). Les tarifs en vigueur sont explicitement exprimés en euros, à la fois Toutes Taxes Comprises (TTC) et Hors Taxes (HT).</p>
            <p className="mb-3">Le paiement s'effectue par prélèvement automatique (via notre partenaire sécurisé Stripe) en début de période de facturation.</p>
            <p>Le Partenaire s'engage à maintenir des coordonnées bancaires valides.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 4 : Retard de Paiement et Pénalités</h2>
            <p className="mb-3">Tout retard ou défaut de paiement à l'échéance prévue entraînera l'exigibilité immédiate de l'intégralité des sommes dues. Conformément aux articles L.441-6 et D.441-5 du Code de commerce, ce retard donnera lieu automatiquement et sans mise en demeure préalable à :</p>
            <ul className="list-disc pl-5 space-y-2 mb-3">
              <li>La facturation d'une indemnité forfaitaire de 40 euros pour frais de recouvrement.</li>
              <li>L'application d'intérêts de pénalités de retard calculés au taux d'un pour cent (1 %) du montant restant dû, par jour de retard.</li>
            </ul>
            <p>La Plateforme se réserve également le droit de suspendre l'accès au compte du Partenaire jusqu'au parfait règlement.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 5 : Engagements du Partenaire</h2>
            <p className="mb-3">Le Partenaire s'engage expressément à :</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Détenir les qualifications requises et être à jour de ses assurances professionnelles obligatoires (notamment la garantie décennale).</li>
              <li>Respecter les normes en vigueur, le droit fiscal et social.</li>
              <li>Établir des devis gratuits (sauf accord contraire préalable) et respecter les délais annoncés.</li>
              <li>Ne jamais céder, revendre ou transmettre les coordonnées des prospects (Marchés) à des tiers, sous peine de poursuites judiciaires et de résiliation immédiate du compte.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 6 : Durée et Résiliation (Loi "Pouvoir d'Achat")</h2>
            <p className="mb-3">L'abonnement est conclu pour une durée indéterminée (ou avec engagement annuel selon l'offre choisie).</p>
            <p className="mb-3">Conformément à la loi de protection du pouvoir d'achat du 1er juin 2023, le Partenaire dispose d'une fonctionnalité de "résiliation en trois clics" directement accessible et gratuite depuis son espace personnel, lui permettant de mettre fin à son abonnement de manière simple et instantanée.</p>
            <p>La résiliation prendra effet à la fin du cycle de facturation en cours.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 7 : Limites de Responsabilité</h2>
            <p className="mb-3">La Plateforme ne s'immisce à aucun moment dans la relation juridique, commerciale ou technique entre le Partenaire et le client final.</p>
            <p className="mb-3">En cas de litige, de mauvaise exécution des travaux ou de non-paiement par le client, la responsabilité de la Plateforme ne pourra en aucun cas être engagée.</p>
            <p>Le Partenaire s'engage à garantir la Plateforme contre tout recours intenté par un client lié à sa prestation.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Article 8 : Droit Applicable et Juridiction Compétente</h2>
            <p className="mb-3">Les présentes CGV sont soumises à la loi française.</p>
            <p className="mb-3">En cas de litige ou de contentieux contractuel qui ne pourrait être résolu à l'amiable, seules les juridictions du ressort du siège social de la Plateforme (Tribunal de Commerce de votre ville) seront compétentes.</p>
            <p>La Plateforme se réserve le droit de modifier les présentes CGV à tout moment, sous réserve d'en informer le Partenaire avec un préavis d'au moins 30 jours.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
