'use client'
import { useEffect, useRef, useState } from 'react'

// 용어에 점선을 긋고, 마우스를 올리거나(데스크톱) 누르면(모바일) 뜻을 띄운다.
// title 속성을 안 쓴다 — 브라우저 기본 툴팁은 느리게 뜨고 줄바꿈도 못 고른다.
//
// 낱말을 누르면 말풍선이 고정되기만 한다. 복사는 고정된 뒤에 뜨는 버튼이 맡는다.
// 고정과 복사를 한 동작에 묶으면 읽으려고 눌렀을 뿐인데 클립보드가 바뀐다.
export default function GlossaryTerm({ term, desc }: { term: string; desc: string }) {
  const [hover, setHover] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [copied, setCopied] = useState(false)
  const wrap = useRef<HTMLSpanElement>(null)
  const open = hover || pinned

  useEffect(() => {
    if (!pinned) return
    const away = (e: MouseEvent | TouchEvent) => {
      if (!wrap.current?.contains(e.target as Node)) {
        setPinned(false)
        setHover(false)
      }
    }
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPinned(false)
        setHover(false)
      }
    }
    document.addEventListener('mousedown', away)
    document.addEventListener('touchstart', away)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', away)
      document.removeEventListener('touchstart', away)
      document.removeEventListener('keydown', esc)
    }
  }, [pinned])

  // 고정이 풀리면 복사 표시도 처음 상태로 돌린다.
  // 이펙트가 아니라 렌더 중에 고친다 — 이펙트로 돌리면 「복사됨」이 한 프레임 더 남는다
  const [pinnedBefore, setPinnedBefore] = useState(pinned)
  if (pinnedBefore !== pinned) {
    setPinnedBefore(pinned)
    if (!pinned) setCopied(false)
  }

  // 말풍선을 닫는다. hover 도 같이 내린다 — 마우스가 아직 낱말 위에 있으면
  // pinned 만 풀어서는 hover 로 다시 떠 버린다.
  const close = () => {
    setPinned(false)
    setHover(false)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(desc)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 권한이 막히거나 안전하지 않은 연결이면 손으로 고르게 둔다
      setCopied(false)
    }
  }

  return (
    <span
      ref={wrap}
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setPinned(v => !v)}
        style={{
          font: 'inherit', color: 'var(--accent3)', background: 'transparent',
          border: 0, padding: 0, cursor: 'help',
          borderBottom: pinned ? '1px solid var(--accent3)' : '1px dotted var(--accent3)',
        }}
      >
        {term}
      </button>
      {open && (
        <span
          role="tooltip"
          style={{
            position: 'absolute', bottom: 'calc(100% + 8px)', left: 0,
            zIndex: 200, width: 'max-content', maxWidth: 'min(320px, 70vw)',
            padding: '10px 12px', borderRadius: '8px',
            background: 'var(--surface)', border: '1px solid var(--accent3)',
            color: 'var(--text)', fontSize: '13px', lineHeight: 1.6,
            fontWeight: 400, textAlign: 'left', whiteSpace: 'normal',
            userSelect: 'text',
            boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
          }}
        >
          {desc}
          {pinned && (
            <span
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                marginTop: '8px', paddingTop: '8px',
                borderTop: '1px solid var(--border)',
              }}
            >
              <button
                type="button"
                className="mono"
                onClick={copy}
                style={{
                  fontSize: '10px', letterSpacing: '1px', lineHeight: 1,
                  padding: '5px 10px', borderRadius: '4px', cursor: 'pointer',
                  transition: 'all 0.15s',
                  background: copied ? 'var(--accent)' : 'transparent',
                  color: copied ? 'var(--bg)' : 'var(--muted)',
                  border: `1px solid ${copied ? 'var(--accent)' : 'var(--border)'}`,
                  fontWeight: copied ? 700 : 400,
                }}
              >
                {copied ? '✓ 복사됨' : '복사'}
              </button>
              <button
                type="button"
                className="mono"
                onClick={close}
                style={{
                  fontSize: '10px', letterSpacing: '1px', lineHeight: 1,
                  padding: '5px 0', border: 0, background: 'transparent',
                  color: 'var(--muted)', cursor: 'pointer',
                }}
              >
                ESC 또는 클릭으로 닫기
              </button>
            </span>
          )}
        </span>
      )}
    </span>
  )
}
