import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NewProjectDialog } from './new-project-dialog'
import type { Project, ProjectStatus } from '@/lib/types/database'

export const instant = false

export const metadata: Metadata = { title: 'Projects' }

function statusBadge(status: ProjectStatus) {
  const map: Record<ProjectStatus, string> = {
    Planning: 'badge-planning',
    'Under Construction': 'badge-underconstruction',
    Completed: 'badge-completed',
    'On Hold': 'badge-onhold',
  }
  return <span className={`badge ${map[status]}`}>{status}</span>
}

function formatBDT(amount: number | null) {
  if (amount == null) return <span className="text-muted">—</span>
  return (
    <span className="mono">
      ৳{amount.toLocaleString('en-BD', { maximumFractionDigits: 0 })}
    </span>
  )
}

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="page-body">
        <div className="panel">
          <div className="panel-body">
            <p className="text-muted">Failed to load projects: {error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  const rows = (projects as Project[]) ?? []

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Projects</h1>
            <p className="text-muted" style={{ marginTop: 4, fontSize: 13.5 }}>
              {rows.length} {rows.length === 1 ? 'project' : 'projects'} in your portfolio
            </p>
          </div>
          <NewProjectDialog />
        </div>
      </div>

      <div className="page-body">
        {rows.length === 0 ? (
          <div className="panel">
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <rect x="4" y="6" width="28" height="24" rx="2"/>
                  <path d="M12 14h12M12 19h8" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={{ fontWeight: 500, marginBottom: 4 }}>No projects yet</p>
              <p className="text-tiny text-muted">Click "New Project" to add your first development project.</p>
            </div>
          </div>
        ) : (
          <div className="data-table-wrapper">
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
                {rows.map((project) => (
                  <tr key={project.id} className="clickable">
                    <td>
                      <Link
                        href={`/projects/${project.id}`}
                        style={{
                          fontWeight: 500,
                          color: 'var(--color-ink)',
                          textDecoration: 'none',
                          display: 'block',
                        }}
                      >
                        {project.name}
                      </Link>
                    </td>
                    <td>
                      <span
                        className="mono"
                        style={{
                          fontSize: 12,
                          background: 'var(--color-border-subtle)',
                          padding: '2px 6px',
                          borderRadius: 3,
                          letterSpacing: '0.03em',
                        }}
                      >
                        {project.code}
                      </span>
                    </td>
                    <td className="text-muted">{project.location}</td>
                    <td>{statusBadge(project.status)}</td>
                    <td style={{ textAlign: 'right' }}>{formatBDT(project.budget)}</td>
                    <td style={{ width: 40 }}>
                      <Link
                        href={`/projects/${project.id}`}
                        style={{ color: 'var(--color-ink-tertiary)', textDecoration: 'none', fontSize: 18, display: 'block', textAlign: 'center' }}
                        aria-label={`View ${project.name}`}
                      >
                        →
                      </Link>
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
