'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/toast-provider'

type Props = { buildingId: string; buildingName: string }

export function AddFlatDialog({ buildingId, buildingName }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const [form, setForm] = useState({ flat_number: '', size_sqft: '', price: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const res = await fetch('/api/flats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ building_id: buildingId, ...form }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast(data.error || 'Failed to add flat', 'error')
        return
      }
      toast(`Flat ${form.flat_number} added`, 'success')
      setOpen(false)
      setForm({ flat_number: '', size_sqft: '', price: '' })
      router.refresh()
    })
  }

  return (
    <>
      <button className="btn btn-ghost btn-sm" onClick={() => setOpen(true)} id={`add-flat-${buildingId}`}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Add Flat
      </button>

      {open && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="modal w-[95vw] sm:max-w-[480px]" role="dialog" aria-modal="true" aria-labelledby="add-flat-title">
            <div className="modal-header">
              <div>
                <div className="modal-title" id="add-flat-title">Add Flat</div>
                <div className="modal-subtitle">{buildingName}</div>
              </div>
              <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body max-h-[75vh] overflow-y-auto">
                <div className="form-group">
                  <label htmlFor="flat-number">Flat Number *</label>
                  <input
                    id="flat-number"
                    name="flat_number"
                    required
                    placeholder="e.g. A-101 / 3B"
                    value={form.flat_number}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="form-group">
                    <label htmlFor="flat-size">Size (SqFt) *</label>
                    <input
                      id="flat-size"
                      name="size_sqft"
                      type="number"
                      required
                      min="1"
                      step="any"
                      placeholder="e.g. 1250"
                      value={form.size_sqft}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="flat-price">Price (৳ BDT) *</label>
                    <input
                      id="flat-price"
                      name="price"
                      type="number"
                      required
                      min="0"
                      step="any"
                      placeholder="e.g. 8500000"
                      value={form.price}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div
                  style={{
                    background: 'var(--color-border-subtle)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    fontSize: 12,
                    color: 'var(--color-ink-secondary)',
                  }}
                >
                  Status will default to <strong>Available</strong>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isPending} id="add-flat-submit">
                  {isPending ? <span className="spinner" /> : null}
                  {isPending ? 'Adding…' : 'Add Flat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
