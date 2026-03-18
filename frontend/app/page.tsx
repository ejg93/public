'use client'

export default function Home() {
  return (
    <div style={{ paddingTop: '60px', maxWidth: '640px' }}>
      <div className="mono" style={{
        fontSize: '11px',
        color: 'var(--accent)',
        letterSpacing: '4px',
        marginBottom: '16px',
      }}>
        SYSTEM READY
      </div>

      <h1 className="display" style={{
        fontSize: '80px',
        lineHeight: 0.9,
        marginBottom: '32px',
      }}>
        <span style={{ color: 'var(--text)' }}>JAVA</span><br />
        <span style={{ color: 'var(--accent)' }}>DEV</span><br />
        <span style={{ color: 'var(--muted)' }}>93</span>
      </h1>

      <p style={{
        color: 'var(--muted)',
        lineHeight: 1.9,
        fontSize: '15px',
        marginBottom: '40px',
      }}>
        JSP · Java · Spring 5년차 개발자.<br />
        정규직 + 프리랜서 경험 보유.<br />
        현재 Next.js로 스택 확장 중.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { label: 'AI BATTLE', desc: 'Claude Opus vs Sonnet 토론 배틀', href: '/ai-battle', color: 'var(--accent)' },
          { label: 'PUBLIC DATA', desc: '공공데이터 시각화', href: '/public-data', color: 'var(--accent3)' },
        ].map(item => (
          <a key={item.href} href={item.href} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'border-color 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = item.color)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <div>
              <div style={{ fontWeight: 700, color: item.color, marginBottom: '4px' }}>{item.label}</div>
              <div className="mono" style={{ fontSize: '12px', color: 'var(--muted)' }}>{item.desc}</div>
            </div>
            <span style={{ color: item.color, fontSize: '20px' }}>→</span>
          </a>
        ))}
      </div>
    </div>
  )
}
