import { Skeleton, ListSkeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>
      <Skeleton className="h-6 w-40 mb-4" />
      <ListSkeleton count={2} />
    </div>
  )
}
