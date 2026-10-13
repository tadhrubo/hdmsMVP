import { Skeleton } from '@/components/ui/skeleton'

export default function ProjectsLoading() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton className="h-8 w-44 rounded-md" />
            <Skeleton className="h-4 w-36 rounded-sm" />
          </div>
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>

      <div className="page-body">
        <div className="data-table-wrapper w-full overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Code</th>
                <th>Location</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Budget</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td>
                    <Skeleton className="h-4 w-44 rounded-sm" />
                  </td>
                  <td>
                    <Skeleton className="h-5 w-16 rounded" />
                  </td>
                  <td>
                    <Skeleton className="h-4 w-36 rounded-sm" />
                  </td>
                  <td>
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Skeleton className="h-4 w-28 rounded-sm" />
                    </div>
                  </td>
                  <td>
                    <Skeleton className="h-4 w-4 rounded-sm" />
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
