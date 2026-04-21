import type { ReactNode } from 'react'

type Kind = 'warning' | 'info' | 'success' | 'error'

const CFG: Record<Kind, { cls: string; icon: string }> = {
  warning: {
    cls: 'bg-ac-amber-light border-ac-amber-border text-ac-amber',
    icon: '⚠️',
  },
  info: {
    cls: 'bg-ac-primary-light border-ac-primary-border text-ac-primary-text',
    icon: 'ℹ️',
  },
  success: {
    cls: 'bg-ac-green-light border-ac-green-border text-ac-green',
    icon: '✓',
  },
  error: {
    cls: 'bg-ac-red-light border-red-300 text-ac-red',
    icon: '✕',
  },
}

type Props = {
  kind?: Kind
  type?: Kind
  title: ReactNode
  desc?: ReactNode
  action?: ReactNode
  className?: string
}

export default function AlertBanner({
  kind,
  type,
  title,
  desc,
  action,
  className = '',
}: Props) {
  const variant: Kind = kind ?? type ?? 'warning'
  const c = CFG[variant]
  return (
    <div className={`flex items-start gap-3 rounded-ac border px-5 py-4 ${c.cls} ${className}`}>
      <span className="text-base shrink-0 leading-tight">{c.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-ac-text mb-1">{title}</div>
        {desc && <div className="text-[13px] text-ac-text-sub">{desc}</div>}
        {action && <div className="mt-2.5">{action}</div>}
      </div>
    </div>
  )
}
