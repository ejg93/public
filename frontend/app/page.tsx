'use client'
import { useState } from 'react'
import Career from './Career'
import StackChips from './StackChips'
import { CAREERS } from './career-data'

const GITHUB = 'https://github.com/ejg93'
const EMAIL = 'ejg933@gmail.com'

const TILES = [
  {
    label: 'PROJECT SHOP',
    hook: '멀티 셀러 쇼핑몰',
    desc: '권한 체계 · CI 6종 · 설계 기록 · 개발 중',
    stack: ['Spring Boot', 'Java', 'Next.js', 'PostgreSQL', 'Flyway', 'Playwright'],
    href: '/projectshop',
    color: 'var(--accent2)',
  },
  {
    label: 'TOOLBOX',
    hook: '폐쇄망 반입 도구 7개',
    desc: '파일 하나 · CDN 없음 · 표준단어 변환',
    stack: ['HTML', 'Vanilla JS', '단일 파일'],
    href: '/toolbox',
    color: 'var(--accent3)',
  },
  {
    label: 'HOW I WORK',
    hook: '규칙을 기계가 지킨다',
    desc: 'hook · lint · 검증 도장 · PR 게이트',
    stack: ['bash hook', 'ESLint', 'GitHub Actions'],
    href: '/workflow',
    color: 'var(--accent)',
  },
]

const chip: React.CSSProperties = {
  fontSize: '12px',
  padding: '2px 8px',
  borderRadius: '999px',
  border: '1px solid var(--border)',
  color: 'var(--muted)',
}

const totalMonths = CAREERS.reduce((s, c) => s + parseInt(c.months, 10), 0)

const linkBtn: React.CSSProperties = {
  fontSize: '12px',
  letterSpacing: '1px',
  padding: '6px 12px',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  color: 'var(--text)',
  textDecoration: 'none',
}

export default function Home() {
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null)

  // 이메일은 mailto 로 안 열고 복사만 한다. 결과를 1.5초 보여 준다
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied('ok')
    } catch {
      setCopied('fail')
    }
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div style={{ paddingTop: '8px', maxWidth: '880px' }}>
      {/* ── 히어로: 누구인가 ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 className="display" style={{ fontSize: '44px', lineHeight: 1, margin: '0 0 12px' }}>
            <span style={{ color: 'var(--text)' }}>JAVA </span>
            <span style={{ color: 'var(--accent)' }}>DEVELOPER </span>
            <span style={{ color: 'var(--muted)' }}>EJK</span>
          </h1>
          <p style={{ color: 'var(--text)', fontSize: '16px', lineHeight: 1.7, margin: 0 }}>
            공공·금융 SI Java 백엔드 5년차 — eGovFrame · Spring · Oracle · Tibero
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.7, margin: '4px 0 0' }}>
            폐쇄망 프로젝트 {CAREERS.length}건 · {totalMonths}개월. 요구사항 재정의부터 테이블 설계·배치 운영까지
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', paddingTop: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="mono" style={{ ...linkBtn, color: 'var(--accent)', borderColor: 'var(--accent)' }}>
            ◉ 재직 중 · 2026.09
          </span>
          <a className="mono" href={GITHUB} target="_blank" rel="noopener noreferrer" style={linkBtn}>GITHUB ↗</a>
          <button
            type="button"
            className="mono"
            onClick={copyEmail}
            title="누르면 주소를 복사한다"
            style={{
              ...linkBtn,
              background: 'transparent',
              cursor: 'pointer',
              color: copied === 'ok' ? 'var(--accent)' : copied === 'fail' ? 'var(--accent2)' : 'var(--text)',
              borderColor: copied === 'ok' ? 'var(--accent)' : 'var(--border)',
            }}
          >
            {copied === 'ok' ? '✓ 복사됨' : copied === 'fail' ? '복사 실패 — ' + EMAIL : EMAIL}
          </button>
        </div>
      </div>

      {/* ── 타일: 어디를 누르나 ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '12px',
        margin: '28px 0 20px',
      }}>
        {TILES.map(t => (
          <a key={t.href} href={t.href} style={{
            display: 'block',
            padding: '18px 20px',
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderLeft: `4px solid ${t.color}`,
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'border-color 0.15s, transform 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.borderLeftColor = t.color; e.currentTarget.style.transform = 'none' }}
          >
            <div className="mono" style={{ fontSize: '12px', letterSpacing: '3px', color: t.color, marginBottom: '8px' }}>
              {t.label} →
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>{t.hook}</div>
            <div className="mono" style={{ fontSize: '12px', color: 'var(--muted)' }}>{t.desc}</div>
            <div className="mono" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '10px' }}>
              {t.stack.map(s => <span key={s} style={chip}>{s}</span>)}
            </div>
          </a>
        ))}
      </div>

      {/* ── 스택: 뭘 얼마나 썼나 ── */}
      <StackChips />

      {/* ── 경력: 어디서 ── */}
      <div id="career" className="mono" style={{
        fontSize: '12px',
        color: 'var(--accent)',
        letterSpacing: '4px',
        margin: '36px 0 8px',
      }}>
        CAREER
      </div>
      <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.8, margin: '0 0 14px' }}>
        행을 누르면 역할·기여도·담당 업무 표시.<br />
        전 프로젝트 폐쇄망으로 코드·화면 반출 불가.
      </p>
      <Career />
    </div>
  )
}
