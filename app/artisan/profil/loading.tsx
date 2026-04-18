import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-10">
        <Skeleton className="h-9 w-64 mb-3" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <Skeleton className="h-11 w-40 rounded-xl" />
      </div>
    </div>
  )
}
