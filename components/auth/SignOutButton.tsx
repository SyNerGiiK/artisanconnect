'use client'

import { signOut } from '@/app/(auth)/actions'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
    >
      Se déconnecter
    </button>
  )
}
