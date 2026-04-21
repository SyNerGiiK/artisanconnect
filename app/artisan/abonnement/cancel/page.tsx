import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function AbonnementCancelPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-ac-amber-light ring-4 ring-ac-amber-border/50">
          <svg
            className="h-10 w-10 text-ac-amber"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-ac-text">
          Paiement annulé
        </h1>
        <p className="mb-7 text-sm text-ac-text-sub">
          Vous n&apos;avez pas finalisé votre abonnement. L&apos;accès Premium aux chantiers reste bloqué.
        </p>

        <div className="flex flex-col gap-2">
          <Button href="/artisan/abonnement" size="lg" full>
            Reprendre l&apos;abonnement
          </Button>
          <Button href="/artisan/feed" variant="secondary" size="md" full>
            Retour au tableau de bord
          </Button>
        </div>
      </Card>
    </div>
  )
}
