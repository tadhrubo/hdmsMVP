import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AddBuildingDialog } from './add-building-dialog'
import { AddFlatDialog } from './add-flat-dialog'
import { BookFlatDialog } from './book-flat-dialog'
import type { Building, Client, Flat, FlatStatus, Project, ProjectStatus } from '@/lib/types/database'

export const instant = false

type BuildingWithFlats = Building & { flats: Flat[] }

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('projects').select('name').eq('id', id).single()
  return { title: data?.name ?? 'Project' }
}

function statusBadge(status: ProjectStatus) {
  const map: Record<ProjectStatus, string> = {
    Planning: 'badge-planning',
    'Under Construction': 'badge-underconstruction',
    Completed: 'badge-completed',
    'On Hold': 'badge-onhold',
  }
  return <span className={`badge ${map[status]}`}>{status}</span>
}

function flatStatusBadge(status: FlatStatus) {
  const map: Record<FlatStatus, string> = {
    Available: 'badge-available',
    Reserved: 'badge-reserved',
    Sold: 'badge-sold',
    'Handed Over': 'badge-handedover',
  }
  return <span className={`badge ${map[status]}`}>{status}</span>
}

function formatBDT(amount: number) {
  return <span className="mono">৳{amount.toLocaleString('en-BD', { maximumFractionDigits: 0 })}</span>
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: project, error: projError }, { data: buildings }, { data: clientsData }] = await Promise.all([
    supabase.from('projects').select('*').eq('id', id).single(),
    supabase
      .from('buildings')
      .select('*, flats(*)')
      .eq('project_id', id)
      .order('name', { ascending: true }),
    supabase
      .from('clients')
      .select('*')
      .order('full_name', { ascending: true }),
  ])

  if (projError || !project) notFound()

  const proj = project as Project
  const bldgs = (buildings as BuildingWithFlats[]) ?? []
  const clients = (clientsData as Client[]) ?? []

  // Compute summary stats
  const totalFlats = bldgs.reduce((s, b) => s + b.flats.length, 0)
  const availableFlats = bldgs.reduce((s, b) => s + b.flats.filter((f) => f.status === 'Available').length, 0)
  const soldFlats = bldgs.reduce((s, b) => s + b.flats.filter((f) => f.status === 'Sold').length, 0)

  return (
    <>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div style={{ marginBottom: 12 }}>
          <Link
            href="/projects"
            style={{
              fontSize: 12.5,
              color: 'var(--color-ink-tertiary)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontWeight: 500,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Projects
          </Link>
        </div>
        <div className="page-header-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1>{proj.name}</h1>
              {statusBadge(proj.status)}
            </div>
            <p className="text-muted" style={{ fontSize: 13.5 }}>
              {proj.location}
              {proj.code && (
                <>
                  {' · '}
                  <span
                    className="mono"
                    style={{
                      fontSize: 12,
                      background: 'var(--color-border-subtle)',
                      padding: '1px 5px',
                      borderRadius: 3,
                    }}
                  >
                    {proj.code}
                  </span>
                </>
              )}
            </p>
          </div>
          <AddBuildingDialog projectId={proj.id} />
        </div>
      </div>

      <div className="page-body">
        {/* ── Stats Strip ── */}
        <div className="stat-grid" style={{ marginBottom: 32 }}>
          <div className="stat-cell">
            <div className="stat-label">Budget</div>
            <div className="stat-value">
              {proj.budget != null ? (
                <span className="mono">৳{(proj.budget / 1_000_000).toFixed(1)}M</span>
              ) : (
                <span className="text-muted" style={{ fontSize: '1rem' }}>—</span>
              )}
            </div>
          </div>
          <div className="stat-cell">
            <div className="stat-label">Buildings</div>
            <div className="stat-value mono">{bldgs.length}</div>
          </div>
          <div className="stat-cell">
            <div className="stat-label">Total Flats</div>
            <div className="stat-value mono">{totalFlats}</div>
          </div>
          <div className="stat-cell">
            <div className="stat-label">Available</div>
            <div className="stat-value mono" style={{ color: 'var(--color-success)' }}>{availableFlats}</div>
          </div>
          <div className="stat-cell">
            <div className="stat-label">Sold</div>
            <div className="stat-value mono" style={{ color: 'var(--color-danger)' }}>{soldFlats}</div>
          </div>
        </div>

        {/* ── Buildings ── */}
        {bldgs.length === 0 ? (
          <div className="panel">
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <rect x="6" y="4" width="24" height="28" rx="1.5"/>
                  <rect x="10" y="8" width="4" height="4" rx="0.5"/>
                  <rect x="18" y="8" width="4" height="4" rx="0.5"/>
                  <rect x="10" y="16" width="4" height="4" rx="0.5"/>
                  <rect x="18" y="16" width="4" height="4" rx="0.5"/>
                  <rect x="13" y="24" width="10" height="8"/>
                </svg>
              </div>
              <p style={{ fontWeight: 500, marginBottom: 4 }}>No buildings yet</p>
              <p className="text-tiny text-muted">Click "Add Building" to add the first building to this project.</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {bldgs.map((building) => (
              <div key={building.id} className="panel">
                {/* Building header */}
                <div className="panel-header">
                  <div>
                    <h3 style={{ marginBottom: 1 }}>{building.name}</h3>
                    <span className="text-muted text-tiny">
                      {building.total_floors} {building.total_floors === 1 ? 'floor' : 'floors'} ·{' '}
                      {building.flats.length} {building.flats.length === 1 ? 'flat' : 'flats'}
                    </span>
                  </div>
                  <AddFlatDialog buildingId={building.id} buildingName={building.name} />
                </div>

                {/* Flats table */}
                {building.flats.length === 0 ? (
                  <div className="panel-body">
                    <p className="text-muted text-tiny" style={{ textAlign: 'center', padding: '16px 0' }}>
                      No flats in this building yet — click "Add Flat" to get started.
                    </p>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <table>
                      <thead>
                        <tr>
                          <th>Flat No.</th>
                          <th style={{ textAlign: 'right' }}>Size (SqFt)</th>
                          <th style={{ textAlign: 'right' }}>Price (৳ BDT)</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {building.flats
                          .sort((a, b) => a.flat_number.localeCompare(b.flat_number, undefined, { numeric: true }))
                          .map((flat) => (
                            <tr key={flat.id}>
                              <td>
                                <span style={{ fontWeight: 500 }}>{flat.flat_number}</span>
                              </td>
                              <td style={{ textAlign: 'right' }} className="mono">
                                {flat.size_sqft.toLocaleString()}
                              </td>
                              <td style={{ textAlign: 'right' }}>{formatBDT(flat.price)}</td>
                              <td>{flatStatusBadge(flat.status)}</td>
                              <td style={{ textAlign: 'right' }}>
                                {flat.status === 'Available' ? (
                                  <BookFlatDialog
                                    flat={flat}
                                    buildingName={building.name}
                                    projectName={proj.name}
                                    initialClients={clients}
                                  />
                                ) : (
                                  <span className="text-muted" style={{ fontSize: 12 }}>—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
