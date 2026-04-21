import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'green' | 'amber' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-1.5 font-semibold transition-all rounded-ac-sm select-none disabled:opacity-55 disabled:cursor-not-allowed'

const sizes: Record<Size, string> = {
  sm: 'text-[13px] px-3.5 py-1.5',
  md: 'text-sm px-4.5 py-2.25',
  lg: 'text-[15px] px-6 py-3.25',
}

const variants: Record<Variant, string> = {
  primary:
    'bg-ac-primary text-white hover:bg-ac-primary-dark hover:shadow-[0_4px_14px_rgba(59,130,246,0.3)]',
  secondary:
    'bg-ac-surface text-ac-text border border-ac-border hover:bg-ac-surface-hover hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
  ghost:
    'bg-transparent text-ac-primary-text border border-transparent hover:bg-ac-primary-light hover:border-ac-primary-border',
  green:
    'bg-ac-green text-white hover:brightness-110 hover:shadow-[0_4px_14px_rgba(5,150,105,0.27)]',
  amber:
    'bg-ac-amber text-white hover:brightness-110',
  danger:
    'bg-ac-red-light text-ac-red border border-red-300 hover:bg-ac-red hover:text-white hover:border-ac-red',
}

type CommonProps = {
  variant?: Variant
  size?: Size
  full?: boolean
  className?: string
  children: ReactNode
}

type ButtonProps = CommonProps & ComponentPropsWithoutRef<'button'> & { href?: never }
type LinkProps = CommonProps & { href: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href'>

export default function Button(props: ButtonProps | LinkProps) {
  const {
    variant = 'primary',
    size = 'md',
    full = false,
    className = '',
    children,
    ...rest
  } = props

  const cls = [
    base,
    sizes[size],
    variants[variant],
    full ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if ('href' in rest && rest.href) {
    const { href, ...anchorRest } = rest as LinkProps
    return (
      <Link href={href} className={cls} {...anchorRest}>
        {children}
      </Link>
    )
  }

  return (
    <button className={cls} {...(rest as ButtonProps)}>
      {children}
    </button>
  )
}
