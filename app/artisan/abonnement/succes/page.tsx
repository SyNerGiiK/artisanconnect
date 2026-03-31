import Link from 'next/link'

export default function AbonnementSuccesPage() {
  return (
    <div className="flex min-h-[80vh] flex-col justify-center items-center px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl ring-1 ring-gray-100 p-8 text-center animate-in zoom-in-95 duration-500">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6">
          <svg className="h-10 w-10 text-green-600 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Paiement Réussi !</h1>
        <p className="text-gray-600 text-lg mb-8">
          Félicitations, votre abonnement Premium est maintenant actif. Vous avez désormais un accès total aux demandes de chantiers dans votre secteur.
        </p>

        <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-xl mb-8 flex items-start gap-3">
          <svg className="h-5 w-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-left font-medium">Votre accès est en cours d'activation technique. Si le Feed reste vide, patientez quelques instants et actualisez la page.</p>
        </div>

        <Link 
          href="/artisan/feed"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 w-full py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:scale-[1.02]"
        >
          Trouver mes premiers chantiers
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
