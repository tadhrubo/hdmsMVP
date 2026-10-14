import { Skeleton } from '@/components/ui/skeleton'

export default function LandOwnersLoading() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton className="h-8 w-44 rounded-md" />
            <Skeleton className="h-4 w-64 rounded-sm" />
          </div>
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>

      <div className="page-body">
        <div className="panel">
          <div className="w-full overflow-x-auto p-4">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Header skeleton */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 12 }}>
                <Skeleton className="h-4 w-28 rounded-sm" />
                <Skeleton className="h-4 w-32 rounded-sm" />
                <Skeleton className="h-4 w-28 rounded-sm" />
                <Skeleton className="h-4 w-40 rounded-sm" />
                <Skeleton className="h-4 w-24 rounded-sm" />
                <Skeleton className="h-4 w-20 rounded-sm" />
              </div>
              {/* Row skeletons */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <Skeleton className="h-4 w-36 rounded-sm" />
                  <Skeleton className="h-4 w-28 rounded-sm" />
                  <Skeleton className="h-4 w-24 rounded-sm" />
                  <Skeleton className="h-4 w-36 rounded-sm" />
                  <Skeleton className="h-4 w-20 rounded-sm" />
                  <Skeleton className="h-4 w-16 rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
