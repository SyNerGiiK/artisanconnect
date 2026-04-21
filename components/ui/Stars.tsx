export default function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const empty = 5 - full
  return (
    <span className="text-amber-400 text-[13px] tracking-[1px]" aria-label={`${rating} sur 5`}>
      {'★'.repeat(full)}
      {'☆'.repeat(empty)}
    </span>
  )
}
