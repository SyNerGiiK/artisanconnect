import Link from 'next/link'
import Card from '@/components/ui/Card'

export const metadata = {
  title: 'Conditions Générales de Vente - ArtisanConnect',
  description: 'Conditions Générales de Vente applicables aux Professionnels (B2B)',
}

export default function CGVPage() {
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
        <h1 className="mb-4 text-[28px] font-extrabold tracking-tight text-ac-text">
          Conditions générales de vente (CGV) — B2B
        </h1>
        <p className="mb-7 border-b border-ac-border pb-5 text-sm italic text-ac-text-muted">
          Ces CGV matérialisent le socle contractuel avec les artisans abonnés à notre plateforme.
        </p>

        <div className="space-y-8 text-ac-text-sub">
          <section>
            <h2 className="mb-4 text-lg font-bold text-ac-text">Article 1 : Objet et Champ d&apos;application</h2>
            <p className="mb-3">Les présentes Conditions Générales de Vente (CGV) définissent les relations contractuelles entre la Plateforme et le Professionnel (ci-après le &laquo;&nbsp;Partenaire&nbsp;&raquo;) souscrivant à nos services d&apos;abonnement SaaS.</p>
            <p>Le Partenaire agissant dans le cadre de son activité principale, les dispositions du Code de la consommation relatives au droit de rétractation ne sont pas applicables à ce contrat B2B.</p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-ac-text">Article 2 : Description du Service (Abonnement SaaS)</h2>
            <p className="mb-3">La Plateforme fournit un service d&apos;intermédiation numérique permettant aux Partenaires d&apos;accéder à des demandes de devis qualifiées déposées par des particuliers.</p>
            <p className="mb-3">Le service repose sur un modèle d&apos;abonnement forfaitaire garantissant :</p>
            <ul className="mb-3 list-disc space-y-2 pl-5">
              <li>0&nbsp;% de commission sur les chantiers signés.</li>
              <li>Une limitation stricte de la concurrence (les coordonnées d&apos;un prospect ne sont accessibles qu&apos;à un maximum de 3 artisans).</li>
            </ul>
            <p className="mb-3">La Plateforme intervient comme simple fournisseur de moyens et d&apos;intermédiaire.</p>
            <p>Elle ne garantit en aucun cas la conclusion d&apos;un contrat final avec le client, sa solvabilité, ni l&apos;exactitude absolue des informations fournies par ce dernier.</p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-ac-text">Article 3 : Tarification et Modalités de Paiement</h2>
            <p className="mb-3">L&apos;accès aux services est facturé sous forme d&apos;un abonnement (mensuel ou annuel). Les tarifs en vigueur sont explicitement exprimés en euros, à la fois Toutes Taxes Comprises (TTC) et Hors Taxes (HT).</p>
            <p className="mb-3">Le paiement s&apos;effectue par prélèvement automatique (via notre partenaire sécurisé Stripe) en début de période de facturation.</p>
            <p>Le Partenaire s&apos;engage à maintenir des coordonnées bancaires valides.</p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-ac-text">Article 4 : Retard de Paiement et Pénalités</h2>
            <p className="mb-3">Tout retard ou défaut de paiement à l&apos;échéance prévue entraînera l&apos;exigibilité immédiate de l&apos;intégralité des sommes dues. Conformément aux articles L.441-6 et D.441-5 du Code de commerce, ce retard donnera lieu automatiquement et sans mise en demeure préalable à :</p>
            <ul className="mb-3 list-disc space-y-2 pl-5">
              <li>La facturation d&apos;une indemnité forfaitaire de 40&nbsp;euros pour frais de recouvrement.</li>
              <li>L&apos;application d&apos;intérêts de pénalités de retard calculés au taux d&apos;un pour cent (1&nbsp;%) du montant restant dû, par jour de retard.</li>
            </ul>
            <p>La Plateforme se réserve également le droit de suspendre l&apos;accès au compte du Partenaire jusqu&apos;au parfait règlement.</p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-ac-text">Article 5 : Engagements du Partenaire</h2>
            <p className="mb-3">Le Partenaire s&apos;engage expressément à :</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Détenir les qualifications requises et être à jour de ses assurances professionnelles obligatoires (notamment la garantie décennale).</li>
              <li>Respecter les normes en vigueur, le droit fiscal et social.</li>
              <li>Établir des devis gratuits (sauf accord contraire préalable) et respecter les délais annoncés.</li>
              <li>Ne jamais céder, revendre ou transmettre les coordonnées des prospects (Marchés) à des tiers, sous peine de poursuites judiciaires et de résiliation immédiate du compte.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-ac-text">Article 6 : Durée et Résiliation (Loi &laquo; Pouvoir d&apos;Achat &raquo;)</h2>
            <p className="mb-3">L&apos;abonnement est conclu pour une durée indéterminée (ou avec engagement annuel selon l&apos;offre choisie).</p>
            <p className="mb-3">Conformément à la loi de protection du pouvoir d&apos;achat du 1er juin 2023, le Partenaire dispose d&apos;une fonctionnalité de &laquo;&nbsp;résiliation en trois clics&nbsp;&raquo; directement accessible et gratuite depuis son espace personnel, lui permettant de mettre fin à son abonnement de manière simple et instantanée.</p>
            <p>La résiliation prendra effet à la fin du cycle de facturation en cours.</p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-ac-text">Article 7 : Limites de Responsabilité</h2>
            <p className="mb-3">La Plateforme ne s&apos;immisce à aucun moment dans la relation juridique, commerciale ou technique entre le Partenaire et le client final.</p>
            <p className="mb-3">En cas de litige, de mauvaise exécution des travaux ou de non-paiement par le client, la responsabilité de la Plateforme ne pourra en aucun cas être engagée.</p>
            <p>Le Partenaire s&apos;engage à garantir la Plateforme contre tout recours intenté par un client lié à sa prestation.</p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-ac-text">Article 8 : Droit Applicable et Juridiction Compétente</h2>
            <p className="mb-3">Les présentes CGV sont soumises à la loi française.</p>
            <p className="mb-3">En cas de litige ou de contentieux contractuel qui ne pourrait être résolu à l&apos;amiable, seules les juridictions du ressort du siège social de la Plateforme (Tribunal de Commerce de votre ville) seront compétentes.</p>
            <p>La Plateforme se réserve le droit de modifier les présentes CGV à tout moment, sous réserve d&apos;en informer le Partenaire avec un préavis d&apos;au moins 30&nbsp;jours.</p>
          </section>
        </div>
      </Card>
    </div>
  )
}
