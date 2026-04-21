import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type Props = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode
  hover?: boolean
  padded?: boolean
}

export default function Card({
  children,
  hover = false,
  padded = false,
  className = '',
  ...rest
}: Props) {
  const cls = [
    'bg-ac-surface border border-ac-border rounded-ac',
    'shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
    hover
      ? 'transition-all hover:border-ac-primary-border hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] hover:-translate-y-0.5'
      : '',
    padded ? 'p-6' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  )
}
