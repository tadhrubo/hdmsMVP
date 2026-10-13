import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { BookingWithDetails } from '@/lib/types/database'

export const instant = false
export const metadata: Metadata = { title: 'Bookings' }

function formatBDT(amount: number) {
  return <span className="mono">৳{amount.toLocaleString('en-BD', { maximumFractionDigits: 0 })}</span>
}

export default async function BookingsPage() {
  const supabase = await createClient()

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      id,
      agreement_date,
      total_price,
      pdf_url,
      created_at,
      clients (
        id,
        full_name,
        phone,
        email
      ),
      flats (
        id,
        flat_number,
        buildings (
          id,
          name,
          projects (
            id,
            name,
            code
          )
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="page-body">
        <div className="panel">
          <div className="panel-body">
            <p className="text-muted">Failed to load bookings: {error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  // Cast type
  const rows = (bookings as unknown as BookingWithDetails[]) ?? []

  // Summary statistics
  const totalVolume = rows.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0)

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Bookings Ledger</h1>
            <p className="text-muted" style={{ marginTop: 4, fontSize: 13.5 }}>
              {rows.length} {rows.length === 1 ? 'sale completed' : 'sales completed'}
              {rows.length > 0 && (
                <>
                  {' '}• Total Sales Volume:{' '}
                  <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{formatBDT(totalVolume)}</span>
                </>
              )}
            </p>
          </div>
          <div>
            <Link href="/projects" className="btn btn-primary" id="go-to-projects-btn">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              New Booking (via Projects)
            </Link>
          </div>
        </div>
      </div>

      <div className="page-body">
        {rows.length === 0 ? (
          <div className="panel">
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <rect x="6" y="5" width="24" height="26" rx="2"/>
                  <path d="M11 12h14M11 18h14M11 24h8" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={{ fontWeight: 500, marginBottom: 4 }}>No bookings recorded yet</p>
              <p className="text-tiny text-muted" style={{ maxWidth: 360, margin: '0 auto 16px' }}>
                Bookings are generated directly from available flats within your property management projects.
              </p>
              <Link href="/projects" className="btn btn-primary btn-sm">
                Browse Projects &amp; Available Flats
              </Link>
            </div>
          </div>
        ) : (
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
                {rows.map((b) => {
                  const client = b.clients
                  const flat = b.flats
                  const building = flat?.buildings
                  const project = building?.projects

                  return (
                    <tr key={b.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{client?.full_name ?? 'Unknown'}</div>
                        <div className="text-muted mono" style={{ fontSize: 11.5 }}>
                          {client?.phone ?? ''}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>
                          Flat {flat?.flat_number ?? '—'}
                        </div>
                        <div className="text-muted" style={{ fontSize: 12 }}>
                          {project?.name ? `${project.name} (${project.code})` : '—'} • {building?.name ?? '—'}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {formatBDT(Number(b.total_price))}
                      </td>
                      <td>
                        <span className="mono" style={{ fontSize: 12.5 }}>
                          {new Date(b.agreement_date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {b.pdf_url ? (
                          <a
                            href={b.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-sm"
                            style={{ display: 'inline-flex', padding: '3px 8px', fontSize: 12 }}
                            title="Open signed agreement in new tab"
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M7 2h3v3M10 2L5 7M9 7.5v2.5a1 1 0 0 1-1 1H2.5a1 1 0 0 1-1-1v-6.5a1 1 0 0 1 1-1H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            View PDF
                          </a>
                        ) : (
                          <span className="text-muted" style={{ fontSize: 12 }}>—</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right', fontSize: 12 }} className="text-muted mono">
                        {new Date(b.created_at).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
