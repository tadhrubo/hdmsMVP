import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>404</h1>
            <p className="text-muted" style={{ marginTop: 4, fontSize: 13.5 }}>
              Page not found
            </p>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="panel">
          <div className="empty-state">
            <p style={{ fontWeight: 500, marginBottom: 12 }}>
              The page you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link href="/dashboard" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
