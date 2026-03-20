'use client'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { useState, useEffect } from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.style.setProperty('--bg', '#080c10')
      root.style.setProperty('--surface', '#0d1117')
      root.style.setProperty('--surface2', '#161b22')
      root.style.setProperty('--border', '#21262d')
      root.style.setProperty('--text', '#e6edf3')
      root.style.setProperty('--muted', '#adbac7')
      root.style.setProperty('--accent', '#00ff88')
      root.style.setProperty('--accent2', '#ff6b35')
      root.style.setProperty('--accent3', '#4d9fff')
    } else {
      root.style.setProperty('--bg', '#f4f6f8')
      root.style.setProperty('--surface', '#ffffff')
      root.style.setProperty('--surface2', '#eef1f4')
      root.style.setProperty('--border', '#d0d7de')
      root.style.setProperty('--text', '#1a1f2e')
      root.style.setProperty('--muted', '#444c56')
      root.style.setProperty('--accent', '#0a7c4e')
      root.style.setProperty('--accent2', '#c94f1a')
      root.style.setProperty('--accent3', '#1a6bb5')
    }
  }, [darkMode])

  return (
    <html lang="ko">
      <body>
        <div className="scanline" />
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <div style={{ marginLeft: 'var(--sidebar-w)', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              position: 'fixed',
              top: 0,
              left: 'var(--sidebar-w)',
              right: 0,
              height: '48px',
              background: 'var(--surface)',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '0 32px',
              zIndex: 90,
            }}>
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '11px',
                  padding: '5px 14px',
                  letterSpacing: '1px',
                  transition: 'all 0.15s',
                }}
              >
                {darkMode ? '☀ LIGHT' : '☾ DARK'}
              </button>
            </div>
            <main style={{
              flex: 1,
              padding: '80px 48px 40px',
              minHeight: '100vh',
            }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
