type Props = {
  name?: string | null
  size?: number
  variant?: 'light' | 'solid'
  className?: string
}

export default function Avatar({ name, size = 40, variant = 'solid', className = '' }: Props) {
  const initials = name
    ? name
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?'

  const isSolid = variant === 'solid'

  return (
    <div
      className={`shrink-0 inline-flex items-center justify-center rounded-full font-bold ${
        isSolid
          ? 'bg-ac-primary text-white'
          : 'bg-ac-primary-light text-ac-primary-text'
      } ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(11, Math.round(size * 0.35)),
      }}
    >
      {initials}
    </div>
  )
}
