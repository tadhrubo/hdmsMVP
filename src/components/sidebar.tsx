'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './theme-toggle'

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

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar">
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
                  className={`nav-link${isActive ? ' active' : ''}`}
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
          alignItems: 'center',
          justifyContent: 'space-between',
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
    </aside>
  )
}
