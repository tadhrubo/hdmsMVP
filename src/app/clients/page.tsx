import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { NewClientDialog } from './new-client-dialog'
import type { Client } from '@/lib/types/database'

export const instant = false
export const metadata: Metadata = { title: 'Clients' }

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .order('full_name', { ascending: true })

  if (error) {
    return (
      <div className="page-body">
        <div className="panel">
          <div className="panel-body">
            <p className="text-muted">Failed to load clients: {error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  const rows = (clients as Client[]) ?? []

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Clients</h1>
            <p className="text-muted" style={{ marginTop: 4, fontSize: 13.5 }}>
              {rows.length} {rows.length === 1 ? 'client' : 'clients'} registered
            </p>
          </div>
          <NewClientDialog />
        </div>
      </div>

      <div className="page-body">
        {rows.length === 0 ? (
          <div className="panel">
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <circle cx="18" cy="12" r="6"/>
                  <path d="M6 32c0-6.627 5.373-12 12-12s12 5.373 12 12" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={{ fontWeight: 500, marginBottom: 4 }}>No clients yet</p>
              <p className="text-tiny text-muted">Click &quot;New Client&quot; to register your first buyer.</p>
            </div>
          </div>
        ) : (
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
                {rows.map((client) => (
                  <tr key={client.id}>
                    <td style={{ fontWeight: 500 }}>{client.full_name}</td>
                    <td className="mono" style={{ fontSize: 13 }}>{client.phone}</td>
                    <td className="text-muted mono" style={{ fontSize: 12 }}>
                      {client.nid || <span style={{ color: 'var(--color-ink-disabled)' }}>—</span>}
                    </td>
                    <td className="text-muted" style={{ fontSize: 13 }}>
                      {client.email || <span style={{ color: 'var(--color-ink-disabled)' }}>—</span>}
                    </td>
                    <td style={{ textAlign: 'right', fontSize: 12 }} className="text-muted mono">
                      {new Date(client.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
