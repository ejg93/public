// 기술 스택 칩. career-data 의 stack 을 집계해서 그린다 — 손으로 안 센다.
// 숫자는 칩 위에 안 쓴다. 비교를 부르고 얇은 자리가 먼저 보인다. 칩을 누르면 그 아래 한 줄로 편다.
// 강조 기준은 최신 두 프로젝트 — 횟수로 가르면 지금 쓰는 것이 흐린 줄로 밀린다.
'use client'
import { useState } from 'react'
import { CAREERS } from './career-data'

type Agg = { name: string; count: number; months: number; projects: string[] }

function aggregate(): Agg[] {
  const map = new Map<string, Agg>()
  for (const c of CAREERS) {
    const months = parseInt(c.months, 10)
    for (const raw of c.stack.split(' · ')) {
      const name = raw.trim()
      const cur = map.get(name) ?? { name, count: 0, months: 0, projects: [] }
      cur.count += 1
      cur.months += months
      cur.projects.push(c.name)
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

// 스택별로 그걸 써서 한 일 한 줄. 출처는 전부 career-data 의 담당 업무 — 거기 없는 말은 안 쓴다.
// 없는 스택은 프로젝트 이름만 편다
const EVIDENCE: Record<string, string> = {
  Oracle: '조인 30본을 ANSI 조인으로 변환해 MySQL 로 이식 · 월 요금 배치 수천만 건 운영',
  Tibero: '응급발생처리 사후관리 테이블 신규 설계 — FK·소프트 삭제·감사 컬럼',
  eGovFrame: '레거시 코드 분석으로 설계 복원 후 신규 화면·통계 화면 개발',
  Redis: '계약신청 조회에 AOP 캐시를 얹어 동일 쿼리 재조회 제거',
  Spring: 'AOP 로 로깅·트랜잭션 공통 처리 분리',
  JSP: '퍼블리셔 없이 보험 화면 4개 이상을 화면 설계부터 단독 개발',
  Java: 'Fortran 계산 로직을 Java 로 변환 · 요구사항 5건을 12건으로 재정의해 구현',
  MySQL: 'Oracle 쿼리 30본 이식 — NVL·LIMIT 류 함수 치환, 전후 결과 일치 검증',
  Fortran: '고도화 대상 계산 로직을 읽어 Java 로 옮김',
  DB2: 'NoSQL·RDBMS 간 계정 동기화 장애 — 양쪽 DB 대조 후 정리',
  Delphi: '지자체 상하수도 요금 화면과 SQL 수정으로 유지보수',
}

const tip = (s: Agg) => `${s.count}건 · ${s.months}개월`

export default function StackChips() {
  const [picked, setPicked] = useState<string | null>(null)
  const sel = picked ? STACK.find(s => s.name === picked) : undefined

  const toggle = (name: string) => setPicked(picked === name ? null : name)

  return (
    <div>
      <div className="mono" style={{ fontSize: '12px', letterSpacing: '3px', color: 'var(--muted)', marginBottom: '8px' }}>
        STACK
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
        {MAIN.map(s => (
          <button key={s.name} type="button" className="mono" title={tip(s)} onClick={() => toggle(s.name)}
            aria-pressed={picked === s.name}
            style={{
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 700,
              border: '1px solid var(--accent)',
              color: 'var(--text)',
              background: picked === s.name ? 'rgba(0,255,136,0.18)' : 'rgba(0,255,136,0.06)',
              cursor: 'pointer',
            }}>
            {s.name}
          </button>
        ))}
      </div>
      <div className="mono" style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.8 }}>
        {REST.map((s, i) => (
          <span key={s.name}>
            {i > 0 && ' · '}
            <button type="button" title={tip(s)} onClick={() => toggle(s.name)} aria-pressed={picked === s.name}
              style={{
                background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
                font: 'inherit', color: picked === s.name ? 'var(--accent)' : 'inherit',
              }}>
              {s.name}
            </button>
          </span>
        ))}
      </div>

      {/* 누른 칩의 근거. 건수·기간은 집계값, 한 줄 설명은 EVIDENCE */}
      {sel && (
        <div style={{
          marginTop: '10px', padding: '10px 14px',
          background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px',
          fontSize: '13px', lineHeight: 1.7, color: 'var(--text)',
        }}>
          <span className="mono" style={{ color: 'var(--accent)', marginRight: '10px' }}>{sel.name}</span>
          <span className="mono" style={{ color: 'var(--muted)', fontSize: '12px' }}>{tip(sel)}</span>
          <div>{EVIDENCE[sel.name] ?? sel.projects.join(' · ')}</div>
        </div>
      )}
    </div>
  )
}
