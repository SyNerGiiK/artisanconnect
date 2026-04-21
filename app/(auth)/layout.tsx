import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-ac-bg">
      <nav className="sticky top-0 z-50 border-b border-ac-border-light bg-white/92 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-6">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-ac-primary">
            ArtisanConnect
          </Link>
          <div className="flex items-center gap-2.5">
            <Link
              href="/connexion"
              className="rounded-ac-sm border border-ac-border bg-ac-surface px-4 py-2 text-sm font-semibold text-ac-text transition-colors hover:bg-ac-surface-hover"
            >
              Se connecter
            </Link>
            <Link
              href="/inscription"
              className="rounded-ac-sm bg-ac-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-ac-primary-dark hover:shadow-[0_4px_14px_rgba(59,130,246,0.3)]"
            >
              S&apos;inscrire
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
        {children}
      </div>
    </div>
  )
}
