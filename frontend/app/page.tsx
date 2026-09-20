'use client'
import { useState } from 'react'
import Link from 'next/link'
import Career from './Career'
import StackChips from './StackChips'

const GITHUB = 'https://github.com/ejg93'
const EMAIL = 'ejg933@gmail.com'

const TILES = [
  {
    // 실무 카드. 눌러도 다른 페이지가 아니라 아래 CAREER 표로 내려간다. 디돌 행은 기본으로 펼쳐져 있다
    label: 'FIELD WORK',
    hook: '실무 설계 사례 · 디지털돌봄',
    desc: '요구 5건 → 12건 재정의 · 테이블 3개 신규 설계',
    stack: ['Java', 'eGovFrame', 'Tibero', 'JSP'],
    href: '/#career',
    color: 'var(--accent)',
  },
  {
    label: 'PROJECT SHOP',
    hook: '멀티 셀러 쇼핑몰',
    desc: '권한 체계 · CI 6종 · 배포본 공개',
    stack: ['Spring Boot', 'Java', 'Next.js', 'PostgreSQL', 'Flyway', 'Playwright'],
    href: '/projectshop',
    color: 'var(--accent2)',
  },
  {
    label: 'TOOLBOX',
    hook: '폐쇄망 반입 도구 7개',
    desc: 'CDN 없음 · 표준단어 변환',
    stack: ['HTML', 'Vanilla JS', '단일 파일'],
    href: '/toolbox',
    color: 'var(--accent3)',
  },
  {
    label: 'AI WORKFLOW',
    hook: '검증 6개로 닫는 작업 방식',
    desc: '검증 없으면 push 차단 · 문서 lint · CI 6종',
    stack: ['Claude Code', 'bash hook', 'GitHub Actions'],
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
          <h1 className="display display-lg" style={{ lineHeight: 1, margin: '0 0 12px' }}>
            <span style={{ color: 'var(--text)' }}>JAVA </span>
            <span style={{ color: 'var(--accent)' }}>DEVELOPER </span>
            <span style={{ color: 'var(--muted)' }}>EJK</span>
          </h1>
          <p style={{ color: 'var(--text)', fontSize: '16px', lineHeight: 1.7, margin: 0 }}>
            공공·금융 SI Java 백엔드 5년차 — 요구사항 재정의부터 테이블 설계·배치 운영까지
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', paddingTop: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="mono" style={{ ...linkBtn, color: 'var(--muted)', border: 0, padding: '6px 4px' }}>
            ◉ 재직중
          </span>
          <a className="mono" href={GITHUB} target="_blank" rel="noopener noreferrer" style={linkBtn}>GITHUB ↗</a>
          <button
            type="button"
            className="mono"
            onClick={copyEmail}
            title="누르면 주소를 복사한다"
            style={{ ...linkBtn, background: 'transparent', cursor: 'pointer' }}
          >
            {EMAIL}
          </button>
        </div>
      </div>

      {/* ── 타일: 어디를 누르나 ── */}
      <div style={{
        display: 'grid',
        // 타일 4장. 300px 하한이면 880px 폭에서 2×2, 폰에서 1열. 240px 이면 3+1 로 한 장이 떨어진다
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '12px',
        margin: '28px 0 20px',
      }}>
        {TILES.map(t => (
          <Link key={t.href} href={t.href} style={{
            display: 'block',
            padding: '18px 20px',
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderLeft: `4px solid ${t.color}`,
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'border-color 0.15s, transform 0.15s',
          }}
            // CAREER 로 내려가는 타일은 디돌 행(0번)을 펼치라고 Career 에 알린다. 접혀 있어도 도착하면 열려 있다
            onClick={() => { if (t.href === '/#career') window.dispatchEvent(new CustomEvent('career-open', { detail: 0 })) }}
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
          </Link>
        ))}
      </div>

      {/* ── 스택: 뭘 얼마나 썼나 ── */}
      <StackChips />

      {/* ── 경력: 어디서 ── */}
      <div id="career" className="mono" style={{
        scrollMarginTop: '64px',
        fontSize: '12px',
        color: 'var(--accent)',
        letterSpacing: '4px',
        margin: '36px 0 14px',
      }}>
        CAREER
      </div>
      <Career />

      {/* ── 복사 토스트: 화면 하단 가운데에 잠깐 떴다 사라진다 ── */}
      {copied && (
        <div className="mono" role="status" style={{
          position: 'fixed',
          left: 'calc(var(--sidebar-cur) + (100vw - var(--sidebar-cur)) / 2)',
          bottom: '40px',
          transform: 'translateX(-50%)',
          padding: '10px 18px',
          borderRadius: '8px',
          fontSize: '13px',
          background: 'var(--surface)',
          border: `1px solid ${copied === 'ok' ? 'var(--accent)' : 'var(--accent2)'}`,
          color: copied === 'ok' ? 'var(--accent)' : 'var(--accent2)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          zIndex: 200,
          whiteSpace: 'nowrap',
        }}>
          {copied === 'ok' ? '✓ e-mail 복사됨' : '복사 실패 — ' + EMAIL}
        </div>
      )}
    </div>
  )
}
