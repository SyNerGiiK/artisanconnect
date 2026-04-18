import { Skeleton, PageHeaderSkeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <PageHeaderSkeleton />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 flex items-center gap-4"
          >
            <Skeleton className="h-12 w-12 rounded-full shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}
