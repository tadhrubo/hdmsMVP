import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { MobileHeader, Sidebar } from '@/components/sidebar'
import { ToastProvider } from '@/components/toast-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth-provider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: { default: 'HDMS', template: '%s · HDMS' },
  description: 'House Development Management System — track projects, flats, clients, and payments.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ToastProvider>
              <div className="app-shell flex flex-col md:flex-row min-h-screen">
                <MobileHeader />
                <Sidebar />
                <main className="main-content flex-1 min-w-0">{children}</main>
              </div>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
