'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { signOut } from '@/app/(auth)/actions'
import Avatar from '@/components/ui/Avatar'

export type NavItem = {
  href: string
  label: string
  icon: string
  badge?: number
}

type Props = {
  role: 'artisan' | 'particulier'
  nav: NavItem[]
  userName: string
  userSub: string
}

export default function Sidebar({ role, nav, userName, userSub }: Props) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const otherRoleHref = role === 'artisan' ? '/particulier/dashboard' : '/artisan/feed'

  const homeHref = role === 'artisan' ? '/artisan/feed' : '/particulier/dashboard'

  const SidebarBody = (
    <div className="flex h-full flex-col text-ac-nav-text">
      {/* Logo + role toggle */}
      <div className="px-5 pt-6 pb-5 border-b border-ac-nav-border">
        <Link
          href={homeHref}
          className="block text-ac-nav-logo text-lg font-bold tracking-tight"
          onClick={() => setMobileOpen(false)}
        >
          ArtisanConnect
        </Link>
        <div className="mt-3.5 flex gap-0.5 rounded-ac-sm bg-white/5 p-0.5">
          {(['artisan', 'particulier'] as const).map((r) => {
            const active = role === r
            return (
              <Link
                key={r}
                href={r === 'artisan' ? '/artisan/feed' : '/particulier/dashboard'}
                className={`flex-1 rounded-ac-sm py-1.5 text-[11px] font-bold capitalize text-center transition-all ${
                  active
                    ? 'bg-ac-nav-active-text text-ac-nav-bg'
                    : 'bg-transparent text-ac-nav-text hover:text-white'
                }`}
              >
                {r === 'artisan' ? '🔨 Artisan' : '🏠 Particulier'}
              </Link>
            )
          })}
        </div>
        <p className="mt-2 text-[10px] text-ac-nav-text/70 leading-snug">
          Basculer vers{' '}
          <Link href={otherRoleHref} className="underline hover:text-white">
            {role === 'artisan' ? 'particulier' : 'artisan'}
          </Link>
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-0.5">
        {nav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 rounded-ac-sm px-3 py-2.25 text-sm transition-all ${
                active
                  ? 'bg-ac-nav-active text-ac-nav-active-text font-bold'
                  : 'text-ac-nav-text font-medium hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="rounded-full bg-ac-primary px-1.75 py-0.25 text-[11px] font-bold text-white">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-ac-nav-border">
        <div className="flex items-center gap-2.5">
          <Avatar name={userName} size={34} />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-white truncate">{userName}</div>
            <div className="text-[11px] text-ac-nav-text truncate">{userSub}</div>
          </div>
          <button
            onClick={() => signOut()}
            title="Déconnexion"
            aria-label="Déconnexion"
            className="rounded p-1 text-ac-nav-text hover:text-white hover:bg-white/5 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col bg-ac-nav-bg border-r border-ac-nav-border overflow-hidden">
        {SidebarBody}
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center gap-3 bg-ac-nav-bg border-b border-ac-nav-border px-4 py-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-ac-nav-text hover:text-white"
          aria-label="Ouvrir le menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link href={homeHref} className="text-ac-nav-logo text-base font-bold tracking-tight">
          ArtisanConnect
        </Link>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-ac-nav-bg h-full overflow-y-auto">{SidebarBody}</div>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex-1 bg-black/40"
            aria-label="Fermer le menu"
          />
        </div>
      )}
    </>
  )
}
