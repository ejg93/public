'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

type Role = 'user' | 'assistant'
type Message = { role: Role; content: string }
type PanelMsg = { from: 'ai1' | 'ai2' | 'human'; text: string; tokens?: number; groupId?: number }

const SPRING = process.env.NEXT_PUBLIC_SPRING_URL || 'http://localhost:8080'
const AI1_COLOR = '#00ff88'
const AI2_COLOR = '#ff6b35'

function saveHistory(log: PanelMsg[]) {
  try { localStorage.setItem('battle_history', JSON.stringify(log)) } catch {}
}
function loadHistory(): PanelMsg[] {
  try {
    const s = localStorage.getItem('battle_history')
    return s ? JSON.parse(s) : []
  } catch { return [] }
}

function HumanLogItem({ m, onHover, onLeave, onClick }: {
  m: PanelMsg
  onHover: (groupId: number) => void
  onLeave: () => void
  onClick: (groupId: number) => void
}) {
  const isLong = m.text.length > 60
  const [expanded, setExpanded] = useState(false)
  const displayText = isLong && !expanded ? m.text.slice(0, 60) + '...' : m.text

  return (
    <div
      className="fade-in"
      style={{ marginBottom: '8px', cursor: 'pointer' }}
      onMouseEnter={() => m.groupId !== undefined && onHover(m.groupId)}
      onMouseLeave={onLeave}
      onClick={() => m.groupId !== undefined && onClick(m.groupId)}
    >
      <div className="mono" style={{ fontSize: '9px', color: 'var(--accent3)', marginBottom: '2px', letterSpacing: '1px' }}>YOU ↗</div>
      <div style={{
        fontSize: '12px',
        color: 'var(--text)',
        lineHeight: 1.6,
        padding: '8px 10px',
        background: 'var(--surface2)',
        borderRadius: '6px',
        borderLeft: '2px solid var(--accent3)',
        transition: 'background 0.15s',
      }}>
        {displayText}
        {isLong && (
          <div
            onClick={e => { e.stopPropagation(); setExpanded(!expanded) }}
            style={{ marginTop: '4px', fontSize: '11px', color: 'var(--accent3)', cursor: 'pointer', fontWeight: 700 }}
          >
            {expanded ? '▲ 접기' : '▼ 더보기'}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AIBattle() {
  const [log, setLog] = useState<PanelMsg[]>([])
  const [highlightGroupId, setHighlightGroupId] = useState<number | null>(null)
  const [darkMode, setDarkMode] = useState(true)

  const ai1History = useRef<Message[]>([])
  const ai2History = useRef<Message[]>([])

  const [humanInput, setHumanInput] = useState('')
  const [ai1Input, setAi1Input] = useState('')
  const [ai2Input, setAi2Input] = useState('')

  const [ai1Busy, setAi1Busy] = useState(false)
  const [ai2Busy, setAi2Busy] = useState(false)

  const [canSend1to2, setCanSend1to2] = useState(false)
  const [canSend2to1, setCanSend2to1] = useState(false)

  const lastAi1Reply = useRef('')
  const lastAi2Reply = useRef('')
  const groupCounter = useRef(0)

  const logEndRef = useRef<HTMLDivElement>(null)

  // AI 답변 ref 맵 (groupId → {ai1: el, ai2: el})
  const ai1Refs = useRef<Map<number, HTMLDivElement>>(new Map())
  const ai2Refs = useRef<Map<number, HTMLDivElement>>(new Map())
  const ai1ScrollRef = useRef<HTMLDivElement>(null)
  const ai2ScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setLog(loadHistory()) }, [])
  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [log])

  // 다크/라이트 모드 전환
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.style.setProperty('--bg', '#080c10')
      root.style.setProperty('--surface', '#0d1117')
      root.style.setProperty('--surface2', '#161b22')
      root.style.setProperty('--border', '#21262d')
      root.style.setProperty('--text', '#e6edf3')
      root.style.setProperty('--muted', '#8b949e')
    } else {
      root.style.setProperty('--bg', '#f4f6f8')
      root.style.setProperty('--surface', '#ffffff')
      root.style.setProperty('--surface2', '#eef1f4')
      root.style.setProperty('--border', '#d0d7de')
      root.style.setProperty('--text', '#1a1f2e')
      root.style.setProperty('--muted', '#6e7781')
    }
  }, [darkMode])

  // 클릭 시 해당 groupId 답변으로 스크롤
  const scrollToGroup = useCallback((gid: number) => {
    setHighlightGroupId(gid)
    const el1 = ai1Refs.current.get(gid)
    const el2 = ai2Refs.current.get(gid)
    if (el1 && ai1ScrollRef.current) {
      const container = ai1ScrollRef.current
      const elTop = el1.getBoundingClientRect().top
      const containerTop = container.getBoundingClientRect().top
      container.scrollTo({
        top: container.scrollTop + elTop - containerTop - 20,
        behavior: 'smooth'
      })
    }
    if (el2 && ai2ScrollRef.current) {
      const container = ai2ScrollRef.current
      const elTop = el2.getBoundingClientRect().top
      const containerTop = container.getBoundingClientRect().top
      container.scrollTo({
        top: container.scrollTop + elTop - containerTop - 20,
        behavior: 'smooth'
      })
    }
    setTimeout(() => setHighlightGroupId(null), 3000)
  }, [])

  async function callAI(model: 'opus' | 'sonnet', history: Message[], userMsg: string) {
    const res = await fetch(`${SPRING}/api/battle/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, history, userMsg }),
    })
    if (!res.ok) throw new Error(`서버 오류: ${res.status}`)
    return res.json() as Promise<{ reply: string; tokens: number }>
  }

  async function sendAi1() {
    const msg = ai1Input.trim()
    if (!msg || ai1Busy) return
    setAi1Input(''); setAi1Busy(true); setCanSend1to2(false)
    ai1History.current.push({ role: 'user', content: msg })
    try {
      const { reply, tokens } = await callAI('opus', ai1History.current.slice(-10, -1), msg)
      ai1History.current.push({ role: 'assistant', content: reply })
      lastAi1Reply.current = reply
      setLog(prev => { const next = [...prev, { from: 'ai1' as const, text: reply, tokens }]; saveHistory(next); return next })
      setCanSend1to2(true)
    } catch (e: unknown) {
      setLog(prev => [...prev, { from: 'ai1', text: `[오류] ${e instanceof Error ? e.message : ''}` }])
    } finally { setAi1Busy(false) }
  }

  async function sendAi2() {
    const msg = ai2Input.trim()
    if (!msg || ai2Busy) return
    setAi2Input(''); setAi2Busy(true); setCanSend2to1(false)
    ai2History.current.push({ role: 'user', content: msg })
    try {
      const { reply, tokens } = await callAI('sonnet', ai2History.current.slice(-10, -1), msg)
      ai2History.current.push({ role: 'assistant', content: reply })
      lastAi2Reply.current = reply
      setLog(prev => { const next = [...prev, { from: 'ai2' as const, text: reply, tokens }]; saveHistory(next); return next })
      setCanSend2to1(true)
    } catch (e: unknown) {
      setLog(prev => [...prev, { from: 'ai2', text: `[오류] ${e instanceof Error ? e.message : ''}` }])
    } finally { setAi2Busy(false) }
  }

  function relayAi1ToAi2() {
    if (!canSend1to2 || ai2Busy) return
    setAi2Input(lastAi1Reply.current); setCanSend1to2(false)
  }

  function relayAi2ToAi1() {
    if (!canSend2to1 || ai1Busy) return
    setAi1Input(lastAi2Reply.current); setCanSend2to1(false)
  }

  async function sendHumanToBoth() {
    const msg = humanInput.trim()
    if (!msg || ai1Busy || ai2Busy) return
    setHumanInput('')
    const gid = groupCounter.current++
    setLog(prev => { const next = [...prev, { from: 'human' as const, text: msg, groupId: gid }]; saveHistory(next); return next })
    setAi1Busy(true); setAi2Busy(true); setCanSend1to2(false); setCanSend2to1(false)
    ai1History.current.push({ role: 'user', content: msg })
    ai2History.current.push({ role: 'user', content: msg })
    try {
      const [r1, r2] = await Promise.all([
        callAI('opus', ai1History.current.slice(-10, -1), msg),
        callAI('sonnet', ai2History.current.slice(-10, -1), msg),
      ])
      ai1History.current.push({ role: 'assistant', content: r1.reply })
      ai2History.current.push({ role: 'assistant', content: r2.reply })
      lastAi1Reply.current = r1.reply
      lastAi2Reply.current = r2.reply
      setLog(prev => {
        const next = [
          ...prev,
          { from: 'ai1' as const, text: r1.reply, tokens: r1.tokens, groupId: gid },
          { from: 'ai2' as const, text: r2.reply, tokens: r2.tokens, groupId: gid },
        ]
        saveHistory(next); return next
      })
      setCanSend1to2(true); setCanSend2to1(true)
    } catch (e: unknown) {
      setLog(prev => [...prev, { from: 'human', text: `[오류] ${e instanceof Error ? e.message : ''}` }])
    } finally { setAi1Busy(false); setAi2Busy(false) }
  }

  function clearAll() {
    setLog([]); ai1History.current = []; ai2History.current = []
    lastAi1Reply.current = ''; lastAi2Reply.current = ''
    setCanSend1to2(false); setCanSend2to1(false)
    ai1Refs.current.clear(); ai2Refs.current.clear()
    localStorage.removeItem('battle_history')
  }

  const isHighlighted = (groupId?: number) => highlightGroupId !== null && groupId === highlightGroupId

  const panelBase: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  }

  const btnBase = (color: string, disabled: boolean): React.CSSProperties => ({
    padding: '10px 16px',
    background: disabled ? 'var(--border)' : color,
    color: disabled ? 'var(--muted)' : '#000',
    border: 'none', borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '12px', transition: 'all 0.15s',
    opacity: disabled ? 0.5 : 1,
  })

  const textareaStyle: React.CSSProperties = {
    width: '100%', background: 'var(--surface2)',
    border: '1px solid var(--border)', borderRadius: '6px',
    color: 'var(--text)', fontSize: '13px',
    padding: '10px 12px', resize: 'none', outline: 'none',
    fontFamily: 'Noto Sans KR, sans-serif', lineHeight: 1.6,
  }

  const ai1Messages = log.filter(m => m.from === 'ai1')
  const ai2Messages = log.filter(m => m.from === 'ai2')

  return (
    <>
      <style>{`
        @keyframes blink-border {
          0%, 100% { outline: 2px solid var(--accent); box-shadow: 0 0 10px var(--accent); }
          50% { outline: 2px solid transparent; box-shadow: none; }
        }
        .highlighted { animation: blink-border 0.7s ease infinite; border-radius: 8px; }
      `}</style>

      <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div className="mono" style={{ fontSize: '11px', color: 'var(--accent)', letterSpacing: '4px' }}>EXPERIMENT_01</div>
            <h1 className="display" style={{ fontSize: '48px', lineHeight: 1 }}>
              <span style={{ color: AI1_COLOR }}>AI</span>
              <span style={{ color: 'var(--text)' }}> BATTLE</span>
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* 다크/라이트 토글 */}
            <button onClick={() => setDarkMode(!darkMode)} style={{
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              color: 'var(--muted)',
              cursor: 'pointer',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '12px',
            }}>
              {darkMode ? '☀ LIGHT' : '☾ DARK'}
            </button>
            <button onClick={clearAll} style={{
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              color: 'var(--muted)',
              cursor: 'pointer',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '12px',
            }}>CLEAR ALL</button>
          </div>
        </div>

        {/* 3패널 */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 260px 1fr', gap: '12px', minHeight: 0 }}>

          {/* AI 1 */}
          <div style={panelBase}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(0,255,136,0.04)' }}>
              <div className="mono" style={{ fontSize: '10px', color: AI1_COLOR, letterSpacing: '3px' }}>AI_01 / CLAUDE OPUS</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>논리 · 분석형</div>
            </div>
            <div ref={ai1ScrollRef} style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ai1Messages.map((m, i) => (
                <div
                  key={i}
                  ref={el => { if (el && m.groupId !== undefined) ai1Refs.current.set(m.groupId, el) }}
                  className={`fade-in${isHighlighted(m.groupId) ? ' highlighted' : ''}`}
                  style={{
                    padding: '10px 12px',
                    background: 'var(--surface2)',
                    borderLeft: `2px solid ${AI1_COLOR}`,
                    borderRadius: '0 6px 6px 0',
                    fontSize: '13px', lineHeight: 1.7,
                    transition: 'all 0.2s',
                  }}>
                  {m.text}
                  {m.tokens && (
                    <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '6px' }}>{m.tokens} tokens</div>
                  )}
                </div>
              ))}
              {ai1Busy && <div className="mono typing-cursor" style={{ fontSize: '12px', color: AI1_COLOR, padding: '8px' }}>생각 중</div>}
              <div ref={logEndRef} />
            </div>
            <div style={{ padding: '12px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <textarea rows={3} value={ai1Input} onChange={e => setAi1Input(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAi1() } }}
                placeholder="AI1에게 보낼 메시지..." style={textareaStyle} />
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={sendAi1} disabled={ai1Busy || !ai1Input.trim()}
                  style={{ ...btnBase(AI1_COLOR, ai1Busy || !ai1Input.trim()), flex: 1 }}>
                  {ai1Busy ? '응답 중...' : 'SEND →'}
                </button>
                <button onClick={relayAi1ToAi2} disabled={!canSend1to2 || ai2Busy}
                  style={btnBase(AI2_COLOR, !canSend1to2 || ai2Busy)}>→AI2</button>
              </div>
            </div>
          </div>

          {/* 인간 패널 */}
          <div style={panelBase}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
              <div className="mono" style={{ fontSize: '10px', color: 'var(--accent3)', letterSpacing: '3px' }}>HUMAN</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>진행자</div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
              {log.filter(m => m.from === 'human').map((m, i) => (
                <HumanLogItem
                  key={i} m={m}
                  onHover={gid => setHighlightGroupId(gid)}
                  onLeave={() => setHighlightGroupId(null)}
                  onClick={scrollToGroup}
                />
              ))}
            </div>
            <div style={{ padding: '12px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <textarea rows={4} value={humanInput} onChange={e => setHumanInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendHumanToBoth() } }}
                placeholder="양쪽 AI에게 동시에 보내기..." style={textareaStyle} />
              <button onClick={sendHumanToBoth} disabled={ai1Busy || ai2Busy || !humanInput.trim()}
                style={{ ...btnBase('var(--accent3)', ai1Busy || ai2Busy || !humanInput.trim()), width: '100%', padding: '12px' }}>
                ← 양측 전송 →
              </button>
            </div>
          </div>

          {/* AI 2 */}
          <div style={panelBase}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(255,107,53,0.04)', textAlign: 'right' }}>
              <div className="mono" style={{ fontSize: '10px', color: AI2_COLOR, letterSpacing: '3px' }}>AI_02 / CLAUDE SONNET</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>창의 · 감성형</div>
            </div>
            <div ref={ai2ScrollRef} style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ai2Messages.map((m, i) => (
                <div
                  key={i}
                  ref={el => { if (el && m.groupId !== undefined) ai2Refs.current.set(m.groupId, el) }}
                  className={`fade-in${isHighlighted(m.groupId) ? ' highlighted' : ''}`}
                  style={{
                    padding: '10px 12px',
                    background: 'var(--surface2)',
                    borderRight: `2px solid ${AI2_COLOR}`,
                    borderRadius: '6px 0 0 6px',
                    fontSize: '13px', lineHeight: 1.7,
                    textAlign: 'right', transition: 'all 0.2s',
                  }}>
                  {m.text}
                  {m.tokens && (
                    <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '6px' }}>{m.tokens} tokens</div>
                  )}
                </div>
              ))}
              {ai2Busy && <div className="mono typing-cursor" style={{ fontSize: '12px', color: AI2_COLOR, padding: '8px', textAlign: 'right' }}>생각 중</div>}
            </div>
            <div style={{ padding: '12px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <textarea rows={3} value={ai2Input} onChange={e => setAi2Input(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAi2() } }}
                placeholder="AI2에게 보낼 메시지..." style={{ ...textareaStyle, textAlign: 'right' }} />
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={relayAi2ToAi1} disabled={!canSend2to1 || ai1Busy}
                  style={btnBase(AI1_COLOR, !canSend2to1 || ai1Busy)}>AI1←</button>
                <button onClick={sendAi2} disabled={ai2Busy || !ai2Input.trim()}
                  style={{ ...btnBase(AI2_COLOR, ai2Busy || !ai2Input.trim()), flex: 1 }}>
                  {ai2Busy ? '응답 중...' : '← SEND'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
