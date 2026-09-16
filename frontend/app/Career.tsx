'use client'
import { useEffect, useState } from 'react'
import { CAREERS } from './career-data'

const label: React.CSSProperties = {
  fontSize: '12px',
  letterSpacing: '2px',
  color: 'var(--muted)',
  marginBottom: '4px',
}

const body: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.8,
  color: 'var(--text)',
  whiteSpace: 'var(--ws-body)' as React.CSSProperties['whiteSpace'],
}

export default function Career() {
  const [open, setOpen] = useState<number | null>(0)

  // 홈 FIELD WORK 타일이 이 이벤트를 보낸다. 닫혀 있던 행을 펼친 채로 내려가게 한다
  useEffect(() => {
    const onOpen = (e: Event) => setOpen((e as CustomEvent<number>).detail)
    window.addEventListener('career-open', onOpen)
    return () => window.removeEventListener('career-open', onOpen)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {CAREERS.map((c, i) => {
        const isOpen = open === i
        return (
          <div key={c.name} style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: 'transparent',
                border: 0,
                color: 'var(--text)',
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <span className="mono career-period" style={{ fontSize: '12px', color: 'var(--muted)' }}>
                {c.period}
              </span>
              <span style={{ flex: 1, fontWeight: 700, fontSize: '15px' }}>{c.name}</span>
              <span style={{ color: 'var(--muted)', fontSize: '13px', width: '12px' }}>{isOpen ? '−' : '+'}</span>
            </button>

            {isOpen && (
              <div style={{
                padding: '4px 16px 16px',
                borderTop: '1px solid var(--border)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '14px 24px',
              }}>
                <div>
                  <div className="mono" style={label}>소속 / 고객</div>
                  <div style={body}>{c.company} / {c.client}</div>
                </div>
                <div>
                  <div className="mono" style={label}>기간 · 스택</div>
                  <div style={body}>{c.months}{'\n'}{c.stack}</div>
                </div>

                {c.team && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div className="mono" style={label}>역할 · 기여도</div>
                    <div style={body}>{c.team}</div>
                  </div>
                )}

                <div style={{ gridColumn: '1 / -1' }}>
                  <div className="mono" style={label}>담당 업무 · 성과</div>
                  <ol style={{ ...body, margin: 0, paddingLeft: '22px', listStyle: 'decimal' }}>
                    {c.tasks.map(t => <li key={t}>{t}</li>)}
                  </ol>
                </div>

                {c.proof && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div className="mono" style={label}>업무 증빙</div>
                    <div style={body}>{c.proof}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
