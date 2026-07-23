'use client'
import { useEffect, useState } from 'react'
import { QA, type DetailItem, type QAItem } from './qa-data'

// ── 공통 태그 버튼 스타일 ────────────────────────────────
const tagBtnBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  height: '24px',
  marginLeft: '4px',
  padding: '0 10px',
  borderRadius: '999px',
  fontSize: '11px',
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'IBM Plex Mono, monospace',
  letterSpacing: '1px',
  lineHeight: 1,
  verticalAlign: 'middle',
  transition: 'all 0.15s',
}

// ── 텍스트 파싱 ──────────────────────────────────────────
// 지원 형식:
//   (id)              → 오른쪽 사이드바 (초록 버튼)
//   [label](yt:url)   → 유튜브 버튼 (빨간 로고)
//   [label](tool:경로) → public/ 정적 도구 링크 (회색 버튼, toolbox 테마색)
//   [label](url)      → 외부 링크 버튼 (파란 버튼)
function parseAnswer(text: string, details: DetailItem[], onSelect: (d: DetailItem) => void, activeId: string | null) {
  const parts = text.split(/(\([a-z0-9-]+\)|\[.+?\]\(tool:[^)]+\)|\[.+?\]\((?:yt:)?https?:\/\/.+?\))/g)
  return parts.map((part, i) => {

    // ── 정적 도구 링크: [label](tool:/toolbox) ──
    const toolMatch = part.match(/^\[(.+?)\]\(tool:([^)]+)\)$/)
    if (toolMatch) {
      return (
        <a
          key={i}
          href={toolMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...tagBtnBase,
            gap: '6px',
            background: 'rgba(212,212,212,0.10)',
            color: '#d4d4d4',
            border: '1px solid #3c3c3c',
            textDecoration: 'none',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#0078d4')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#3c3c3c')}
        >
          🛠 {toolMatch[1]}
        </a>
      )
    }

    // ── 유튜브 링크: [label](yt:url) ──
    const ytMatch = part.match(/^\[(.+?)\]\(yt:(https?:\/\/.+?)\)$/)
    if (ytMatch) {
      return (
        <a
          key={i}
          href={ytMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...tagBtnBase,
            gap: '6px',
            padding: '0 12px 0 8px',
            background: 'rgba(255,0,0,0.12)',
            color: '#ff4444',
            border: '1px solid rgba(255,0,0,0.3)',
            textDecoration: 'none',
          }}
        >
          <svg width="14" height="10" viewBox="0 0 24 17" fill="#ff4444" aria-hidden="true">
            <path d="M23.5 2.5S23.2.6 22.4 0C21.4-.9 20.3-.9 19.8-.8 16.5 0 12 0 12 0S7.5 0 4.2-.8C3.7-.9 2.6-.9 1.6 0 .8.6.5 2.5.5 2.5S.2 4.7.2 6.9v2.1c0 2.2.3 4.4.3 4.4s.3 1.9 1.1 2.5c1 .9 2.4.9 3 1C5.8 17 12 17 12 17s4.5 0 7.8-.8c.5-.1 1.6-.1 2.6-1 .8-.6 1.1-2.5 1.1-2.5s.3-2.2.3-4.4V6.9c0-2.2-.3-4.4-.3-4.4zM9.7 11.5V5l6.3 3.3-6.3 3.2z"/>
          </svg>
          {ytMatch[1]}
        </a>
      )
    }

    // ── 외부 링크: [label](url) ──
    const urlMatch = part.match(/^\[(.+?)\]\((https?:\/\/.+?)\)$/)
    if (urlMatch) {
      return (
        <a
          key={i}
          href={urlMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...tagBtnBase,
            background: 'rgba(77,159,255,0.12)',
            color: 'var(--accent3)',
            border: '1px solid rgba(77,159,255,0.3)',
            textDecoration: 'none',
          }}
        >
          ↗ {urlMatch[1]}
        </a>
      )
    }

    // ── 사이드바: (id) ──
    const match = part.match(/^\(([a-z0-9-]+)\)$/)
    if (match) {
      const detail = details.find(d => d.id === match[1])
      if (detail) {
        const isActive = activeId === detail.id
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(detail)}
            aria-expanded={isActive}
            style={{
              ...tagBtnBase,
              background: isActive ? 'var(--accent)' : 'rgba(0,255,136,0.12)',
              color: isActive ? '#000' : 'var(--accent)',
              border: `1px solid ${isActive ? 'var(--accent)' : 'rgba(0,255,136,0.3)'}`,
            }}
          >
            ↗ {detail.label}
          </button>
        )
      }
    }

    return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>
  })
}

// ── QA 아이템 컴포넌트 ────────────────────────────────
function QACard({ item, index, onSelect, activeId }: {
  item: QAItem
  index: number
  onSelect: (d: DetailItem) => void
  activeId: string | null
}) {
  const [open, setOpen] = useState(false)
  const panelId = `qa-panel-${index}`

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${open ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: '10px',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      {/* 질문 헤더 — 키보드/스크린리더 접근 위해 button (div onClick 금지) */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={panelId}
        style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          width: '100%', padding: '18px 22px', cursor: 'pointer',
          background: 'transparent', border: 'none', textAlign: 'left',
          font: 'inherit', color: 'inherit',
        }}
      >
        <span className="mono" style={{ fontSize: '11px', color: 'var(--accent)', letterSpacing: '2px', flexShrink: 0 }}>
          Q.{String(index + 1).padStart(2, '0')}
        </span>
        <span style={{ fontSize: '15px', color: 'var(--text)', fontWeight: 600, flex: 1, lineHeight: 1.5 }}>
          {item.q}
        </span>
        <span aria-hidden="true" className="mono" style={{
          fontSize: '11px', color: 'var(--muted)', flexShrink: 0,
          transition: 'transform 0.2s', display: 'inline-block',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>▼</span>
      </button>

      {/* 답변 — 0fr↔1fr 로 내용 높이만큼 펼침 (max-height 고정값은 긴 답변에서 잘림) */}
      <div
        id={panelId}
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.35s ease',
        }}
      >
        <div style={{ overflow: 'hidden', minHeight: 0 }}>
          <div style={{ padding: '18px 22px 20px', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 2, margin: 0 }}>
              {parseAnswer(item.a, item.details, onSelect, activeId)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── 오른쪽 사이드 패널 ────────────────────────────────
function SidePanel({ detail, onClose }: { detail: DetailItem | null; onClose: () => void }) {
  const visible = detail !== null

  // ESC 로 닫기
  useEffect(() => {
    if (!visible) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, onClose])

  return (
    <>
      {/* 오버레이 (패널 외부 클릭 시 닫기) */}
      {visible && (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 150 }}
        />
      )}

      {/* 패널 — 모바일에서 화면 밖으로 밀리지 않게 min() 으로 폭 제한 */}
      <div
        role="dialog"
        aria-label={detail ? detail.title : undefined}
        aria-hidden={!visible}
        style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0,
          width: 'min(420px, 100vw)',
          background: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
          zIndex: 200,
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {detail && (
          <>
            {/* 패널 헤더 */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              background: 'var(--surface)',
              zIndex: 1,
            }}>
              <div>
                <div className="mono" style={{ fontSize: '10px', color: 'var(--accent)', letterSpacing: '3px', marginBottom: '4px' }}>DETAIL</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>{detail.title}</div>
              </div>
              <button onClick={onClose} type="button" aria-label="상세 닫기" style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--muted)',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '6px 10px',
                lineHeight: 1,
              }}>✕</button>
            </div>

            {/* 이미지 (있을 경우) */}
            {detail.image && (
              <div style={{ padding: '20px 24px 0' }}>
                <img
                  src={detail.image}
                  alt={detail.title}
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    display: 'block',
                  }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            )}

            {/* 본문 */}
            <div style={{ padding: '20px 24px' }}>
              <p style={{
                fontSize: '14px',
                color: 'var(--muted)',
                lineHeight: 2,
                margin: 0,
                whiteSpace: 'pre-wrap',
              }}>
                {detail.content}
              </p>
              {detail.links && detail.links.length > 0 && (
                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="mono" style={{ fontSize: '10px', color: 'var(--accent)', letterSpacing: '3px', marginBottom: '4px' }}>
                      REFERENCES
                    </div>
                    {detail.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 14px',
                          background: 'var(--surface2)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          color: 'var(--accent)',
                          fontSize: '13px',
                          transition: 'border-color 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                      >
                        <span style={{ fontSize: '14px' }}>↗</span>
                        {link.label}
                      </a>
                    ))}
                  </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}

// ── 메인 페이지 ───────────────────────────────────────
export default function About() {
  const [activeDetail, setActiveDetail] = useState<DetailItem | null>(null)

  function handleSelect(d: DetailItem) {
    if (activeDetail?.id === d.id) {
      setActiveDetail(null)
    } else {
      setActiveDetail(d)
    }
  }

  return (
    <div style={{ maxWidth: '780px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '40px' }}>
        <div className="mono" style={{ fontSize: '11px', color: 'var(--accent)', letterSpacing: '4px', marginBottom: '8px' }}>
          EXPERIMENT_00
        </div>
        <h1 className="display" style={{ fontSize: '56px', lineHeight: 1, marginBottom: '12px' }}>
          <span style={{ color: 'var(--text)' }}>ABOUT</span>
          <span style={{ color: 'var(--accent)' }}> ME</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.8 }}>
          개발자 EJG의 생각
        </p>
      </div>

      {/* Q&A 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {QA.map((item, i) => (
          <QACard
            key={i}
            item={item}
            index={i}
            onSelect={handleSelect}
            activeId={activeDetail?.id ?? null}
          />
        ))}
      </div>

      {/* 오른쪽 사이드 패널 */}
      <SidePanel detail={activeDetail} onClose={() => setActiveDetail(null)} />
    </div>
  )
}
