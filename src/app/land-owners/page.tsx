import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AddLandOwnerDialog } from '@/app/projects/[id]/add-land-owner-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FileText, ExternalLink, Building2, UserCheck } from 'lucide-react'
import type { LandOwnerWithProject, Project } from '@/lib/types/database'

export const instant = false
export const metadata: Metadata = { title: 'Land Owners' }

export default async function LandOwnersPage() {
  const supabase = await createClient()

  const [{ data: landOwners, error }, { data: projectsData }] = await Promise.all([
    supabase
      .from('land_owners')
      .select('*, projects(*)')
      .order('created_at', { ascending: false }),
    supabase
      .from('projects')
      .select('id, name')
      .order('name', { ascending: true }),
  ])

  if (error) {
    return (
      <div className="page-body">
        <div className="panel">
          <div className="panel-body">
            <p className="text-muted">Failed to load land owners: {error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  const rows = (landOwners as LandOwnerWithProject[]) ?? []
  const projects = (projectsData as Project[]) ?? []

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1>Land Owners</h1>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 12,
                  background: 'var(--color-border-subtle)',
                  color: 'var(--color-ink-secondary)',
                }}
              >
                Deed Registry
              </span>
            </div>
            <p className="text-muted" style={{ marginTop: 4, fontSize: 13.5 }}>
              {rows.length} {rows.length === 1 ? 'land owner' : 'land owners'} registered across all portfolio developments
            </p>
          </div>
          <AddLandOwnerDialog projects={projects} />
        </div>
      </div>

      <div className="page-body">
        {rows.length === 0 ? (
          <div className="panel">
            <div className="empty-state">
              <div className="empty-state-icon">
                <UserCheck className="size-8 text-muted-foreground" />
              </div>
              <p style={{ fontWeight: 500, marginBottom: 4 }}>No land owners recorded</p>
              <p className="text-tiny text-muted">
                Click &quot;Add Land Owner&quot; to attach land deeds, share agreements, and owner contact details.
              </p>
            </div>
          </div>
        ) : (
          <div className="panel">
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Land Owner</TableHead>
                    <TableHead>Associated Project</TableHead>
                    <TableHead>Phone &amp; NID</TableHead>
                    <TableHead>Address / Share Details</TableHead>
                    <TableHead>Agreement / Deed</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Date Recorded</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((owner) => (
                    <TableRow key={owner.id}>
                      <TableCell>
                        <div style={{ fontWeight: 600 }}>{owner.full_name}</div>
                        {owner.email && (
                          <div className="text-tiny text-muted">{owner.email}</div>
                        )}
                      </TableCell>

                      <TableCell>
                        {owner.projects ? (
                          <Link
                            href={`/projects/${owner.project_id}`}
                            className="inline-flex items-center gap-1.5 font-medium text-xs text-foreground hover:underline"
                          >
                            <Building2 className="size-3.5 text-muted-foreground" />
                            {owner.projects.name}
                          </Link>
                        ) : (
                          <span className="text-muted text-tiny">Unknown Project</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="mono font-medium">{owner.phone}</div>
                        {owner.nid && (
                          <div className="text-tiny text-muted mono">NID: {owner.nid}</div>
                        )}
                      </TableCell>

                      <TableCell style={{ maxWidth: 260 }}>
                        <div
                          className="text-tiny"
                          style={{ color: owner.address ? 'inherit' : 'var(--color-ink-tertiary)' }}
                        >
                          {owner.address || '—'}
                        </div>
                      </TableCell>

                      <TableCell>
                        {owner.agreement_file_url ? (
                          <a
                            href={owner.agreement_file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:underline"
                            id={`lo-agreement-${owner.id}`}
                          >
                            <FileText className="size-3.5 text-muted-foreground" />
                            View Agreement
                            <ExternalLink className="size-3 text-muted-foreground" />
                          </a>
                        ) : (
                          <span className="text-muted text-tiny">—</span>
                        )}
                      </TableCell>

                      <TableCell style={{ textAlign: 'right' }} className="mono text-tiny text-muted">
                        {new Date(owner.created_at).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
