// 기술 스택 칩. career-data 의 stack 을 집계해서 그린다 — 손으로 안 센다.
// 숫자는 화면에 안 쓴다. 비교를 부르고 얇은 자리가 먼저 보인다. title 로만 남긴다.
// 강조 기준은 최신 두 프로젝트 — 횟수로 가르면 지금 쓰는 것이 흐린 줄로 밀린다.
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

// 강조는 최신 두 프로젝트의 스택. 등장 순서대로 — 지금 쓰는 것이 앞에 온다
// 최신 프로젝트에 있어도 강조에서 뺄 것. 잠깐 스쳐 자신 없는 것은 흐린 줄로
const DEMOTE = new Set(['AngularJS'])
const RECENT = new Set(
  CAREERS.slice(0, 2).flatMap(c => c.stack.split(' · ').map(s => s.trim())).filter(s => !DEMOTE.has(s)),
)
const recentOrder = Array.from(RECENT)
const MAIN = STACK.filter(s => RECENT.has(s.name)).sort((a, b) => recentOrder.indexOf(a.name) - recentOrder.indexOf(b.name))
const REST = STACK.filter(s => !RECENT.has(s.name))

const tip = (s: Agg) => `${s.count}건 · ${s.months}개월`

export default function StackChips() {
  return (
    <div>
      <div className="mono" style={{ fontSize: '12px', letterSpacing: '3px', color: 'var(--muted)', marginBottom: '8px' }}>
        STACK
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
        {MAIN.map(s => (
          <span key={s.name} className="mono" title={tip(s)} style={{
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 700,
            border: '1px solid var(--accent)',
            color: 'var(--text)',
            background: 'rgba(0,255,136,0.06)',
          }}>
            {s.name}
          </span>
        ))}
      </div>
      <div className="mono" style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.8 }}>
        {REST.map((s, i) => (
          <span key={s.name} title={tip(s)}>
            {i > 0 && ' · '}{s.name}
          </span>
        ))}
      </div>
    </div>
  )
}
