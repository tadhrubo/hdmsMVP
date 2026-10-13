'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/toast-provider'
import type { Client, Flat, PaymentMethod } from '@/lib/types/database'

type Props = {
  flat: Flat
  buildingName: string
  projectName: string
  initialClients?: Client[]
}

export function BookFlatDialog({ flat, buildingName, projectName, initialClients = [] }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const [clientList, setClientList] = useState<Client[]>(initialClients)
  const [clientId, setClientId] = useState('')
  const [agreementDate, setAgreementDate] = useState(() => new Date().toISOString().split('T')[0])
  const [totalPrice, setTotalPrice] = useState(String(flat.price))
  const [downPayment, setDownPayment] = useState('0')
  const [method, setMethod] = useState<PaymentMethod>('Cash')
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  // Fetch / refresh clients when dialog opens
  useEffect(() => {
    if (open) {
      fetch('/api/clients')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setClientList(data)
            if (data.length > 0 && !clientId) {
              setClientId(data[0].id)
            }
          }
        })
        .catch(() => {})
    }
  }, [open])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        toast('Only PDF files are supported', 'error')
        e.target.value = ''
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        toast('PDF file size must be under 10MB', 'error')
        e.target.value = ''
        return
      }
      setPdfFile(file)
    } else {
      setPdfFile(null)
    }
  }

  function handleClose() {
    setOpen(false)
    setPdfFile(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!clientId) {
      toast('Please select a client', 'error')
      return
    }

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('client_id', clientId)
        formData.append('flat_id', flat.id)
        formData.append('agreement_date', agreementDate)
        formData.append('total_price', totalPrice)
        formData.append('down_payment', downPayment || '0')
        formData.append('method', method)
        if (pdfFile) {
          formData.append('pdf', pdfFile)
        }

        const res = await fetch('/api/bookings', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()

        if (!res.ok) {
          toast(data.error || 'Failed to complete booking', 'error')
          return
        }

        toast(`Flat ${flat.flat_number} successfully booked!`, 'success')
        handleClose()
        router.refresh()
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Network error occurred'
        toast(message, 'error')
      }
    })
  }

  return (
    <>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => setOpen(true)}
        id={`book-flat-${flat.id}`}
        title={`Book flat ${flat.flat_number}`}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6.5l2.5 2.5 4.5-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Book Flat
      </button>

      {open && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && handleClose()}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="book-flat-title" style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <div>
                <div className="modal-title" id="book-flat-title">Book Flat {flat.flat_number}</div>
                <div className="modal-subtitle">
                  {projectName} • {buildingName}
                </div>
              </div>
              <button className="modal-close" onClick={handleClose} aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                {/* Client selector */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label htmlFor="booking-client">Select Client *</label>
                    <a
                      href="/clients"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 11.5, color: 'var(--color-ink-secondary)', textDecoration: 'underline' }}
                    >
                      + New Client ↗
                    </a>
                  </div>
                  {clientList.length === 0 ? (
                    <div style={{ padding: '8px 10px', background: 'var(--color-canvas)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: 13 }}>
                      No clients found. Please{' '}
                      <a href="/clients" target="_blank" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                        add a client
                      </a>{' '}
                      first, then reopen this dialog.
                    </div>
                  ) : (
                    <select
                      id="booking-client"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      required
                    >
                      <option value="">Choose client…</option>
                      {clientList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.full_name} ({c.phone}){c.nid ? ` • NID: ${c.nid}` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Agreement Date & Total Price */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label htmlFor="booking-date">Agreement Date *</label>
                    <input
                      id="booking-date"
                      type="date"
                      required
                      value={agreementDate}
                      onChange={(e) => setAgreementDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="booking-price">Total Price (৳ BDT) *</label>
                    <input
                      id="booking-price"
                      type="number"
                      required
                      min="0"
                      step="any"
                      value={totalPrice}
                      onChange={(e) => setTotalPrice(e.target.value)}
                    />
                  </div>
                </div>

                {/* Down payment & Method */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label htmlFor="booking-downpayment">Down Payment (৳ BDT) *</label>
                    <input
                      id="booking-downpayment"
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0"
                      value={downPayment}
                      onChange={(e) => setDownPayment(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="booking-method">Payment Method *</label>
                    <select
                      id="booking-method"
                      value={method}
                      onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                      required
                    >
                      <option value="Cash">Cash</option>
                      <option value="Bank">Bank</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>
                </div>

                {/* Agreement PDF Upload */}
                <div className="form-group">
                  <label htmlFor="booking-pdf">Signed Agreement (PDF)</label>
                  <input
                    id="booking-pdf"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    style={{ padding: '6px 8px', fontSize: 12.5 }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-ink-tertiary)', marginTop: 2 }}>
                    <span>Uploaded to Supabase Agreements bucket</span>
                    {pdfFile && <span className="mono">{Math.round(pdfFile.size / 1024)} KB</span>}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={handleClose} disabled={isPending}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isPending || clientList.length === 0}
                  id="confirm-booking-btn"
                >
                  {isPending && <span className="spinner" />}
                  {isPending ? 'Processing Booking…' : 'Confirm & Book Flat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
