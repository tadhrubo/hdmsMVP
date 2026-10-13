'use client'

import { createContext, useCallback, useContext, useState } from 'react'

type Toast = {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

type ToastCtx = {
  toast: (message: string, type?: Toast['type']) => void
}

const ToastContext = createContext<ToastCtx>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast${t.type === 'success' ? ' toast-success' : t.type === 'error' ? ' toast-error' : ''}`}
          >
            {t.type === 'success' && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="7" cy="7" r="6" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2"/>
                <path d="M4.5 7l2 2 3-3.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {t.type === 'error' && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="7" cy="7" r="6" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2"/>
                <path d="M5 5l4 4M9 5l-4 4" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            )}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
