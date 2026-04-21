import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  color?: 'neutral' | 'primary' | 'green' | 'amber' | 'red'
  className?: string
}

const COLORS: Record<NonNullable<Props['color']>, string> = {
  neutral: 'bg-ac-surface-hover text-ac-text-sub border-ac-border',
  primary: 'bg-ac-primary-light text-ac-primary-text border-ac-primary-border',
  green: 'bg-ac-green-light text-ac-green border-ac-green-border',
  amber: 'bg-ac-amber-light text-ac-amber border-ac-amber-border',
  red: 'bg-ac-red-light text-ac-red border-red-300',
}

export default function Tag({ children, color = 'neutral', className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${COLORS[color]} ${className}`}
    >
      {children}
    </span>
  )
}
