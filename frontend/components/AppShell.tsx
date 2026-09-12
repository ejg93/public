'use client'
import Sidebar from '@/components/Sidebar'
import { useState, useEffect } from 'react'

// 테마 토글과 사이드바가 상태를 쥐고 있어 클라이언트 컴포넌트다.
// 루트 레이아웃은 서버 컴포넌트로 남겨야 metadata(탭 제목)를 내보낼 수 있다.
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true)
  const [restored, setRestored] = useState(false)

  // 마지막으로 고른 테마를 이 브라우저에만 남긴다
  useEffect(() => {
    try {
      setDarkMode(localStorage.getItem('theme') !== 'light')
    } catch {
      // 접근이 막히면 다크 기본값으로 간다
    }
    setRestored(true)
  }, [])

  // 팔레트는 globals.css 가 쥐고 있다. 여기서는 어느 쪽을 쓸지만 표시한다
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', 'light')
    if (!restored) return
    try {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    } catch {
      // 저장이 막혀도 이번 세션 동작에는 지장이 없다
    }
  }, [darkMode, restored])

  return (
    <>
      <div className="scanline" />
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <div className="sidebar-push" style={{ marginLeft: 'var(--sidebar-cur)', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 'var(--sidebar-cur)',
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
    </>
  )
}
