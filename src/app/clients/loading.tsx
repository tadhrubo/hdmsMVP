import { Skeleton } from '@/components/ui/skeleton'

export default function ClientsLoading() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton className="h-8 w-36 rounded-md" />
            <Skeleton className="h-4 w-44 rounded-sm" />
          </div>
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>

      <div className="page-body">
        <div className="data-table-wrapper w-full overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Phone</th>
                <th>NID</th>
                <th>Email</th>
                <th style={{ textAlign: 'right' }}>Added</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td>
                    <Skeleton className="h-4 w-36 rounded-sm" />
                  </td>
                  <td>
                    <Skeleton className="h-4 w-28 rounded-sm" />
                  </td>
                  <td>
                    <Skeleton className="h-4 w-24 rounded-sm" />
                  </td>
                  <td>
                    <Skeleton className="h-4 w-40 rounded-sm" />
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
