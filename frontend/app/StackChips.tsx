// 기술 스택 칩. career-data 의 stack 을 집계해서 그린다 — 손으로 안 센다.
import { CAREERS } from './career-data'

type Agg = { name: string; count: number; months: number }

function aggregate(): Agg[] {
  const map = new Map<string, Agg>()
  for (const c of CAREERS) {
    const months = parseInt(c.months, 10)
    for (const raw of c.stack.split(' · ')) {
      const name = raw.trim()
      const cur = map.get(name) ?? { name, count: 0, months: 0 }
      cur.count += 1
      cur.months += months
      map.set(name, cur)
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count || b.months - a.months)
}

const STACK = aggregate()

export default function StackChips() {
  return (
    <div>
      <div className="mono" style={{ fontSize: '12px', letterSpacing: '3px', color: 'var(--muted)', marginBottom: '8px' }}>
        STACK · 프로젝트 수 · 누적 개월
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {STACK.map(s => {
          const strong = s.count >= 2
          return (
            <span key={s.name} className="mono" style={{
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '13px',
              border: `1px solid ${strong ? 'var(--accent)' : 'var(--border)'}`,
              color: strong ? 'var(--text)' : 'var(--muted)',
              background: strong ? 'rgba(0,255,136,0.06)' : 'transparent',
            }}>
              <span style={{ fontWeight: strong ? 700 : 400 }}>{s.name}</span>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                {s.count}건{strong ? ` · ${s.months}개월` : ''}
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}
