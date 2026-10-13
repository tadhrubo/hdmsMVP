'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/toast-provider'
import type { ProjectStatus } from '@/lib/types/database'

const STATUSES: ProjectStatus[] = ['Planning', 'Under Construction', 'Completed', 'On Hold']

export function NewProjectDialog() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const [form, setForm] = useState({
    name: '',
    location: '',
    code: '',
    status: 'Planning' as ProjectStatus,
    budget: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          location: form.location,
          code: form.code.toUpperCase(),
          status: form.status,
          budget: form.budget ? parseFloat(form.budget) : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast(data.error || 'Failed to create project', 'error')
        return
      }
      toast('Project created successfully', 'success')
      setOpen(false)
      setForm({ name: '', location: '', code: '', status: 'Planning', budget: '' })
      router.refresh()
    })
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)} id="new-project-btn">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        New Project
      </button>

      {open && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="new-project-title">
            <div className="modal-header">
              <div>
                <div className="modal-title" id="new-project-title">New Project</div>
                <div className="modal-subtitle">Add a new real estate development project</div>
              </div>
              <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="proj-name">Project Name *</label>
                  <input
                    id="proj-name"
                    name="name"
                    required
                    placeholder="e.g. Bashundhara Heights"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label htmlFor="proj-code">Project Code *</label>
                    <input
                      id="proj-code"
                      name="code"
                      required
                      placeholder="e.g. BH-2024"
                      value={form.code}
                      onChange={handleChange}
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="proj-status">Status</label>
                    <select id="proj-status" name="status" value={form.status} onChange={handleChange}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="proj-location">Location *</label>
                  <input
                    id="proj-location"
                    name="location"
                    required
                    placeholder="e.g. Bashundhara, Dhaka"
                    value={form.location}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="proj-budget">Budget (BDT ৳)</label>
                  <input
                    id="proj-budget"
                    name="budget"
                    type="number"
                    min="0"
                    step="any"
                    placeholder="e.g. 50000000"
                    value={form.budget}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isPending} id="create-project-submit">
                  {isPending ? <span className="spinner" /> : null}
                  {isPending ? 'Creating…' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
