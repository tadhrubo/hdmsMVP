import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <>
      {/* ── Header Skeleton ── */}
      <div className="page-header">
        <div className="page-header-row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Skeleton className="h-8 w-56 rounded-md" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <Skeleton className="h-4 w-80 rounded-sm" />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
      </div>

      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* ── Section 1: Financial Performance Skeleton ── */}
        <div>
          <Skeleton className="h-3.5 w-48 mb-3.5 rounded-sm" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-border bg-card"
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                <Skeleton className="h-3 w-28 rounded-sm" />
                <Skeleton className="h-8 w-44 rounded-md" />
                <Skeleton className="h-3 w-32 rounded-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 2: Physical Asset Inventory Skeleton ── */}
        <div>
          <Skeleton className="h-3.5 w-40 mb-3.5 rounded-sm" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-border bg-card"
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
              >
                <Skeleton className="h-3 w-24 rounded-sm" />
                <Skeleton className="h-7 w-16 rounded-md" />
                <Skeleton className="h-3 w-20 rounded-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 3: Cost Outlay Skeleton ── */}
        <div>
          <Skeleton className="h-3.5 w-56 mb-3.5 rounded-sm" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-border bg-card"
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                <Skeleton className="h-3 w-36 rounded-sm" />
                <Skeleton className="h-7 w-40 rounded-md" />
                <Skeleton className="h-3 w-48 rounded-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 4: Operational Panels Skeleton ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-xl border border-border bg-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Skeleton className="h-4 w-40 rounded-sm" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Skeleton className="h-4 w-48 rounded-sm" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Skeleton className="h-5 w-full rounded-sm" />
              <Skeleton className="h-5 w-full rounded-sm" />
              <Skeleton className="h-5 w-full rounded-sm" />
              <Skeleton className="h-5 w-full rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
