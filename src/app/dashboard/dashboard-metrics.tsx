'use client'

import React from 'react'
import { useAuth } from '@/components/auth-provider'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, Lock, ShieldCheck, Printer } from 'lucide-react'

interface DashboardMetricsProps {
  totalSalesValue: number
  totalCollected: number
  totalDue: number
  constructionExpense: number
  materialCost: number
  totalExpenses: number
  projectProfitLoss: number
  isProfitable: boolean
  totalProjects: number
  totalBuildings: number
  totalFlats: number
  soldFlats: number
  availableFlats: number
  absorptionRate: number
  collectionRate: number
  children?: React.ReactNode
}

function formatBDT(amount: number) {
  const isNegative = amount < 0
  const abs = Math.abs(amount)
  const formatted = abs.toLocaleString('en-IN', { maximumFractionDigits: 0 })
  return `${isNegative ? '- ' : ''}৳ ${formatted}`
}

function formatNumber(num: number) {
  return num.toLocaleString('en-IN')
}

export function DashboardMetrics({
  totalSalesValue,
  totalCollected,
  totalDue,
  constructionExpense,
  materialCost,
  totalExpenses,
  projectProfitLoss,
  isProfitable,
  totalProjects,
  totalBuildings,
  totalFlats,
  soldFlats,
  availableFlats,
  absorptionRate,
  collectionRate,
  children,
}: DashboardMetricsProps) {
  const { currentRole } = useAuth()
  const isOwner = currentRole === 'Owner'

  function handleDownloadCSV() {
    const rows = [
      ['HOUSE DEVELOPMENT MANAGEMENT SYSTEM (HDMS)', ''],
      ['EXECUTIVE PROFIT & LOSS STATEMENT', ''],
      [`Generated Date: ${new Date().toLocaleString('en-GB')}`, ''],
      [`Access Level: Executive Owner (RBAC Verified)`, ''],
      ['', ''],
      ['Financial Metric', 'Amount (BDT)', 'Remarks'],
      ['Total Sales Contracted', totalSalesValue, 'All registered flat bookings'],
      ['Total Cash Inflows Collected', totalCollected, 'Verified installment payments'],
      ['Outstanding Receivables (Due)', totalDue, 'Pending buyer balances'],
      ['Civil Construction Expense', constructionExpense, 'Structural contractor billings'],
      ['Material Procurement Cost', materialCost, 'Raw steel, cement, finishing'],
      ['Total Capital Outlay', totalExpenses, 'Civil + Material expenses'],
      ['Net Profit / Loss', projectProfitLoss, isProfitable ? 'Net Surplus' : 'Net Deficit'],
      ['', ''],
      ['Portfolio Physical Inventory', 'Count', 'Status'],
      ['Total Projects', totalProjects, 'Active developments'],
      ['Total Buildings', totalBuildings, 'Across sites'],
      ['Total Units / Flats', totalFlats, 'Total inventory'],
      ['Sold Units', soldFlats, `${absorptionRate}% overall absorption`],
      ['Available Units', availableFlats, 'Ready for reservation'],
    ]

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows
        .map((r) =>
          r
            .map((field) =>
              typeof field === 'string' && field.includes(',') ? `"${field}"` : field
            )
            .join(',')
        )
        .join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `HDMS_Profit_Loss_Statement_${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      {/* ── Section 1: Financial Performance ── */}
      <div>
        <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-tertiary)',
            }}
          >
            Realized Revenue &amp; Cash Flow
          </div>

          {isOwner && (
            <button
              type="button"
              id="export-pl-header-btn"
              onClick={handleDownloadCSV}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-border bg-background hover:bg-muted/60 transition-colors shadow-xs"
              title="Download verified P/L CSV Statement"
            >
              <Download className="size-3.5 text-muted-foreground" />
              Download P/L Statement
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Sales Value */}
          <Card style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <CardHeader style={{ padding: '18px 20px 4px' }}>
              <CardDescription style={{ fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total Sales Value
              </CardDescription>
              <CardTitle className="mono" style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--color-ink)', marginTop: 4 }}>
                {formatBDT(totalSalesValue)}
              </CardTitle>
            </CardHeader>
            <CardContent style={{ padding: '0 20px 18px' }}>
              <p className="text-tiny text-muted" style={{ marginTop: 2 }}>
                Contracted flat sales across all registered bookings
              </p>
            </CardContent>
          </Card>

          {/* Total Collected */}
          <Card style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <CardHeader style={{ padding: '18px 20px 4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <CardDescription style={{ fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Collected
                </CardDescription>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    padding: '1px 6px',
                    borderRadius: 3,
                    background: 'var(--color-success-bg)',
                    color: 'var(--color-success)',
                  }}
                >
                  {collectionRate}% Realized
                </span>
              </div>
              <CardTitle className="mono" style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--color-success)', marginTop: 4 }}>
                {formatBDT(totalCollected)}
              </CardTitle>
            </CardHeader>
            <CardContent style={{ padding: '0 20px 18px' }}>
              <p className="text-tiny text-muted" style={{ marginTop: 2 }}>
                Actual cash inflows recorded via installment payments
              </p>
            </CardContent>
          </Card>

          {/* Total Due */}
          <Card style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <CardHeader style={{ padding: '18px 20px 4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <CardDescription style={{ fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Outstanding Due
                </CardDescription>
                {totalDue > 0 && (
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      padding: '1px 6px',
                      borderRadius: 3,
                      background: 'var(--color-warning-bg)',
                      color: 'var(--color-warning)',
                    }}
                  >
                    Receivable
                  </span>
                )}
              </div>
              <CardTitle
                className="mono"
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  color: totalDue > 0 ? 'var(--color-warning)' : 'var(--color-ink)',
                  marginTop: 4,
                }}
              >
                {formatBDT(totalDue)}
              </CardTitle>
            </CardHeader>
            <CardContent style={{ padding: '0 20px 18px' }}>
              <p className="text-tiny text-muted" style={{ marginTop: 2 }}>
                Total sales value minus recorded cash inflows
              </p>
            </CardContent>
          </Card>

          {/* Project Profit / Loss — RBAC Controlled */}
          {isOwner ? (
            <Card style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <CardHeader style={{ padding: '18px 20px 4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CardDescription style={{ fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Project Profit / Loss
                  </CardDescription>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      padding: '1px 6px',
                      borderRadius: 3,
                      background: isProfitable ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                      color: isProfitable ? 'var(--color-success)' : 'var(--color-danger)',
                    }}
                  >
                    {isProfitable ? 'Net Surplus' : 'Net Outlay'}
                  </span>
                </div>
                <CardTitle
                  className="mono"
                  style={{
                    fontSize: '1.65rem',
                    fontWeight: 700,
                    color: isProfitable ? 'var(--color-success)' : 'var(--color-ink)',
                    marginTop: 4,
                  }}
                >
                  {formatBDT(projectProfitLoss)}
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: '0 20px 18px' }}>
                <p className="text-tiny text-muted" style={{ marginTop: 2, marginBottom: 8 }}>
                  Collected ({formatBDT(totalCollected)}) vs Expenses ({formatBDT(totalExpenses)})
                </p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    id="export-pl-card-btn"
                    onClick={handleDownloadCSV}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-foreground bg-muted/60 hover:bg-muted px-2 py-0.5 rounded transition-colors"
                  >
                    <Download className="size-3 text-muted-foreground" />
                    Download P/L Statement
                  </button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card
              style={{
                border: '1px dashed var(--color-border)',
                background: 'var(--color-surface)',
                opacity: 0.75,
              }}
            >
              <CardHeader style={{ padding: '18px 20px 4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CardDescription style={{ fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Project Profit / Loss
                  </CardDescription>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: '1px 6px',
                      borderRadius: 3,
                      background: 'var(--color-border-subtle)',
                      color: 'var(--color-ink-tertiary)',
                    }}
                  >
                    Confidential
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
                  <Lock className="size-4 text-muted-foreground" />
                  <span style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-ink-tertiary)' }}>
                    Owner Access Only
                  </span>
                </div>
              </CardHeader>
              <CardContent style={{ padding: '0 20px 18px' }}>
                <p className="text-tiny text-muted" style={{ marginTop: 6 }}>
                  Net surplus and margin calculations are restricted to executive roles.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {children}

      {/* ── Section 2: Cost & Expense Tracking — RBAC Controlled ── */}
      {isOwner ? (
        <div>
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-tertiary)',
              }}
            >
              Capital Outlay &amp; Site Expenditure
            </div>
            <span
              style={{
                fontSize: 11,
                color: 'var(--color-ink-secondary)',
                fontWeight: 500,
                background: 'var(--color-border-subtle)',
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              Modules 6 &amp; 7 (Demo Projections)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Construction Expense */}
            <Card style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <CardHeader style={{ padding: '18px 20px 4px' }}>
                <CardDescription style={{ fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-ink-secondary)' }}>
                  Construction Expense
                </CardDescription>
                <CardTitle className="mono" style={{ fontSize: '1.45rem', fontWeight: 600, color: 'var(--color-ink)', marginTop: 4 }}>
                  {formatBDT(constructionExpense)}
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: '0 20px 18px' }}>
                <p className="text-tiny text-muted" style={{ marginTop: 2 }}>
                  Civil structural works, labour, contractor billings
                </p>
              </CardContent>
            </Card>

            {/* Material Cost */}
            <Card style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <CardHeader style={{ padding: '18px 20px 4px' }}>
                <CardDescription style={{ fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-ink-secondary)' }}>
                  Material Cost
                </CardDescription>
                <CardTitle className="mono" style={{ fontSize: '1.45rem', fontWeight: 600, color: 'var(--color-ink)', marginTop: 4 }}>
                  {formatBDT(materialCost)}
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: '0 20px 18px' }}>
                <p className="text-tiny text-muted" style={{ marginTop: 2 }}>
                  Steel, cement, bricks, stone aggregate, electro-mechanical
                </p>
              </CardContent>
            </Card>

            {/* Combined Capital Outlay */}
            <Card style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <CardHeader style={{ padding: '18px 20px 4px' }}>
                <CardDescription style={{ fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-ink-secondary)' }}>
                  Total Project Cost Outlay
                </CardDescription>
                <CardTitle className="mono" style={{ fontSize: '1.45rem', fontWeight: 600, color: 'var(--color-ink)', marginTop: 4 }}>
                  {formatBDT(totalExpenses)}
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: '0 20px 18px' }}>
                <p className="text-tiny text-muted" style={{ marginTop: 2 }}>
                  Construction expense + material procurement
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 8,
            border: '1px dashed var(--color-border)',
            background: 'var(--color-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Lock className="size-4 text-muted-foreground shrink-0" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>
                Capital Outlay &amp; Site Expenditure Restricted
              </div>
              <div className="text-tiny text-muted" style={{ marginTop: 2 }}>
                Civil construction expenses and material procurement costs are restricted to Executive Owner role.
              </div>
            </div>
          </div>
          <Badge variant="outline" style={{ fontSize: 10.5, fontWeight: 600 }}>
            Role: Employee
          </Badge>
        </div>
      )}
    </>
  )
}
