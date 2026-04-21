import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type Props = ComponentPropsWithoutRef<'input'> & {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  required?: boolean
}

const inputCls =
  'w-full px-3.5 py-2.5 rounded-ac-sm border-[1.5px] border-ac-border bg-ac-surface text-ac-text text-sm ' +
  'outline-none transition-colors placeholder:text-ac-text-muted ' +
  'focus:border-ac-primary focus:shadow-[0_0_0_3px_var(--ac-primary-light)]'

export default function Input({
  label,
  hint,
  error,
  required,
  className = '',
  ...rest
}: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[13px] font-semibold text-ac-text">
          {label}
          {required && <span className="text-ac-red"> *</span>}
        </label>
      )}
      <input className={`${inputCls} ${className}`} {...rest} />
      {hint && !error && <p className="text-xs text-ac-text-muted">{hint}</p>}
      {error && <p className="text-xs text-ac-red font-medium">{error}</p>}
    </div>
  )
}

export const inputClassName = inputCls
