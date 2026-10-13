'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/toast-provider'
import { Upload, FileText, ImageIcon, X } from 'lucide-react'

type Props = {
  projectId: string
  projectName?: string
}

export function AddLandOwnerDialog({ projectId, projectName }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  function resetForm() {
    setFullName('')
    setPhone('')
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
      if (!allowed.includes(file.type)) {
        toast('Please upload a PDF document or a JPEG/PNG image.', 'error')
        e.target.value = ''
        return
      }
      setSelectedFile(file)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!fullName.trim() || !phone.trim()) {
      toast('Please provide land owner full name and phone number.', 'error')
      return
    }

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('project_id', projectId)
        formData.append('full_name', fullName.trim())
        formData.append('phone', phone.trim())
        if (selectedFile) {
          formData.append('file', selectedFile)
        }

        const res = await fetch('/api/land-owners', {
          method: 'POST',
          body: formData,
        })

        const data = await res.json()
        if (!res.ok) {
          toast(data.error || 'Failed to add land owner', 'error')
          return
        }

        toast('Land owner added successfully', 'success')
        setOpen(false)
        resetForm()
        router.refresh()
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Upload failed'
        toast(msg, 'error')
      }
    })
  }

  return (
    <>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => setOpen(true)}
        id="add-land-owner-btn"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Add Land Owner
      </button>

      {open && (
        <div
          className="modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            className="modal w-[95vw] sm:max-w-[480px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-land-owner-title"
          >
            <div className="modal-header">
              <div>
                <div className="modal-title" id="add-land-owner-title">
                  Add Land Owner
                </div>
                <div className="modal-subtitle">
                  {projectName ? `Record deed holder for ${projectName}` : 'Record deed & agreement details'}
                </div>
              </div>
              <button
                className="modal-close"
                onClick={() => setOpen(false)}
                aria-label="Close dialog"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body max-h-[75vh] overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label htmlFor="lo-name" style={{ fontSize: 12.5, fontWeight: 600 }}>
                    Full Name *
                  </label>
                  <input
                    id="lo-name"
                    type="text"
                    required
                    placeholder="e.g. Al-Haj Abdul Karim"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-canvas)',
                      fontSize: 13,
                    }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lo-phone" style={{ fontSize: 12.5, fontWeight: 600 }}>
                    Phone Number *
                  </label>
                  <input
                    id="lo-phone"
                    type="tel"
                    required
                    placeholder="e.g. +880 1711-234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-canvas)',
                      fontSize: 13,
                    }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lo-file" style={{ fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Agreement Deed / Document</span>
                    <span className="text-tiny text-muted">PDF or Image</span>
                  </label>

                  <div
                    style={{
                      border: '1px dashed var(--color-border)',
                      borderRadius: 8,
                      padding: '16px',
                      textAlign: 'center',
                      background: 'var(--color-surface)',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      id="lo-file"
                      type="file"
                      accept="image/jpeg, image/png, application/pdf"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />

                    {selectedFile ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
                          {selectedFile.type.includes('pdf') ? (
                            <FileText className="size-5 text-red-500 shrink-0" />
                          ) : (
                            <ImageIcon className="size-5 text-blue-500 shrink-0" />
                          )}
                          <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: 12.5, fontWeight: 500, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 260 }}>
                              {selectedFile.name}
                            </div>
                            <div className="text-tiny text-muted mono">
                              {(selectedFile.size / 1024).toFixed(0)} KB · {selectedFile.type || 'file'}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedFile(null)
                            if (fileInputRef.current) fileInputRef.current.value = ''
                          }}
                          className="text-muted hover:text-foreground p-1"
                          aria-label="Remove file"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <Upload className="size-5 text-muted-foreground" />
                        <span style={{ fontSize: 12.5, fontWeight: 500 }}>
                          Click to select agreement file
                        </span>
                        <span className="text-tiny text-muted">
                          Supports PDF, JPG, PNG (deed scans, power of attorney, MOU)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 20px', borderTop: '1px solid var(--color-border)' }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={isPending}
                  id="submit-land-owner-btn"
                >
                  {isPending ? 'Saving…' : 'Add Land Owner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
