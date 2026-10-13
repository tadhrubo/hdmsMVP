import { Skeleton } from '@/components/ui/skeleton'

export default function BookingsLoading() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton className="h-8 w-48 rounded-md" />
            <Skeleton className="h-4 w-60 rounded-sm" />
          </div>
          <Skeleton className="h-9 w-48 rounded-md" />
        </div>
      </div>

      <div className="page-body">
        <div className="data-table-wrapper w-full overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Property / Unit</th>
                <th style={{ textAlign: 'right' }}>Total Price</th>
                <th>Agreement Date</th>
                <th style={{ textAlign: 'center' }}>Agreement</th>
                <th style={{ textAlign: 'right' }}>Recorded</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <Skeleton className="h-4 w-32 rounded-sm" />
                      <Skeleton className="h-3 w-24 rounded-sm" />
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <Skeleton className="h-4 w-28 rounded-sm" />
                      <Skeleton className="h-3 w-36 rounded-sm" />
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Skeleton className="h-4 w-28 rounded-sm" />
                    </div>
                  </td>
                  <td>
                    <Skeleton className="h-4 w-24 rounded-sm" />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Skeleton className="h-7 w-20 rounded" />
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Skeleton className="h-4 w-20 rounded-sm" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
