'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const menus = [
  { label: 'HOME',        href: '/',            icon: '⌂', desc: 'INTRO' },
  { label: 'ABOUT ME',    href: '/about',        icon: '◉', desc: 'EXPERIMENT_00' },
  { label: 'DEV LOG',     href: '/board',        icon: '✍', desc: 'EXPERIMENT_01' },
  { label: 'AI BATTLE',   href: '/ai-battle',    icon: '⚔', desc: 'EXPERIMENT_02' },
  { label: 'PUBLIC DATA', href: '/public-data',  icon: '◈', desc: 'EXPERIMENT_03' },
  { label: 'YT COMMENTS', href: '/youtube',      icon: '▶', desc: 'EXPERIMENT_04' },
]

export default function Sidebar() {
  const path = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside style={{
      width: collapsed ? '60px' : 'var(--sidebar-w)',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: collapsed ? '32px 10px' : '32px 20px',
      zIndex: 100,
      transition: 'width 0.25s ease, padding 0.25s ease',
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: collapsed ? 'center' : 'space-between', marginBottom: '40px' }}>
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

      {!collapsed && <div style={{ height: '1px', background: 'var(--border)', marginBottom: '24px' }} />}

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menus.map(m => {
          const active = path === m.href || (m.href !== '/' && path.startsWith(m.href))
          return (
            <Link key={m.href} href={m.href} title={collapsed ? m.label : undefined} style={{
              display: 'flex', alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: '10px', padding: collapsed ? '12px 0' : '12px 14px',
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
        })}
      </nav>

      {!collapsed && (
        <div style={{ marginTop: 'auto' }}>
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
