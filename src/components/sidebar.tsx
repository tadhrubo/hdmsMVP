'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { useAuth } from './auth-provider'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

const NAV = [
  {
    label: 'Main',
    items: [
      {
        href: '/dashboard',
        label: 'Dashboard',
        icon: (
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <rect x="1" y="1" width="5.5" height="5.5" rx="0.5" stroke="currentColor" strokeWidth="1.3"/>
            <rect x="8.5" y="1" width="5.5" height="5.5" rx="0.5" stroke="currentColor" strokeWidth="1.3"/>
            <rect x="1" y="8.5" width="5.5" height="5.5" rx="0.5" stroke="currentColor" strokeWidth="1.3"/>
            <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="0.5" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Properties',
    items: [
      {
        href: '/projects',
        label: 'Projects',
        icon: (
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M2 3.5C2 2.67 2.67 2 3.5 2h8C12.33 2 13 2.67 13 3.5v9c0 .83-.67 1.5-1.5 1.5h-8A1.5 1.5 0 0 1 2 12.5v-9Z" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M5 5.5h5M5 8h5M5 10.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        href: '/land-owners',
        label: 'Land Owners',
        icon: (
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 1.5L2 6v7.5h11V6L7.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 13.5V8.5h3v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: 'CRM',
    items: [
      {
        href: '/clients',
        label: 'Clients',
        icon: (
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="7.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M2 13c0-2.76 2.46-5 5.5-5s5.5 2.24 5.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        href: '/bookings',
        label: 'Bookings',
        icon: (
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <rect x="2" y="2" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M5 5.5h5M5 8h5M5 10.5h2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M2 4.5h11" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
        ),
      },
    ],
  },
]

export function SidebarNavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { currentRole, setCurrentRole } = useAuth()

  return (
    <div className="flex flex-col h-full">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <div className="sidebar-logo-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="0.5" fill="white" opacity="0.9"/>
              <rect x="8" y="1" width="5" height="5" rx="0.5" fill="white" opacity="0.6"/>
              <rect x="1" y="8" width="5" height="5" rx="0.5" fill="white" opacity="0.6"/>
              <rect x="8" y="8" width="5" height="5" rx="0.5" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <div>
            <div className="sidebar-logo-text">HDMS</div>
            <div className="sidebar-logo-sub">House Dev. Mgmt.</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map((section) => (
          <div key={section.label} style={{ marginBottom: 16 }}>
            <div className="sidebar-section-label">{section.label}</div>
            {section.items.map((item) => {
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard' || pathname === '/'
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={`nav-link${isActive ? ' active' : ''}`}
                  onClick={() => onNavigate?.()}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div
        style={{
          marginTop: 'auto',
          padding: '12px 16px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {/* ── Demo Role Switcher ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--color-ink-secondary)',
            }}
          >
            Demo Role
          </span>
          <div
            style={{
              display: 'inline-flex',
              padding: '2px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-canvas)',
              gap: '2px',
            }}
          >
            <button
              type="button"
              id="role-switch-owner"
              onClick={() => setCurrentRole('Owner')}
              style={{
                fontSize: '11px',
                fontWeight: currentRole === 'Owner' ? 600 : 500,
                padding: '2px 8px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: currentRole === 'Owner' ? 'var(--color-surface)' : 'transparent',
                color: currentRole === 'Owner' ? 'var(--color-ink)' : 'var(--color-ink-tertiary)',
                boxShadow: currentRole === 'Owner' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Owner
            </button>
            <button
              type="button"
              id="role-switch-employee"
              onClick={() => setCurrentRole('Employee')}
              style={{
                fontSize: '11px',
                fontWeight: currentRole === 'Employee' ? 600 : 500,
                padding: '2px 8px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: currentRole === 'Employee' ? 'var(--color-surface)' : 'transparent',
                color: currentRole === 'Employee' ? 'var(--color-ink)' : 'var(--color-ink-tertiary)',
                boxShadow: currentRole === 'Employee' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Employee
            </button>
          </div>
        </div>

        {/* ── App Version & Theme Toggle ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '6px',
            borderTop: '1px solid var(--color-border-subtle)',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: 'var(--color-ink-tertiary)',
              fontWeight: 500,
            }}
          >
            MVP v0.1.0
          </span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="sidebar hidden md:flex">
      <SidebarNavContent />
    </aside>
  )
}

export function MobileHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header
      className="flex md:hidden items-center justify-between px-4 py-3 border-b border-border bg-[var(--color-surface)] sticky top-0 z-40"
      id="mobile-header"
    >
      <div className="flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="inline-flex items-center justify-center size-8 -ml-1 text-muted-foreground hover:text-foreground rounded-md transition-colors"
            aria-label="Open navigation menu"
            id="mobile-menu-trigger"
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-[270px] bg-[var(--color-surface)] border-r border-border"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <div className="h-full">
              <SidebarNavContent onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/dashboard" prefetch={true} className="flex items-center gap-2 text-inherit no-underline">
          <div className="sidebar-logo-icon" style={{ width: 22, height: 22 }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="0.5" fill="white" opacity="0.9"/>
              <rect x="8" y="1" width="5" height="5" rx="0.5" fill="white" opacity="0.6"/>
              <rect x="1" y="8" width="5" height="5" rx="0.5" fill="white" opacity="0.6"/>
              <rect x="8" y="8" width="5" height="5" rx="0.5" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em' }}>HDMS</span>
        </Link>
      </div>

      <ThemeToggle />
    </header>
  )
}
