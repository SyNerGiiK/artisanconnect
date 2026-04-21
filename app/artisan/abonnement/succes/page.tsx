import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import AlertBanner from '@/components/ui/AlertBanner'

export default function AbonnementSuccesPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-ac-green-light ring-4 ring-ac-green-border/50">
          <svg
            className="h-10 w-10 text-ac-green"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-ac-text">
          Paiement réussi !
        </h1>
        <p className="mb-6 text-sm text-ac-text-sub">
          Félicitations, votre abonnement Premium est maintenant actif. Vous avez désormais un accès total aux chantiers de votre secteur.
        </p>

        <div className="mb-6 text-left">
          <AlertBanner
            kind="info"
            title="Activation en cours"
            desc="Si le Feed reste vide, patientez quelques instants puis actualisez la page."
          />
        </div>

        <Button href="/artisan/feed" size="lg" full>
          Trouver mes premiers chantiers →
        </Button>
      </Card>
    </div>
  )
}
