'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/toast-provider'

export function NewClientDialog() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const [form, setForm] = useState({ full_name: '', phone: '', nid: '', email: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleClose() {
    setOpen(false)
    setForm({ full_name: '', phone: '', nid: '', email: '' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        toast(data.error || 'Failed to add client', 'error')
        return
      }
      toast(`${form.full_name} added as a client`, 'success')
      handleClose()
      router.refresh()
    })
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)} id="new-client-btn">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        New Client
      </button>

      {open && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && handleClose()}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="new-client-title">
            <div className="modal-header">
              <div>
                <div className="modal-title" id="new-client-title">New Client</div>
                <div className="modal-subtitle">Register a new buyer or prospective client</div>
              </div>
              <button className="modal-close" onClick={handleClose} aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="cl-name">Full Name *</label>
                  <input
                    id="cl-name" name="full_name" required
                    placeholder="e.g. Rahim Uddin"
                    value={form.full_name} onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cl-phone">Phone *</label>
                  <input
                    id="cl-phone" name="phone" required
                    placeholder="e.g. 01711-000000"
                    value={form.phone} onChange={handleChange}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label htmlFor="cl-nid">NID</label>
                    <input
                      id="cl-nid" name="nid"
                      placeholder="National ID No."
                      value={form.nid} onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cl-email">Email</label>
                    <input
                      id="cl-email" name="email" type="email"
                      placeholder="email@example.com"
                      value={form.email} onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={handleClose}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isPending} id="create-client-submit">
                  {isPending ? <span className="spinner" /> : null}
                  {isPending ? 'Saving…' : 'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
