'use client'

import { signOut } from '@/app/(auth)/actions'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-200 transition-all hover:bg-gray-50 hover:ring-gray-300"
    >
      Deconnexion
    </button>
  )
}
