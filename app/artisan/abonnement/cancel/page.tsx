import Link from 'next/link'

export default function AbonnementCancelPage() {
  return (
    <div className="flex min-h-[80vh] flex-col justify-center items-center px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl ring-1 ring-gray-100 p-8 text-center animate-in zoom-in-95 duration-200">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 mb-6">
          <svg className="h-10 w-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Paiement annulé</h1>
        <p className="text-gray-600 text-lg mb-8">
          Vous n'avez pas finalisé votre abonnement. L'accès Premium aux chantiers reste bloqué.
        </p>

        <Link 
          href="/artisan/feed"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 border border-gray-200 w-full py-4 text-sm font-bold text-gray-800 shadow-sm transition-all hover:bg-gray-200"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  )
}
