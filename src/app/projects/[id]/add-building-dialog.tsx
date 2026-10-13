'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/toast-provider'

type Props = { projectId: string }

export function AddBuildingDialog({ projectId }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const [form, setForm] = useState({ name: '', total_floors: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const res = await fetch('/api/buildings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, ...form }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast(data.error || 'Failed to add building', 'error')
        return
      }
      toast('Building added', 'success')
      setOpen(false)
      setForm({ name: '', total_floors: '' })
      router.refresh()
    })
  }

  return (
    <>
      <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)} id="add-building-btn">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Add Building
      </button>

      {open && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="add-building-title">
            <div className="modal-header">
              <div>
                <div className="modal-title" id="add-building-title">Add Building</div>
                <div className="modal-subtitle">Add a building to this project</div>
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
                  <label htmlFor="bld-name">Building Name *</label>
                  <input
                    id="bld-name"
                    name="name"
                    required
                    placeholder="e.g. Block A / Tower 1"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bld-floors">Total Floors *</label>
                  <input
                    id="bld-floors"
                    name="total_floors"
                    type="number"
                    required
                    min="1"
                    max="200"
                    placeholder="e.g. 12"
                    value={form.total_floors}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isPending} id="add-building-submit">
                  {isPending ? <span className="spinner" /> : null}
                  {isPending ? 'Adding…' : 'Add Building'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
