'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const menus = [
  { label: 'HOME',         href: '/',            icon: '⌂', desc: 'INTRO' },
  // /about 은 라우트만 남긴다. Q&A 형식이 리뷰어 동선에 안 맞아 메뉴에서 뺐다
  { label: 'PROJECT SHOP', href: '/projectshop', icon: '▤', desc: 'CASE_STUDY' },
  { label: 'AI WORKFLOW',  href: '/workflow',    icon: '⚙', desc: 'CLAUDE_CODE' },
  { label: 'TOOLBOX',      href: '/toolbox',     icon: '🧰', desc: 'CLOSED_NET' },
  { label: 'STUDY NOTES',  href: '/study',       icon: '✎', desc: 'NOTES' },
]

// 리뷰어 동선에서 빠지는 것. 아래 LAB 묶음으로 내린다
const labMenus = [
  { label: 'DEV LOG',      href: '/board',       icon: '✍', desc: 'LOG' },
  { label: 'YT COMMENTS',  href: '/youtube',     icon: '▶', desc: 'LAB' },
]

export default function Sidebar() {
  const path = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  // 되살리기 전에는 전환 효과를 끈다. 접힌 채로 들어왔는데 220px 에서 밀려오면 눈에 띈다
  const [restored, setRestored] = useState(false)

  // 마지막 접힘 상태를 이 브라우저에만 남긴다. 개인정보가 아니고 서버로도 안 간다
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem('sidebar-collapsed') === '1')
    } catch {
      // 사생활 보호 모드 등에서 접근이 막히면 펼친 기본값으로 간다
    }
    setRestored(true)
  }, [])

  // 본문 여백과 상단 바 위치가 같은 값을 봐야 접을 때 빈 띠가 안 남는다
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-cur', collapsed ? '60px' : '220px')
    if (!restored) return
    document.documentElement.setAttribute('data-sidebar-ready', '1')
    try {
      localStorage.setItem('sidebar-collapsed', collapsed ? '1' : '0')
    } catch {
      // 저장이 막혀도 이번 세션 동작에는 지장이 없다
    }
  }, [collapsed, restored])

  const renderMenu = (m: typeof menus[number]) => {
    const active = path === m.href || (m.href !== '/' && path.startsWith(m.href))
    return (
      <Link key={m.href} href={m.href} title={collapsed ? m.label : undefined} style={{
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: '10px', padding: collapsed ? '10px 0' : '10px 14px',
        borderRadius: '6px', textDecoration: 'none',
        background: active ? 'rgba(0,255,136,0.08)' : 'transparent',
        border: active ? '1px solid rgba(0,255,136,0.2)' : '1px solid transparent',
        transition: 'all 0.15s',
      }}>
        <span style={{ fontSize: '18px', flexShrink: 0 }}>{m.icon}</span>
        {!collapsed && (
          <div>
            <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '2px' }}>{m.desc}</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: active ? 'var(--accent)' : 'var(--text)' }}>{m.label}</div>
          </div>
        )}
      </Link>
    )
  }

  return (
    <aside className="sidebar-rail" style={{
      width: 'var(--sidebar-cur)',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: collapsed ? '32px 10px' : '32px 20px',
      zIndex: 100,
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: collapsed ? 'center' : 'space-between', marginBottom: '28px', flexShrink: 0 }}>
        {!collapsed && (
          <div>
            <div className="mono" style={{ fontSize: '10px', color: 'var(--accent)', letterSpacing: '4px', marginBottom: '6px' }}>◉ ONLINE</div>
            <div className="display" style={{ fontSize: '28px', color: 'var(--text)', lineHeight: 1 }}>DEV</div>
            <div className="display" style={{ fontSize: '28px', color: 'var(--accent)', lineHeight: 1 }}>PORTFOLIO</div>
            <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '8px', letterSpacing: '1px' }}>JAVA · SPRING · NEXT.JS</div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          background: 'transparent', border: '1px solid var(--border)',
          borderRadius: '6px', color: 'var(--muted)', cursor: 'pointer',
          fontSize: '14px', padding: '6px 8px', lineHeight: 1, flexShrink: 0,
        }}>
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      {!collapsed && <div style={{ height: '1px', background: 'var(--border)', marginBottom: '20px', flexShrink: 0 }} />}

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
        {menus.map(renderMenu)}
        {!collapsed && (
          <div className="mono" style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '3px', margin: '14px 14px 2px' }}>
            LAB
          </div>
        )}
        {collapsed && <div style={{ height: '1px', background: 'var(--border)', margin: '10px 4px' }} />}
        {labMenus.map(renderMenu)}
      </nav>

      {!collapsed && (
        <div style={{ marginTop: 'auto', paddingTop: '16px', flexShrink: 0 }}>
          <div style={{ height: '1px', background: 'var(--border)', marginBottom: '16px' }} />
          <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', lineHeight: 2 }}>
            <div>EXP: 5 YRS</div>
            <div>STACK: JSP/JAVA/SPRING</div>
            <div style={{ color: 'var(--accent3)' }}>+ NEXT.JS</div>
          </div>
        </div>
      )}
    </aside>
  )
}
