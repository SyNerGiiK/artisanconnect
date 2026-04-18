import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <div className="mb-8">
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-100 mb-8">
        <div className="flex items-start justify-between mb-4">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="flex gap-3">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
      <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100 space-y-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
  )
}
