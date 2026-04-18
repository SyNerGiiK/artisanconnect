import { ListSkeleton, PageHeaderSkeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <PageHeaderSkeleton />
      <ListSkeleton count={3} />
    </div>
  )
}
