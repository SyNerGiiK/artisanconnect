import Link from 'next/link'
import Card from '@/components/ui/Card'

export const metadata = {
  title: 'Conditions Générales d\'Utilisation - ArtisanConnect',
  description: 'Conditions Générales d\'Utilisation de la plateforme ArtisanConnect',
}

export default function CGUPage() {
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
          Conditions générales d&apos;utilisation (CGU)
        </h1>

        <div className="space-y-8 text-ac-text-sub">
          <section>
            <h2 className="mb-4 text-lg font-bold text-ac-text">Article 1 : Définitions</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong className="text-ac-text">Utilisateur / Client :</strong> Toute personne qui utilise la plateforme pour réaliser une demande de devis en communiquant la description de son projet et ses coordonnées.</li>
              <li><strong className="text-ac-text">Partenaire / Professionnel :</strong> Tout professionnel du bâtiment ou d&apos;activités connexes qui souscrit aux services de la plateforme pour répondre aux demandes de devis.</li>
              <li><strong className="text-ac-text">Marché :</strong> La demande de devis réalisée par un Client, mentionnant ses coordonnées et la description de son projet.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-ac-text">Article 2 : Description du Service et Gratuité pour l&apos;Utilisateur</h2>
            <p className="mb-3">La plateforme propose un service de mise en relation entre les Utilisateurs et les Professionnels.</p>
            <p className="mb-3">Pour être mis en relation, l&apos;Utilisateur doit remplir un formulaire détaillant les prestations qu&apos;il souhaite faire réaliser. Ce service de mise en relation est entièrement gratuit pour les Utilisateurs.</p>
            <p>La plateforme ne perçoit aucune commission sur le montant des prestations ou des travaux réalisés par les Professionnels.</p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-ac-text">Article 3 : Rôle et Limites de Responsabilité de la Plateforme</h2>
            <p className="mb-3">La plateforme agit en tant que simple intermédiaire et fournisseur de moyens. Ses responsabilités sont strictement limitées :</p>
            <ul className="list-disc space-y-3 pl-5">
              <li><strong className="text-ac-text">Absence d&apos;intervention commerciale :</strong> La plateforme n&apos;intervient à aucun moment dans la relation juridique ou commerciale (avant, pendant ou après les travaux) qui unit l&apos;Utilisateur et le Professionnel.</li>
              <li><strong className="text-ac-text">Exonération de garantie :</strong> La plateforme ne garantit pas la conclusion d&apos;un contrat pour le professionnel, ni la solvabilité du client. De même, elle décline toute responsabilité quant aux conséquences directes ou indirectes de la mise en relation, ainsi qu&apos;en cas d&apos;éventuels dommages ou de mauvaise exécution des travaux par le professionnel choisi.</li>
              <li><strong className="text-ac-text">Devoir de vérification :</strong> Il relève de la seule responsabilité de l&apos;Utilisateur de vérifier les références, les compétences et les assurances obligatoires du Professionnel avant de signer un devis ou de verser un acompte.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-ac-text">Article 4 : Engagements de l&apos;Utilisateur</h2>
            <p className="mb-3">En soumettant un projet, l&apos;Utilisateur s&apos;engage à :</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Utiliser le service pour des besoins personnels et pour des prestations réelles et sérieuses.</li>
              <li>Fournir des informations et des coordonnées complètes et exactes.</li>
              <li>Informer la plateforme dès que son besoin de mise en relation n&apos;est plus d&apos;actualité ou si sa demande est modifiée.</li>
              <li>Accepter que ses coordonnées puissent faire l&apos;objet d&apos;une vérification (par téléphone, e-mail, ou robot d&apos;appel) pour s&apos;assurer de la réalité de la demande. Toute demande de devis jugée abusive, fantaisiste, incomplète, ou contenant de fausses informations sera systématiquement supprimée, et les abus pourront faire l&apos;objet de poursuites.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-ac-text">Article 5 : Engagements des Professionnels (Charte de Qualité)</h2>
            <p className="mb-3">Pour garantir un service de qualité, les Professionnels s&apos;engagent à :</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Répondre aux demandes de devis dans de brefs délais (ex: sous 3 jours).</li>
              <li>Établir des devis gratuits pour les Utilisateurs et respecter les engagements et délais qui y sont indiqués.</li>
              <li>Être à jour de leurs assurances obligatoires (notamment la garantie décennale) et respecter la réglementation fiscale, sociale et les normes en vigueur.</li>
              <li>Réaliser des prestations de qualité et assurer un service après-vente.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-ac-text">Article 6 : Publication d&apos;Avis</h2>
            <p className="mb-3">L&apos;Utilisateur a la possibilité de publier un avis et d&apos;attribuer une note à un Professionnel.</p>
            <p className="mb-3">Toutefois, cela n&apos;est autorisé que si un contrat ou une prestation de service a été formellement accepté entre les deux parties, et que le chantier a débuté et/ou qu&apos;un paiement a été effectué.</p>
            <p>La plateforme se réserve le droit de refuser ou de supprimer tout avis contraire à la législation ou à sa politique de gestion des avis.</p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-ac-text">Article 7 : Protection des Données Personnelles (RGPD)</h2>
            <p className="mb-3">Les données nominatives demandées à l&apos;Utilisateur sont strictement nécessaires à l&apos;exécution du service de mise en relation et sont transmises aux Professionnels afin de leur permettre d&apos;établir un devis.</p>
            <p>Conformément à la loi « Informatique et Libertés » et à la réglementation européenne (RGPD), l&apos;Utilisateur dispose d&apos;un droit permanent d&apos;accès, de modification, de rectification, de portabilité, d&apos;opposition et de suppression de ses données.</p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-ac-text">Article 8 : Démarchage Téléphonique</h2>
            <p>Il est rappelé à l&apos;Utilisateur qu&apos;il a la possibilité, s&apos;il ne souhaite pas faire l&apos;objet de prospection commerciale par voie téléphonique de la part de professionnels avec lesquels il n&apos;a pas de relation contractuelle en cours, de s&apos;inscrire gratuitement sur la liste nationale d&apos;opposition au démarchage téléphonique (www.bloctel.gouv.fr).</p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-ac-text">Article 9 : Médiation des Litiges</h2>
            <p>Conformément au Code de la consommation, en cas de difficulté ou de litige avec les services fournis par la plateforme, l&apos;Utilisateur a le droit de recourir gratuitement à un dispositif de médiation de la consommation (par exemple en saisissant une entité de médiation agréée comme le CM2C) en vue d&apos;une résolution amiable.</p>
          </section>
        </div>
      </Card>
    </div>
  )
}
