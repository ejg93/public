'use client'
import React, { useEffect, useRef, useState } from 'react'
import type { Block, Post } from './posts'
import { DEMOS } from './demoMap'

// ── 슬라이드 내부 블록 렌더러 (본문 렌더러의 축약판) ──
function SlideBlock({ block }: { block: Block }) {
  if (block.type === 'text') {
    return (
      <div style={{ fontSize: 'clamp(14px, 1.8vw, 18px)', color: 'var(--muted)', lineHeight: 2 }}>
        {block.content.split('\n').map((line, i) => {
          if (line.trim() === '') return <br key={i} />
          const parts = line.split(/(\*\*.*?\*\*)/g)
          return (
            <p key={i} style={{ margin: '0 0 8px 0' }}>
              {parts.map((p, k) =>
                p.startsWith('**') && p.endsWith('**')
                  ? <strong key={k} style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1.1em' }}>{p.slice(2, -2)}</strong>
                  : <span key={k}>{p}</span>
              )}
            </p>
          )
        })}
      </div>
    )
  }

  if (block.type === 'image') {
    return (
      <div style={{ textAlign: 'center' }}>
        <img src={block.src} alt={block.caption || ''} style={{
          maxWidth: '100%', maxHeight: '52vh', borderRadius: '10px',
          border: '1px solid var(--border)',
        }} />
        {block.caption && (
          <div className="mono" style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '10px' }}>
            {block.caption}
          </div>
        )}
      </div>
    )
  }

  if (block.type === 'image_pair') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {[{ src: block.src1, caption: block.caption1 }, { src: block.src2, caption: block.caption2 }].map((img, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <img src={img.src} alt={img.caption || ''} style={{ width: '100%', maxHeight: '48vh', objectFit: 'contain', borderRadius: '10px', border: '1px solid var(--border)' }} />
            {img.caption && <div className="mono" style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '8px' }}>{img.caption}</div>}
          </div>
        ))}
      </div>
    )
  }

  if (block.type === 'code') {
    return (
      <pre style={{
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px',
        padding: '20px', margin: 0, overflowX: 'auto', textAlign: 'left',
        fontSize: '13px', lineHeight: 1.8, color: 'var(--text)', fontFamily: 'IBM Plex Mono, monospace',
      }}>{block.code}</pre>
    )
  }

  if (block.type === 'demo') {
    const demo = DEMOS[block.demoId]
    if (!demo) return null
    return (
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '10px', padding: '24px', textAlign: 'left',
      }}>{demo}</div>
    )
  }

  return null
}

// ── 전체화면 슬라이드 뷰어 ────────────────────────────
export default function SlideViewer({ post, onClose }: { post: Post; onClose: () => void }) {
  const slides = post.slides || []
  const total = slides.length
  const [idx, setIdx] = useState(0)
  const touchX = useRef<number | null>(null)

  const prev = () => setIdx(i => Math.max(0, i - 1))
  const next = () => setIdx(i => Math.min(total - 1, i + 1))

  // 키보드 조작 + 배경 스크롤 잠금
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total])

  if (total === 0) return null

  const navBtn = (disabled: boolean): React.CSSProperties => ({
    width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
    background: 'var(--surface2)', border: '1px solid var(--border)',
    color: disabled ? 'var(--border)' : 'var(--text)', fontSize: '18px',
    cursor: disabled ? 'default' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'color 0.15s',
  })

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'var(--bg)', display: 'flex', flexDirection: 'column',
      }}
      onTouchStart={e => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (dx > 50) prev()
        if (dx < -50) next()
        touchX.current = null
      }}
    >
      {/* 상단 바 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0,
      }}>
        <div className="mono" style={{ fontSize: '12px', color: 'var(--accent2)', letterSpacing: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          ▶ {post.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <span className="mono" style={{ fontSize: '12px', color: 'var(--muted)' }}>{idx + 1} / {total}</span>
          <button onClick={onClose} aria-label="닫기" style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--surface2)', border: '1px solid var(--border)',
            color: 'var(--text)', fontSize: '14px', cursor: 'pointer',
          }}>✕</button>
        </div>
      </div>

      {/* 슬라이드 트랙 */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div style={{
          display: 'flex', height: '100%',
          transform: `translateX(-${idx * 100}%)`,
          transition: 'transform 0.35s ease',
        }}>
          {slides.map((slide, i) => (
            <div key={i} style={{
              width: '100%', height: '100%', flexShrink: 0,
              overflowY: 'auto', padding: 'clamp(20px, 4vw, 48px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'safe center',
            }}>
              <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {slide.title && (
                  <h2 style={{
                    fontSize: 'clamp(22px, 3.5vw, 40px)', fontWeight: 800,
                    color: 'var(--text)', lineHeight: 1.3, margin: 0,
                    borderLeft: '4px solid var(--accent2)', paddingLeft: '16px',
                  }}>{slide.title}</h2>
                )}
                {slide.blocks.map((block, j) => <SlideBlock key={j} block={block} />)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 컨트롤 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px',
        padding: '14px 20px', borderTop: '1px solid var(--border)', flexShrink: 0,
      }}>
        <button onClick={prev} disabled={idx === 0} aria-label="이전 슬라이드" style={navBtn(idx === 0)}>‹</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`${i + 1}번 슬라이드`} style={{
              width: '10px', height: '10px', borderRadius: '50%', padding: 0,
              border: 'none', cursor: 'pointer',
              background: i === idx ? 'var(--accent2)' : 'var(--border)',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>
        <button onClick={next} disabled={idx === total - 1} aria-label="다음 슬라이드" style={navBtn(idx === total - 1)}>›</button>
      </div>
    </div>
  )
}
