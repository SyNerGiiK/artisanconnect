export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200/80 ${className}`}
      aria-hidden
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="flex items-center gap-3 mb-5">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-9 w-40 rounded-xl" />
    </div>
  )
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function PageHeaderSkeleton() {
  return (
    <div className="mb-10">
      <Skeleton className="h-9 w-72 mb-3" />
      <Skeleton className="h-5 w-96" />
    </div>
  )
}
