import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'DEV Portfolio',
  description: '93년생 5년차 개발자 포트폴리오',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="scanline" />
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main style={{
            marginLeft: 'var(--sidebar-w)',
            flex: 1,
            padding: '40px 48px',
            minHeight: '100vh',
          }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
