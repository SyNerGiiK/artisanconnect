import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col mx-auto max-w-3xl px-4 py-4">
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-0">
        <Skeleton className="h-4 w-16" />
        <div className="flex-1">
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="flex-1 py-4 space-y-3">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-12 w-1/2 ml-auto" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-12 w-1/3 ml-auto" />
      </div>
    </div>
  )
}
