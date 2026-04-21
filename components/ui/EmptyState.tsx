import type { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  title: string
  desc?: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, desc, action }: Props) {
  return (
    <div className="text-center px-6 py-16">
      <div className="mx-auto mb-4 h-16 w-16 rounded-ac bg-ac-primary-light text-ac-primary inline-flex items-center justify-center text-[28px]">
        {icon}
      </div>
      <div className="font-bold text-lg text-ac-text mb-2">{title}</div>
      {desc && (
        <div className="text-sm text-ac-text-sub max-w-sm mx-auto mb-6">{desc}</div>
      )}
      {action}
    </div>
  )
}
