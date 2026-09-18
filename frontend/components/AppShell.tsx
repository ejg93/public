'use client'
import Sidebar from '@/components/Sidebar'
import { useEffect } from 'react'
import { useStoredFlag } from '@/lib/clientStore'

// 테마 토글과 사이드바가 상태를 쥐고 있어 클라이언트 컴포넌트다.
// 루트 레이아웃은 서버 컴포넌트로 남겨야 metadata(탭 제목)를 내보낼 수 있다.
export default function AppShell({ children }: { children: React.ReactNode }) {
  // 마지막으로 고른 테마를 이 브라우저에만 남긴다. 저장값을 읽는 쪽은 lib/clientStore 다 —
  // 이펙트로 읽어 setState 하면 첫 렌더 뒤에 한 번 더 그리고, 쓰기를 막을 플래그도 따로 있어야 했다
  const [darkMode, setDarkMode] = useStoredFlag('theme', 'dark', 'light')

  // 팔레트는 globals.css 가 쥐고 있다. 여기서는 어느 쪽을 쓸지만 표시한다
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) root.setAttribute('data-theme', 'dark')
    else root.removeAttribute('data-theme')
  }, [darkMode])

  return (
    <>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        {/* minWidth 0 이 없으면 이 칸이 본문의 min-content 아래로 안 줄어든다.
            글꼴이 넓은 환경에서는 그 폭이 화면을 넘겨 모든 라우트에 가로 스크롤이 생긴다 */}
        <div className="sidebar-push" style={{ marginLeft: 'var(--sidebar-cur)', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
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
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '11px',
                padding: '5px 14px',
                letterSpacing: '1px',
                transition: 'all 0.15s',
              }}
            >
              {darkMode ? '☀ LIGHT' : '☾ DARK'}
            </button>
          </div>
          {/* 여백은 globals.css 의 .main-body 에 있다. 폰에서 미디어쿼리로 줄인다 */}
          <main className="main-body" style={{
            flex: 1,
            minHeight: '100vh',
          }}>
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
