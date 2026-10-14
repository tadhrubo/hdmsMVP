'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/toast-provider'
import { Upload, FileText, ImageIcon, X, Plus } from 'lucide-react'

type Props = {
  projectId?: string
  projectName?: string
  projects?: { id: string; name: string }[]
  triggerButtonText?: string
}

export function AddLandOwnerDialog({
  projectId,
  projectName,
  projects = [],
  triggerButtonText,
}: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedProjectId, setSelectedProjectId] = useState(projectId || (projects[0]?.id ?? ''))
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [nid, setNid] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  function resetForm() {
    if (!projectId && projects.length > 0) {
      setSelectedProjectId(projects[0].id)
    }
    setFullName('')
    setPhone('')
    setNid('')
    setEmail('')
    setAddress('')
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
      if (!allowed.includes(file.type)) {
        toast('Please upload a PDF document or a JPEG/PNG/WebP image.', 'error')
        e.target.value = ''
        return
      }
      setSelectedFile(file)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const targetProjId = projectId || selectedProjectId
    if (!targetProjId) {
      toast('Please select a project for this land owner.', 'error')
      return
    }
    if (!fullName.trim() || !phone.trim()) {
      toast('Please provide land owner full name and phone number.', 'error')
      return
    }

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('project_id', targetProjId)
        formData.append('full_name', fullName.trim())
        formData.append('phone', phone.trim())
        if (nid.trim()) formData.append('nid', nid.trim())
        if (email.trim()) formData.append('email', email.trim())
        if (address.trim()) formData.append('address', address.trim())
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
        onClick={() => {
          if (!projectId && projects.length > 0 && !selectedProjectId) {
            setSelectedProjectId(projects[0].id)
          }
          setOpen(true)
        }}
        id="add-land-owner-btn"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
        <Plus className="size-3.5" />
        {triggerButtonText || 'Add Land Owner'}
      </button>

      {open && (
        <div
          className="modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            className="modal w-[95vw] sm:max-w-[520px]"
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
                  {projectName
                    ? `Record deed holder for ${projectName}`
                    : 'Record deed & land share ownership details'}
                </div>
              </div>
              <button
                className="modal-close"
                onClick={() => setOpen(false)}
                aria-label="Close dialog"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div
                className="modal-body max-h-[75vh] overflow-y-auto"
                style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
              >
                {/* Project Selection (if not locked to a specific project) */}
                {!projectId && (
                  <div className="form-group">
                    <label htmlFor="lo-project" style={{ fontSize: 12.5, fontWeight: 600 }}>
                      Associated Project *
                    </label>
                    <select
                      id="lo-project"
                      required
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-canvas)',
                        fontSize: 13,
                        color: 'inherit',
                      }}
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    >
                    </input>
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="form-group">
                    <label htmlFor="lo-nid" style={{ fontSize: 12.5, fontWeight: 600 }}>
                      National ID (NID)
                    </label>
                    <input
                      id="lo-nid"
                      type="text"
                      placeholder="e.g. 1984269251000001"
                      value={nid}
                      onChange={(e) => setNid(e.target.value)}
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
                    <label htmlFor="lo-email" style={{ fontSize: 12.5, fontWeight: 600 }}>
                      Email Address
                    </label>
                    <input
                      id="lo-email"
                      type="email"
                      placeholder="e.g. owner@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                </div>

                <div className="form-group">
                  <label htmlFor="lo-address" style={{ fontSize: 12.5, fontWeight: 600 }}>
                    Address / Share Details
                  </label>
                  <textarea
                    id="lo-address"
                    rows={2}
                    placeholder="e.g. Plot 12, Road 4, Dhanmondi. 40% landowner share agreement."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-canvas)',
                      fontSize: 13,
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div className="form-group">
                  <label
                    htmlFor="lo-file"
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Upload Agreement (PDF, JPG, or PNG Photo)</span>
                    <span className="text-tiny text-muted">Deed / MOU Scans</span>
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
                      accept="application/pdf,image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />

                    {selectedFile ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            textAlign: 'left',
                          }}
                        >
                          {selectedFile.type.includes('pdf') ? (
                            <FileText className="size-5 text-red-500 shrink-0" />
                          ) : (
                            <ImageIcon className="size-5 text-blue-500 shrink-0" />
                          )}
                          <div style={{ overflow: 'hidden' }}>
                            <div
                              style={{
                                fontSize: 12.5,
                                fontWeight: 500,
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                maxWidth: 280,
                              }}
                            >
                              {selectedFile.name}
                            </div>
                            <div className="text-tiny text-muted mono">
                              {(selectedFile.size / 1024).toFixed(0)} KB ·{' '}
                              {selectedFile.type || 'file'}
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
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <Upload className="size-5 text-muted-foreground" />
                        <span style={{ fontSize: 12.5, fontWeight: 500 }}>
                          Upload Agreement (PDF, JPG, or PNG Photo)
                        </span>
                        <span className="text-tiny text-muted">
                          Supports PDF, JPG, PNG &amp; WebP deeds, power of attorney, and MOU scans
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="modal-footer"
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 8,
                  padding: '14px 20px',
                  borderTop: '1px solid var(--color-border)',
                }}
              >
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
