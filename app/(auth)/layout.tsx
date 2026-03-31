import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-blue-600">
            ArtisanConnect
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/connexion"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              Se connecter
            </Link>
            <Link
              href="/inscription"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              S&apos;inscrire
            </Link>
          </div>
        </div>
      </nav>

      {/* Background with gradient like landing page */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-blue-100/50 blur-3xl" />
        
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
