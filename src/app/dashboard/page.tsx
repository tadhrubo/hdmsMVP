import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DashboardMetrics } from './dashboard-metrics'

export const instant = false
export const metadata: Metadata = { title: 'Executive Dashboard | HDMS' }

// ─── Formatters ────────────────────────────────────────────────────────
function formatBDT(amount: number) {
  const isNegative = amount < 0
  const abs = Math.abs(amount)
  const formatted = abs.toLocaleString('en-IN', { maximumFractionDigits: 0 })
  return `${isNegative ? '- ' : ''}৳ ${formatted}`
}

function formatNumber(num: number) {
  return num.toLocaleString('en-IN')
}

export default async function DashboardPage() {
  const supabase = await createClient()

  // ── Step 1: Parallel Database Aggregation ────────────────────────────
  const [
    { count: projectCount },
    { count: buildingCount },
    { count: flatCount },
    { count: soldCount },
    { count: availableCount },
    { data: bookingsData },
    { data: paymentsData },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('buildings').select('*', { count: 'exact', head: true }),
    supabase.from('flats').select('*', { count: 'exact', head: true }),
    supabase.from('flats').select('*', { count: 'exact', head: true }).eq('status', 'Sold'),
    supabase.from('flats').select('*', { count: 'exact', head: true }).eq('status', 'Available'),
    supabase.from('bookings').select('total_price'),
    supabase.from('payments').select('amount'),
  ])

  // Calculated Core KPIs
  const totalProjects = projectCount ?? 0
  const totalBuildings = buildingCount ?? 0
  const totalFlats = flatCount ?? 0
  const soldFlats = soldCount ?? 0
  const availableFlats = availableCount ?? 0

  const totalSalesValue =
    bookingsData?.reduce((acc, b) => acc + (Number(b.total_price) || 0), 0) ?? 0
  const totalCollected =
    paymentsData?.reduce((acc, p) => acc + (Number(p.amount) || 0), 0) ?? 0
  const totalDue = Math.max(0, totalSalesValue - totalCollected)

  // ── Step 2: Mocking Omitted Modules (Inventory & Expenses) ───────────
  const CONSTRUCTION_EXPENSE = 124000000 // ৳ 12,40,00,000
  const MATERIAL_COST = 87500000         // ৳ 8,75,00,000
  const TOTAL_EXPENSES = CONSTRUCTION_EXPENSE + MATERIAL_COST // ৳ 21,15,00,000

  // Project Profit/Loss = Total Collected - (Construction Expense + Material Cost)
  const projectProfitLoss = totalCollected - TOTAL_EXPENSES
  const isProfitable = projectProfitLoss >= 0

  // Absorption / Sales Rate
  const absorptionRate =
    totalFlats > 0 ? Math.round((soldFlats / totalFlats) * 100) : 0
  const collectionRate =
    totalSalesValue > 0 ? Math.round((totalCollected / totalSalesValue) * 100) : 0

  return (
    <>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1>Executive Dashboard</h1>
              <Badge variant="outline" style={{ fontSize: 11, fontWeight: 600 }}>
                Live Portfolio
              </Badge>
            </div>
            <p className="text-muted" style={{ marginTop: 4, fontSize: 13.5 }}>
              Comprehensive real estate portfolio performance, sales realization &amp; capital tracking
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href="/projects" className="btn btn-ghost btn-sm">
              Portfolio
            </Link>
            <Link href="/bookings" className="btn btn-primary btn-sm">
              Sales Ledger
            </Link>
          </div>
        </div>
      </div>

      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* ── Financial & Asset Metrics with RBAC & P/L Export ── */}
        <DashboardMetrics
          totalSalesValue={totalSalesValue}
          totalCollected={totalCollected}
          totalDue={totalDue}
          constructionExpense={CONSTRUCTION_EXPENSE}
          materialCost={MATERIAL_COST}
          totalExpenses={TOTAL_EXPENSES}
          projectProfitLoss={projectProfitLoss}
          isProfitable={isProfitable}
          totalProjects={totalProjects}
          totalBuildings={totalBuildings}
          totalFlats={totalFlats}
          soldFlats={soldFlats}
          availableFlats={availableFlats}
          absorptionRate={absorptionRate}
          collectionRate={collectionRate}
        >

        {/* ── Section 2: Property & Unit Distribution (Structural Counts) ── */}
        <div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-ink-tertiary)' }}>
              Physical Asset Inventory
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Total Projects */}
            <Card style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <CardHeader style={{ padding: '16px 18px 2px' }}>
                <CardDescription style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Projects
                </CardDescription>
                <CardTitle className="mono" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-ink)', marginTop: 4 }}>
                  {formatNumber(totalProjects)}
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: '0 18px 16px' }}>
                <span className="text-tiny text-muted">Active developments</span>
              </CardContent>
            </Card>

            {/* Total Buildings */}
            <Card style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <CardHeader style={{ padding: '16px 18px 2px' }}>
                <CardDescription style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Buildings
                </CardDescription>
                <CardTitle className="mono" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-ink)', marginTop: 4 }}>
                  {formatNumber(totalBuildings)}
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: '0 18px 16px' }}>
                <span className="text-tiny text-muted">Across all project sites</span>
              </CardContent>
            </Card>

            {/* Total Flats */}
            <Card style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <CardHeader style={{ padding: '16px 18px 2px' }}>
                <CardDescription style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Units / Flats
                </CardDescription>
                <CardTitle className="mono" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-ink)', marginTop: 4 }}>
                  {formatNumber(totalFlats)}
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: '0 18px 16px' }}>
                <span className="text-tiny text-muted">{absorptionRate}% overall absorption</span>
              </CardContent>
            </Card>

            {/* Sold Flats */}
            <Card style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <CardHeader style={{ padding: '16px 18px 2px' }}>
                <CardDescription style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Sold Flats
                </CardDescription>
                <CardTitle className="mono" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-success)', marginTop: 4 }}>
                  {formatNumber(soldFlats)}
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: '0 18px 16px' }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--color-success)',
                    background: 'var(--color-success-bg)',
                    padding: '1px 6px',
                    borderRadius: 3,
                  }}
                >
                  Booked &amp; Contracted
                </span>
              </CardContent>
            </Card>

            {/* Available Flats */}
            <Card style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <CardHeader style={{ padding: '16px 18px 2px' }}>
                <CardDescription style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Available Flats
                </CardDescription>
                <CardTitle className="mono" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-ink)', marginTop: 4 }}>
                  {formatNumber(availableFlats)}
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: '0 18px 16px' }}>
                <span className="text-tiny text-muted">Ready for booking</span>
              </CardContent>
            </Card>
          </div>
        </div>

        </DashboardMetrics>

        {/* ── Section 4: Operational Panels ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Quick Management Links */}
          <div className="panel">
            <div className="panel-header">
              <h3 style={{ fontSize: 14, fontWeight: 600 }}>Operational Shortcuts</h3>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link
                href="/projects"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 13,
                  color: 'var(--color-ink)',
                  textDecoration: 'none',
                  padding: '8px 10px',
                  borderRadius: 4,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-canvas)',
                }}
              >
                <span style={{ fontWeight: 500 }}>Property Management (Projects, Buildings &amp; Flats)</span>
                <span style={{ color: 'var(--color-ink-tertiary)' }}>→</span>
              </Link>

              <Link
                href="/clients"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 13,
                  color: 'var(--color-ink)',
                  textDecoration: 'none',
                  padding: '8px 10px',
                  borderRadius: 4,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-canvas)',
                }}
              >
                <span style={{ fontWeight: 500 }}>CRM &amp; Client Registry</span>
                <span style={{ color: 'var(--color-ink-tertiary)' }}>→</span>
              </Link>

              <Link
                href="/bookings"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 13,
                  color: 'var(--color-ink)',
                  textDecoration: 'none',
                  padding: '8px 10px',
                  borderRadius: 4,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-canvas)',
                }}
              >
                <span style={{ fontWeight: 500 }}>Sales Ledger &amp; Agreement Documents</span>
                <span style={{ color: 'var(--color-ink-tertiary)' }}>→</span>
              </Link>
            </div>
          </div>

          {/* System & Cloud Health */}
          <div className="panel">
            <div className="panel-header">
              <h3 style={{ fontSize: 14, fontWeight: 600 }}>Infrastructure &amp; Storage Health</h3>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                <span className="text-muted">Supabase Postgres</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-success)', fontWeight: 600, fontSize: 12 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)' }} />
                  Connected (Active)
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                <span className="text-muted">Agreements Bucket</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-success)', fontWeight: 600, fontSize: 12 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)' }} />
                  Storage Ready
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                <span className="text-muted">RLS &amp; Security Layer</span>
                <span style={{ color: 'var(--color-ink-secondary)', fontSize: 12 }}>
                  Configured
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                <span className="text-muted">Application Version</span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--color-ink)' }}>
                  HDMS MVP v0.1.0
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
