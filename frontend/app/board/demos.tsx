'use client'
import { useState, useRef } from 'react'

// ── 나쁜 버튼 데모 ────────────────────────────────────
export function BadButtonsDemo() {
  const [msg, setMsg] = useState('')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ color: 'var(--muted)', fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', marginBottom: '4px' }}>아래 버튼들을 눌러보세요</div>
      <div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>① 배경과 구분 안 되는 버튼</div>
        <button onClick={() => setMsg('찾았군요...')} style={{ padding: '10px 20px', background: 'var(--surface2)', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>제출</button>
      </div>
      <div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>② 뭘 하는지 모르는 버튼</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setMsg('확인을 눌렀습니다')} style={{ padding: '10px 20px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>확인</button>
          <button onClick={() => setMsg('취소를 눌렀습니다')} style={{ padding: '10px 20px', background: 'var(--accent2)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>취소</button>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>→ 확인하면 저장? 취소하면 삭제? 뭘 확인하는 건지 모름</div>
      </div>
      <div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>③ 클릭 영역이 너무 작은 버튼</div>
        <button onClick={() => setMsg('겨우 클릭했군요')} style={{ padding: '2px 6px', background: 'var(--accent3)', color: '#000', border: 'none', borderRadius: '2px', cursor: 'pointer', fontSize: '10px' }}>저장</button>
      </div>
      <div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>④ 삭제 버튼이 더 크고 눈에 띔</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setMsg('저장했습니다')} style={{ padding: '6px 12px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>저장</button>
          <button onClick={() => setMsg('삭제하셨습니다!')} style={{ padding: '12px 28px', background: '#ff4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '15px', fontWeight: 700 }}>전체 삭제</button>
        </div>
      </div>
      {msg && <div style={{ padding: '10px 14px', background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: '6px', fontSize: '13px', color: '#ff6666' }}>→ {msg}</div>}
    </div>
  )
}

// ── 좋은 버튼 데모 ────────────────────────────────────
export function GoodButtonsDemo() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setMsg('저장됐습니다!')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ color: 'var(--muted)', fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', marginBottom: '4px' }}>같은 기능, 다른 버튼</div>
      <div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>① 명확한 색상과 텍스트</div>
        <button onClick={() => setMsg('제출됐습니다')} style={{ padding: '10px 24px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}>양식 제출하기</button>
      </div>
      <div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>② 뭘 하는지 명확한 버튼</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setMsg('변경사항을 저장했습니다')} style={{ padding: '10px 20px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>변경사항 저장</button>
          <button onClick={() => setMsg('취소하고 돌아갑니다')} style={{ padding: '10px 20px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>취소하고 돌아가기</button>
        </div>
      </div>
      <div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>③ 로딩 상태 피드백</div>
        <button onClick={handleSave} disabled={loading} style={{ padding: '10px 24px', background: loading ? 'var(--border)' : 'var(--accent3)', color: loading ? 'var(--muted)' : '#000', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 700, transition: 'all 0.2s', minWidth: '120px' }}>
          {loading ? '저장 중...' : '저장하기'}
        </button>
      </div>
      <div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>④ 위험한 액션은 눈에 안 띄게</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setMsg('저장했습니다')} style={{ padding: '10px 24px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}>저장</button>
          <button onClick={() => setMsg('정말 삭제하시겠습니까? (한 번 더 확인)')} style={{ padding: '8px 14px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>삭제...</button>
        </div>
      </div>
      {msg && <div style={{ padding: '10px 14px', background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '6px', fontSize: '13px', color: 'var(--accent)' }}>→ {msg}</div>}
    </div>
  )
}

// ── 카카오톡 다크패턴 체험 데모 ──────────────────────
export function KakaoDarkPatternDemo() {
  const [phase, setPhase] = useState<'chat' | 'firework' | 'shop'>('chat')
  const [showFirework, setShowFirework] = useState(false)

  type Msg = { id: number; name: string; text: string; time: string; mine: boolean; dateLabel?: string; unread: number; isFirework?: boolean }

  const messages: Msg[] = [
    { id: 1, name: '이민수', text: '언제 볼까요', time: '오후 12:14', mine: false, unread: 1 },
    { id: 2, name: '', text: '전 언제든 되요', time: '오후 12:15', mine: true, unread: 1 },
    { id: 3, name: '이민수', text: '다른 애들은?', time: '오후 12:18', mine: false, unread: 1 },
    { id: 4, name: '최수연', text: '이번주는 안되요', time: '오후 3:44', mine: false, unread: 1 },
    { id: 5, name: '이민수', text: '다다음주?', time: '오후 3:46', mine: false, unread: 1 },
    { id: 6, name: '이민수', text: '답장좀', time: '오후 11:46', mine: false, dateLabel: '2023년 9월 25일 금요일', unread: 2 },
 ]

  function handleFirework() {
    setShowFirework(true)
    setPhase('firework')
    setTimeout(() => {
      setPhase('shop')
      setShowFirework(false)
    }, 1200)
  }

  function reset() {
    setPhase('chat')
    setShowFirework(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={reset} style={{
        position: 'absolute', top: 0, right: 0, zIndex: 10,
        background: 'transparent', border: '1px solid var(--border)',
        borderRadius: '6px', color: 'var(--muted)', cursor: 'pointer',
        fontSize: '11px', padding: '4px 10px',
        fontFamily: 'IBM Plex Mono, monospace',
      }}>↺ 다시 체험</button>

      <div style={{
        maxWidth: '360px', margin: '0 auto',
        background: '#b2c7d9', borderRadius: '16px',
        overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        position: 'relative',
      }}>
        {/* 상단 바 */}
        <div style={{ background: '#9ab5c8', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>←</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>디자인동기방</div>
            <div style={{ fontSize: '11px', color: '#444' }}>5명</div>
          </div>
          <span style={{ fontSize: '16px' }}>🔍</span>
          <span style={{ fontSize: '16px' }}>☰</span>
        </div>

        <div style={{ textAlign: 'center', padding: '10px 0 4px', fontSize: '11px', color: '#555' }}>
          2023년 9월 24일 목요일
        </div>

        {/* 메시지 목록 */}
        <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {messages.map(m => (
            <div key={m.id}>
              {m.dateLabel && (
                <div style={{ textAlign: 'center', padding: '10px 0 6px', fontSize: '11px', color: '#555' }}>
                  {m.dateLabel}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: m.mine ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '6px' }}>
                {!m.mine && (
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#888', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff' }}>
                    {m.name[0]}
                  </div>
                )}
                <div style={{ maxWidth: '65%' }}>
                  {!m.mine && m.name && <div style={{ fontSize: '10px', color: '#444', marginBottom: '2px', marginLeft: '2px' }}>{m.name}</div>}
                  {m.isFirework ? (
                    <div style={{ fontSize: '13px', color: '#555', fontStyle: 'italic', padding: '4px 2px' }}>
                      🎉 채팅방에 폭죽을 쏘았습니다
                    </div>
                  ) : (
                    <div style={{
                      padding: '7px 11px',
                      borderRadius: m.mine ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      background: m.mine ? '#fee500' : '#fff',
                      fontSize: '13px', color: '#1a1a1a',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    }}>
                      {m.text}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: m.mine ? 'flex-end' : 'flex-start', gap: '2px', flexShrink: 0 }}>
                  {m.unread > 0 && <div style={{ fontSize: '10px', color: '#f5c842', fontWeight: 700, lineHeight: 1 }}>{m.unread}</div>}
                  <div style={{ fontSize: '10px', color: '#555' }}>{m.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 폭죽 이펙트 */}
        {showFirework && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '60px', zIndex: 5,
          }}>
            🎉🎊🎉🎊🎉
          </div>
        )}

        {/* 구매 페이지 */}
        {phase === 'shop' && (
          <div style={{ position: 'absolute', inset: 0, background: '#fff', zIndex: 6, display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#fee500', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>←</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>에게 축하 선물하기 🎁</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', padding: '10px 12px', borderBottom: '1px solid #eee' }}>
              {['전체', '1만원 미만', '1-2만원대'].map((t, i) => (
                <span key={i} style={{ padding: '4px 12px', borderRadius: '999px', background: i === 0 ? '#1a1a1a' : '#f0f0f0', color: i === 0 ? '#fff' : '#333', fontSize: '12px', fontWeight: i === 0 ? 700 : 400 }}>{t}</span>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '12px', flex: 1 }}>
              {[
                { name: '스타벅스 아메리카노', price: '6,000원', emoji: '☕' },
                { name: 'CU 편의점 상품권', price: '5,000원', emoji: '🏪' },
                { name: '배달의민족 상품권', price: '10,000원', emoji: '🛵' },
                { name: '올리브영 상품권', price: '10,000원', emoji: '💄' },
              ].map((item, i) => (
                <div key={i} style={{ background: '#f8f8f8', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', marginBottom: '6px' }}>{item.emoji}</div>
                  <div style={{ fontSize: '11px', color: '#333', marginBottom: '4px' }}>{item.name}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>{item.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 하단 입력창 */}
        {phase === 'chat' && (
          <div style={{ background: '#9ab5c8', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>+</span>
            <div style={{ flex: 1, background: '#fff', borderRadius: '20px', padding: '8px 14px', fontSize: '13px', color: '#999' }}>메시지 입력</div>
            <button onClick={handleFirework} style={{
              background: '#fee500', border: 'none', borderRadius: '20px',
              padding: '8px 14px', fontSize: '12px', fontWeight: 700,
              color: '#1a1a1a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap',
            }}>
              🎉 채팅방에 폭죽 쏘기
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--muted)', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace' }}>
        생일인 친구가 있는 채팅방에 뜨는 폭죽 버튼, 원치 않아도 눌리기 쉬운 위치에 있다
      </div>
    </div>
  )
}

// ── 카카오톡 이모티콘 다크패턴 데모 ──────────────────
export function KakaoEmojiDemo() {
  const [showPopup, setShowPopup] = useState(false)

  type EMsg = { id: number; name: string; text: string; time: string; mine: boolean; dateLabel?: string; unread: number; isFirework?: boolean }

  const eMsgs: EMsg[] = [
    { id: 4, name: '최수연', text: '이번주는 안되요', time: '오후 3:44', mine: false, unread: 1 },
    { id: 5, name: '이민수', text: '다다음주?', time: '오후 3:46', mine: false, unread: 1 },
    { id: 6, name: '이민수', text: '답장좀', time: '오후 11:46', mine: false, dateLabel: '2023년 9월 25일 금요일', unread: 2 },
    { id: 7, name: '', text: '', time: '오후 6:17', mine: true, dateLabel: '2026년 3월 21일 토요일', unread: 3, isFirework: true },
  ]

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        maxWidth: '360px', margin: '0 auto',
        background: '#b2c7d9', borderRadius: '16px',
        overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        position: 'relative',
      }}>
        {/* 상단 바 */}
        <div style={{ background: '#9ab5c8', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>←</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>디자인동기방</div>
            <div style={{ fontSize: '11px', color: '#444' }}>5명</div>
          </div>
          <span style={{ fontSize: '16px' }}>🔍</span>
          <span style={{ fontSize: '16px' }}>☰</span>
        </div>

        <div style={{ textAlign: 'center', padding: '10px 0 4px', fontSize: '11px', color: '#555' }}>2023년 9월 24일 목요일</div>
        {/* 대화 */}
        <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {eMsgs.map(m => (
            <div key={m.id}>
              {m.dateLabel && (
                <div style={{ textAlign: 'center', padding: '10px 0 6px', fontSize: '11px', color: '#555' }}>{m.dateLabel}</div>
              )}
              <div style={{ display: 'flex', flexDirection: m.mine ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '6px' }}>
                {!m.mine && <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#888', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff' }}>{m.name[0]}</div>}
                <div style={{ maxWidth: '65%' }}>
                  {!m.mine && m.name && <div style={{ fontSize: '10px', color: '#444', marginBottom: '2px' }}>{m.name}</div>}
                  {m.isFirework ? (
                    <div style={{ fontSize: '13px', color: '#555', fontStyle: 'italic', padding: '4px 2px' }}>🎉 채팅방에 폭죽을 쏘았습니다</div>
                  ) : (
                    <div style={{ padding: '7px 11px', borderRadius: m.mine ? '12px 12px 2px 12px' : '12px 12px 12px 2px', background: m.mine ? '#fee500' : '#fff', fontSize: '13px', color: '#1a1a1a', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>{m.text}</div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: m.mine ? 'flex-end' : 'flex-start', gap: '2px', flexShrink: 0 }}>
                  {m.unread > 0 && <div style={{ fontSize: '10px', color: '#f5c842', fontWeight: 700, lineHeight: 1 }}>{m.unread}</div>}
                  <div style={{ fontSize: '10px', color: '#555' }}>{m.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 입력창 */}
        <div style={{ background: '#9ab5c8', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>+</span>
          <div style={{ flex: 1, background: '#fff', borderRadius: '20px', padding: '8px 14px', fontSize: '13px', color: '#999' }}>메시지 입력</div>
          <button
            onClick={() => setShowPopup(true)}
            style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', padding: '2px' }}
            title="이모티콘"
          >😊</button>
          <span style={{ fontSize: '20px', color: '#555' }}>#</span>
        </div>

        {/* 이모티콘 팝업 */}
        {showPopup && (
          <div style={{
            position: 'absolute', bottom: '60px', left: 0, right: 0,
            background: '#fff', borderTop: '1px solid #ddd',
            zIndex: 10, borderRadius: '12px 12px 0 0',
          }}>
            {/* 탭 */}
            <div style={{ display: 'flex', borderBottom: '1px solid #eee', padding: '0 12px' }}>
              {['☆', '📣', '🐻', '🐰', '🦊', '⊞'].map((icon, i) => (
                <div key={i} style={{ padding: '10px 10px', fontSize: '16px', color: i === 1 ? '#333' : '#aaa', borderBottom: i === 1 ? '2px solid #fee500' : 'none', cursor: 'pointer' }}>{icon}</div>
              ))}
            </div>

            {/* 광고 팝업 */}
            <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', background: '#fffbe6', borderBottom: '1px solid #eee' }}>
              <div style={{ fontSize: '40px' }}>🐷</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginBottom: '6px' }}>무제한 월 3,900원 마지막 기회?</div>
                <button style={{
                  background: '#fee500', border: 'none', borderRadius: '6px',
                  padding: '6px 14px', fontSize: '12px', fontWeight: 700, color: '#1a1a1a', cursor: 'pointer',
                }}>무제한 월 3,900원 →</button>
              </div>
              <button onClick={() => setShowPopup(false)} style={{ background: 'none', border: 'none', fontSize: '16px', color: '#aaa', cursor: 'pointer', alignSelf: 'flex-start' }}>✕</button>
            </div>

            <div style={{ padding: '8px 12px 4px', fontSize: '11px', color: '#cc0000', textAlign: 'center' }}>
              🚨 이모티콘을 누르면 내 이모티콘보다 이게 먼저 나옵니다
            </div>
            <div style={{ height: '60px' }} />
          </div>
        )}
      </div>

      <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--muted)', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace' }}>
        😊 버튼을 눌러보세요
      </div>
    </div>
  )
}

// ── 버튼 피드백 데모 ──────────────────────────────────
export function ButtonFeedbackDemo() {
  const [goodState, setGoodState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [badState, setBadState] = useState<'idle' | 'done'>('idle')

  async function handleGood() {
    setGoodState('loading')
    await new Promise(r => setTimeout(r, 1500))
    setGoodState('done')
    setTimeout(() => setGoodState('idle'), 2200)
  }

  async function handleBad() {
    await new Promise(r => setTimeout(r, 1500))
    setBadState('done')
    setTimeout(() => setBadState('idle'), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes check-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .check-anim { animation: check-fade 0.25s ease forwards; }
      `}</style>

      {/* 나쁜 버튼 */}
      <div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px' }}>
          ① 클릭해도 반응 없음 — 됐는지 안됐는지 모름
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={handleBad}
            style={{
              padding: '10px 24px', borderRadius: '6px',
              background: 'var(--surface2)', color: 'var(--text)',
              border: '1px solid var(--border)', cursor: 'pointer', fontSize: '14px',
            }}
          >
            저장
          </button>
          {badState === 'done' && (
            <div style={{
              padding: '8px 14px', borderRadius: '6px',
              background: 'rgba(0,200,100,0.15)', border: '1px solid rgba(0,200,100,0.3)',
              fontSize: '12px', color: '#00c864',
            }}>
              ✓ 저장되었습니다
            </div>
          )}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '8px', fontFamily: 'IBM Plex Mono, monospace' }}>
          → 눌러도 아무 반응 없다가 갑자기 완료 알림만 뜸
        </div>
      </div>

      {/* 좋은 버튼 */}
      <div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px' }}>
          ② 클릭 즉시 로딩 → 완료 시 체크 애니메이션
        </div>
        <button
          onClick={handleGood}
          disabled={goodState === 'loading'}
          style={{
            padding: '10px 28px', borderRadius: '6px',
            background: goodState === 'done' ? '#00a854' : goodState === 'loading' ? '#2a2a2a' : 'var(--accent)',
            color: goodState === 'loading' ? '#555' : '#000',
            border: 'none',
            cursor: goodState === 'loading' ? 'not-allowed' : 'pointer',
            fontSize: '14px', fontWeight: 700,
            transition: 'background 0.3s ease',
            minWidth: '130px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          {goodState === 'loading' ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin 0.7s linear infinite', fontSize: '16px', lineHeight: 1 }}>⟳</span>
              <span>저장 중...</span>
            </>
          ) : goodState === 'done' ? (
            <span className="check-anim" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              ✓ 저장 완료
            </span>
          ) : (
            '저장'
          )}
        </button>
      </div>

    </div>
  )
}

// ── 입력 UX 데모 ─────────────────────────────────────
export function CapsLockDemo() {
  // 왼쪽: 나쁜 로그인
  const [badId, setBadId] = useState('')
  const [badPw, setBadPw] = useState('')
  const [badPasteBlocked, setBadPasteBlocked] = useState(false)
  const [badSpaceWarning, setBadSpaceWarning] = useState(false)
  const [isComposing, setIsComposing] = useState(false)
  const [badLoginDone, setBadLoginDone] = useState(false)
  const [badSubmitCount, setBadSubmitCount] = useState(0)

  // 오른쪽: 전화번호 + 좋은 버튼
  const [phone2, setPhone2] = useState('1234')
  const [phone3, setPhone3] = useState('')
  const [signupState, setSignupState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [goodFocused, setGoodFocused] = useState<string | null>(null)

  const phone2Ref = useRef<HTMLInputElement>(null)
  const phone3Ref = useRef<HTMLInputElement>(null)

  async function handleBadLogin() {
    const count = isComposing ? 2 : 1
    await new Promise(r => setTimeout(r, 1500))
    setBadSubmitCount(c => c + count)
    setBadLoginDone(true)
    setTimeout(() => setBadLoginDone(false), 2500)
  }

  function handlePhone2Change(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
    setPhone2(val)
    if (val.length === 4) phone3Ref.current?.focus()
  }

  function handlePhone2Focus() {
    setGoodFocused('phone2')
    if (phone2.length === 4) {
      setTimeout(() => phone3Ref.current?.focus(), 50)
    }
  }

  async function handleSignup() {
    if (signupState !== 'idle') return
    setSignupState('loading')
    await new Promise(r => setTimeout(r, 1500))
    setSignupState('done')
    setTimeout(() => setSignupState('idle'), 2200)
  }

  const badInputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 10px', borderRadius: '6px',
    background: 'var(--surface2)', border: '1px solid var(--border)',
    color: 'var(--text)', fontSize: '13px', outline: 'none',
    boxSizing: 'border-box', caretColor: 'transparent',
  }

  const phoneInputStyle = (field: string): React.CSSProperties => ({
    padding: '8px 6px', borderRadius: '6px',
    background: 'var(--surface2)',
    border: `2px solid ${goodFocused === field ? 'var(--accent3)' : 'var(--border)'}`,
    color: 'var(--text)', fontSize: '13px', outline: 'none',
    textAlign: 'center' as const, transition: 'border-color 0.15s',
    boxSizing: 'border-box' as const,
  })

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes check-fade { from { opacity: 0; } to { opacity: 1; } }
        .check-anim { animation: check-fade 0.25s ease forwards; }
      `}</style>

      {/* 왼쪽: 나쁜 로그인 */}
      <div style={{
        flex: 1, minWidth: '240px',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '10px', padding: '18px',
      }}>
        <div style={{ fontSize: '12px', color: '#ff6666', fontFamily: 'IBM Plex Mono, monospace', marginBottom: '14px' }}>
          ✗ 포커스 없음 · 붙여넣기 차단 · 공백 허용
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>아이디</label>
          <input
            value={badId}
            onChange={e => {
              setBadId(e.target.value)
              setBadSpaceWarning(e.target.value.includes(' '))
            }}
            style={badInputStyle}
          />
          {badSpaceWarning && (
            <div style={{ fontSize: '11px', color: '#ff6666', marginTop: '4px' }}>
              ← 공백 포함됐지만 경고 없음
            </div>
          )}
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>비밀번호</label>
          <input
            type="password"
            value={badPw}
            onChange={e => setBadPw(e.target.value)}
            onPaste={e => {
              e.preventDefault()
              setBadPasteBlocked(true)
              setTimeout(() => setBadPasteBlocked(false), 2500)
            }}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            onKeyDown={e => { if (e.key === 'Enter') handleBadLogin() }}
            style={badInputStyle}
          />
          {/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(badPw) && (
            <div style={{ fontSize: '11px', color: '#ff6666', marginTop: '4px' }}>
              ← 한글이 입력됐지만 경고 없음 (로그인 실패 원인)
            </div>
          )}
          {badPasteBlocked && (
            <div style={{ fontSize: '11px', color: '#ff6666', marginTop: '4px' }}>← 붙여넣기 차단됐습니다</div>
          )}
        </div>

        <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '10px', fontFamily: 'IBM Plex Mono, monospace', lineHeight: 1.6 }}>
          * 한글 입력 후 엔터 → 로그인 2회 시도
        </div>

        <button
          onClick={handleBadLogin}
          style={{
            width: '100%', padding: '9px', borderRadius: '6px',
            background: 'var(--surface2)', color: 'var(--text)',
            border: '1px solid var(--border)', fontSize: '13px',
            fontWeight: 700, cursor: 'pointer',
          }}
        >로그인</button>

        {badLoginDone && (
          <div style={{ marginTop: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#ff6666' }}>아이디 또는 비밀번호를 확인하세요</div>
            {badSubmitCount >= 2 && (
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>
                (로그인 {badSubmitCount}회 시도됨)
              </div>
            )}
          </div>
        )}
      </div>

      {/* 오른쪽: 전화번호 자동이동 버그 + 좋은 버튼 피드백 */}
      <div style={{
        flex: 1, minWidth: '240px',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '10px', padding: '18px',
      }}>
        <div style={{ fontSize: '12px', color: '#ff6666', fontFamily: 'IBM Plex Mono, monospace', marginBottom: '14px' }}>
          ✗ 4자리 자동이동 — 이전 칸 수정 불가
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>전화번호</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              value="010"
              readOnly
              style={{ ...phoneInputStyle(''), width: '50px' }}
            />
            <span style={{ color: 'var(--muted)', fontSize: '14px' }}>-</span>
            <input
              ref={phone2Ref}
              value={phone2}
              onChange={handlePhone2Change}
              onFocus={handlePhone2Focus}
              onBlur={() => setGoodFocused(null)}
              maxLength={4}
              style={{ ...phoneInputStyle('phone2'), width: '68px' }}
            />
            <span style={{ color: 'var(--muted)', fontSize: '14px' }}>-</span>
            <input
              ref={phone3Ref}
              value={phone3}
              onChange={e => setPhone3(e.target.value.replace(/\D/g, '').slice(0, 4))}
              onFocus={() => setGoodFocused('phone3')}
              onBlur={() => setGoodFocused(null)}
              maxLength={4}
              style={{ ...phoneInputStyle('phone3'), width: '68px' }}
            />
          </div>
          {phone2.length === 4 && (
            <div style={{ fontSize: '10px', color: '#ff6666', marginTop: '6px', fontFamily: 'IBM Plex Mono, monospace', lineHeight: 1.5 }}>
              ← 가운데 칸 다시 클릭하거나 Shift+Tab 눌러보세요
            </div>
          )}
        </div>

        <div style={{ height: '1px', background: 'var(--border)', marginBottom: '14px' }} />

        <button
          onClick={handleSignup}
          disabled={signupState === 'loading'}
          style={{
            width: '100%', padding: '9px', borderRadius: '6px',
            background: signupState === 'done' ? '#00a854' : signupState === 'loading' ? '#2a2a2a' : 'var(--accent3)',
            color: signupState === 'loading' ? '#555' : '#000',
            border: 'none', fontSize: '13px', fontWeight: 700,
            cursor: signupState === 'loading' ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            minHeight: '36px',
          }}
        >
          {signupState === 'loading' ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin 0.7s linear infinite', fontSize: '16px', lineHeight: 1 }}>⟳</span>
              <span>처리 중...</span>
            </>
          ) : signupState === 'done' ? (
            <span className="check-anim">✓ 가입 완료</span>
          ) : '회원가입'}
        </button>
      </div>

    </div>
  )
}

// ── 설치 프로그램 체크박스 데모 ──────────────────────
export function InstallCheckboxDemo() {
  const [checks, setChecks] = useState({
    terms: false, privacy: false, age: false,
    marketing: false, thirdParty: false, newsletter: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [allClicked, setAllClicked] = useState(false)

  // 설치 프로그램 사전체크
  const [installChecks, setInstallChecks] = useState({
    naver: true,
    vaccine: true,
    toolbar: true,
    homepage: false,
  })
  const [installStep, setInstallStep] = useState<'idle'|'done'>('idle')

  function toggleAll(val: boolean) {
    setAllClicked(val)
    setChecks({ terms: val, privacy: val, age: val, marketing: val, thirdParty: val, newsletter: val })
    setSubmitted(false)
  }

  function toggle(key: keyof typeof checks) {
    const next = { ...checks, [key]: !checks[key] }
    setChecks(next)
    setAllClicked(Object.values(next).every(Boolean))
    setSubmitted(false)
  }

  const required = ['terms', 'privacy', 'age'] as const
  const optional = ['marketing', 'thirdParty', 'newsletter'] as const
  const items = {
    terms:      { label: '[필수] 이용약관 동의' },
    privacy:    { label: '[필수] 개인정보 처리방침 동의' },
    age:        { label: '[필수] 만 14세 이상 확인' },
    marketing:  { label: '[선택] 마케팅 정보 수신 동의' },
    thirdParty: { label: '[선택] 제3자 정보 제공 동의' },
    newsletter: { label: '[선택] 뉴스레터 수신 동의' },
  }
  const canSubmit = required.every(k => checks[k])
  const optionalAllChecked = optional.every(k => checks[k])

  const installItems = [
    { key: 'naver' as const, label: '네이버 앱 설치 (기본 브라우저 변경 포함)', bad: true },
    { key: 'vaccine' as const, label: '△△ 백신 설치 (시작 프로그램 자동 등록)', bad: true },
    { key: 'toolbar' as const, label: '○○ 툴바 설치', bad: true },
    { key: 'homepage' as const, label: '설치 후 홈페이지 변경하지 않기', bad: false },
  ]

  const cbStyle = (checked: boolean, bad: boolean) => ({
    width: '15px', height: '15px', borderRadius: '3px', flexShrink: 0,
    background: checked ? (bad ? '#ff6b35' : '#00c864') : 'transparent',
    border: `2px solid ${checked ? (bad ? '#ff6b35' : '#00c864') : '#555'}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  })

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

      {/* 왼쪽: 전체동의 선택항목 포함 */}
      <div style={{
        flex: 1, minWidth: '240px',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '10px', padding: '18px',
      }}>
        <div style={{ fontSize: '12px', color: '#ff6666', fontFamily: 'IBM Plex Mono, monospace', marginBottom: '14px' }}>
          전체동의 = 선택항목까지 자동 체크
        </div>

        <div style={{
          padding: '10px 12px', borderRadius: '6px',
          background: allClicked ? 'rgba(0,200,100,0.08)' : 'var(--surface2)',
          border: `1px solid ${allClicked ? 'rgba(0,200,100,0.3)' : 'var(--border)'}`,
          marginBottom: '10px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '10px',
        }} onClick={() => toggleAll(!allClicked)}>
          <div style={{
            width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
            background: allClicked ? '#00c864' : 'transparent',
            border: `2px solid ${allClicked ? '#00c864' : '#555'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {allClicked && <span style={{ color: '#000', fontSize: '12px', fontWeight: 700 }}>✓</span>}
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>전체 동의하기</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
          {(Object.keys(items) as Array<keyof typeof items>).map(key => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '4px 2px' }}
              onClick={() => toggle(key)}>
              <div style={{
                width: '16px', height: '16px', borderRadius: '3px', flexShrink: 0,
                background: checks[key] ? '#00c864' : 'transparent',
                border: `2px solid ${checks[key] ? '#00c864' : '#555'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {checks[key] && <span style={{ color: '#000', fontSize: '10px', fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontSize: '12px', color: required.includes(key as any) ? 'var(--text)' : 'var(--muted)' }}>
                {items[key].label}
              </span>
            </div>
          ))}
        </div>

        <button onClick={() => setSubmitted(true)} style={{
          width: '100%', padding: '9px', borderRadius: '6px',
          background: canSubmit ? '#00c864' : '#333', color: canSubmit ? '#000' : '#666',
          border: 'none', fontSize: '13px', fontWeight: 700, cursor: canSubmit ? 'pointer' : 'not-allowed',
        }}>동의하고 가입하기</button>

        {submitted && optionalAllChecked && (
          <div style={{ fontSize: '11px', color: '#ff6666', marginTop: '10px', lineHeight: 1.6, padding: '8px 10px', background: 'rgba(255,68,68,0.08)', borderRadius: '6px', border: '1px solid rgba(255,68,68,0.2)' }}>
            ⚠ 마케팅 수신, 제3자 제공, 뉴스레터까지 전부 동의됐습니다
          </div>
        )}
        {submitted && !optionalAllChecked && (
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '8px', textAlign: 'center' }}>가입 완료</div>
        )}
      </div>

      {/* 오른쪽: 설치 프로그램 사전체크 */}
      <div style={{
        flex: 1, minWidth: '240px',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '10px', padding: '18px',
      }}>
        <div style={{ fontSize: '12px', color: '#ff6666', fontFamily: 'IBM Plex Mono, monospace', marginBottom: '14px' }}>
          설치 프로그램 — 원치 않는 항목 미리 체크
        </div>

        {installStep === 'idle' ? (
          <>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px', lineHeight: 1.6 }}>
              추가 설치 항목을 선택하세요
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {installItems.map(item => (
                <div key={item.key}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', padding: '6px 8px', borderRadius: '6px', background: item.bad && installChecks[item.key] ? 'rgba(255,107,53,0.07)' : 'transparent', transition: 'background 0.15s' }}
                  onClick={() => setInstallChecks(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                >
                  <div style={{ ...cbStyle(installChecks[item.key], item.bad), marginTop: '2px' }}>
                    {installChecks[item.key] && <span style={{ color: '#000', fontSize: '10px', fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: '12px', color: item.bad && installChecks[item.key] ? '#ff6b35' : 'var(--muted)', lineHeight: 1.5 }}>
                    {item.label}
                    {item.bad && installChecks[item.key] && <span style={{ marginLeft: '4px', fontSize: '10px' }}>⚠</span>}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '10px', color: '#ff6666', marginBottom: '12px', lineHeight: 1.6, fontFamily: 'IBM Plex Mono, monospace' }}>
              * 주황색 항목은 기본 체크된 상태로 표시됩니다
            </div>

            <button onClick={() => setInstallStep('done')} style={{
              width: '100%', padding: '9px', borderRadius: '6px',
              background: 'var(--accent3)', color: '#000', border: 'none',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            }}>다음 →</button>
          </>
        ) : (
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 700, marginBottom: '12px' }}>설치 완료</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
              {installItems.filter(i => installChecks[i.key]).map(item => (
                <div key={item.key} style={{ fontSize: '12px', color: item.bad ? '#ff6b35' : 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{item.bad ? '⚠' : '✓'}</span> {item.label}
                </div>
              ))}
            </div>
            {installItems.some(i => i.bad && installChecks[i.key]) && (
              <div style={{ fontSize: '11px', color: '#ff6666', padding: '8px 10px', background: 'rgba(255,68,68,0.08)', borderRadius: '6px', border: '1px solid rgba(255,68,68,0.2)', lineHeight: 1.6 }}>
                ⚠ 체크 해제하지 않으면 원치 않는 프로그램이 함께 설치됩니다
              </div>
            )}
            <button onClick={() => setInstallStep('idle')} style={{
              marginTop: '12px', width: '100%', padding: '7px', borderRadius: '6px',
              background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)',
              fontSize: '12px', cursor: 'pointer',
            }}>↺ 다시 체험</button>
          </div>
        )}
      </div>

    </div>
  )
}

// ── 모바일 게임 UI 데모 ──────────────────────────────
export function MobileGameUIDemo() {
  const [showShop, setShowShop] = useState(false)
  const [showEvent, setShowEvent] = useState(true)
  const [timeLeft, setTimeLeft] = useState(86397) // 23:59:57

  return (
    <div style={{ position: 'relative', maxWidth: '360px', margin: '0 auto' }}>
      {/* 게임 메인화면 */}
      <div style={{
        background: 'linear-gradient(160deg, #1a1a3e 0%, #0d0d2b 100%)',
        borderRadius: '12px', overflow: 'hidden',
        border: '1px solid #333', position: 'relative',
        minHeight: '420px',
      }}>
        {/* 상단 리소스 바 */}
        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '8px 10px', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '3px 8px' }}>
            <span style={{ fontSize: '12px' }}>💎</span>
            <span style={{ fontSize: '11px', color: '#fff', fontFamily: 'IBM Plex Mono, monospace' }}>3,300</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '3px 8px' }}>
            <span style={{ fontSize: '12px' }}>❤️</span>
            <span style={{ fontSize: '11px', color: '#fff', fontFamily: 'IBM Plex Mono, monospace' }}>317</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '3px 8px' }}>
            <span style={{ fontSize: '12px' }}>⚡</span>
            <span style={{ fontSize: '11px', color: '#fff', fontFamily: 'IBM Plex Mono, monospace' }}>1,122</span>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '16px', cursor: 'pointer' }} onClick={() => setShowShop(true)}>🛒</div>
        </div>

        {/* 중앙 캐릭터 영역 */}
        <div style={{ padding: '16px', textAlign: 'center', minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '60px' }}>🧙‍♀️</div>
        </div>

        {/* 이벤트 배너 */}
        {showEvent && (
          <div style={{
            margin: '0 10px 8px',
            background: 'linear-gradient(90deg, #ff6b35, #ff4488)',
            borderRadius: '8px', padding: '8px 12px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#fff', fontWeight: 700 }}>🔥 한정 이벤트</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>
                종료까지: {String(Math.floor(timeLeft/3600)).padStart(2,'0')}:{String(Math.floor((timeLeft%3600)/60)).padStart(2,'0')}:{String(timeLeft%60).padStart(2,'0')}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button onClick={() => setShowShop(true)} style={{
                background: '#fee500', border: 'none', borderRadius: '6px',
                padding: '4px 10px', fontSize: '11px', fontWeight: 700, color: '#000', cursor: 'pointer',
              }}>구매하기</button>
              <button onClick={() => setShowEvent(false)} style={{
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '14px',
              }}>✕</button>
            </div>
          </div>
        )}

        {/* 하단 메뉴 */}
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '8px 6px', background: 'rgba(0,0,0,0.4)', flexWrap: 'wrap', gap: '4px' }}>
          {[
            { icon: '🏠', label: '본부' },
            { icon: '📖', label: '스토리' },
            { icon: '⚔️', label: '전투', highlight: true },
            { icon: '🏆', label: '업적' },
            { icon: '👤', label: '캐릭터' },
          ].map((m, i) => (
            <div key={i} onClick={() => m.label === '본부' && setShowShop(true)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
              padding: '6px 10px', borderRadius: '8px', cursor: 'pointer',
              background: m.highlight ? 'rgba(255,200,0,0.15)' : 'transparent',
              border: m.highlight ? '1px solid rgba(255,200,0,0.3)' : '1px solid transparent',
              minWidth: '52px',
            }}>
              <span style={{ fontSize: '20px' }}>{m.icon}</span>
              <span style={{ fontSize: '10px', color: m.highlight ? '#ffd700' : '#aaa' }}>{m.label}</span>
            </div>
          ))}
        </div>

        {/* 상점 팝업 */}
        {showShop && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10,
          }}>
            <div style={{
              background: '#1a1a3e', borderRadius: '12px', width: '90%',
              border: '1px solid #444', overflow: 'hidden',
            }}>
              <div style={{ background: 'linear-gradient(90deg, #ff6b35, #ff4488)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>💎 상점</span>
                <button onClick={() => setShowShop(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>✕</button>
              </div>

              {/* 카운트다운 상품 */}
              <div style={{ padding: '10px', background: 'rgba(255,100,0,0.1)', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ fontSize: '28px' }}>🎁</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>신규 복귀 패키지</div>
                  <div style={{ fontSize: '10px', color: '#ff6b35' }}>
                    ⏰ {String(Math.floor(timeLeft/3600)).padStart(2,'0')}:{String(Math.floor((timeLeft%3600)/60)).padStart(2,'0')}:{String(timeLeft%60).padStart(2,'0')} 후 종료
                  </div>
                </div>
                <button style={{ background: '#fee500', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, color: '#000', cursor: 'pointer' }}>
                  ₩9,900
                </button>
              </div>

              {/* 일반 상품들 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '10px' }}>
                {[
                  { icon: '💎', name: '다이아 60개', price: '₩1,200' },
                  { icon: '💎', name: '다이아 330개', price: '₩6,000', best: true },
                  { icon: '⚡', name: '스태미나 회복', price: '💎 30' },
                  { icon: '🎰', name: '뽑기권 10연차', price: '💎 280' },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: item.best ? 'rgba(255,200,0,0.1)' : 'rgba(255,255,255,0.05)',
                    borderRadius: '8px', padding: '10px', textAlign: 'center',
                    border: item.best ? '1px solid rgba(255,200,0,0.3)' : '1px solid #333',
                    cursor: 'pointer', position: 'relative',
                  }}>
                    {item.best && <div style={{ position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', background: '#ffd700', borderRadius: '4px', padding: '1px 6px', fontSize: '9px', fontWeight: 700, color: '#000', whiteSpace: 'nowrap' }}>BEST</div>}
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>{item.icon}</div>
                    <div style={{ fontSize: '10px', color: '#ccc', marginBottom: '4px' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffd700' }}>{item.price}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '8px 12px', background: '#fff3f3', borderTop: '1px solid #ff000033' }}>
                <div style={{ fontSize: '10px', color: '#cc0000', textAlign: 'center' }}>
                  🚨 게임 시작하자마자 상점 팝업이 뜹니다
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--muted)', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace' }}>
        🛒 버튼 또는 본부를 눌러보세요
      </div>
    </div>
  )
}

// ── 키오스크 강제 유도 데모 ──────────────────────────
export function KioskDemo() {
  type Step = 'menu' | 'fries' | 'drink' | 'sauce' | 'done'
  const [step, setStep] = useState<Step>('menu')
  const [order, setOrder] = useState<string[]>([])
  const [refuseCount, setRefuseCount] = useState(0)

  function reset() {
    setStep('menu')
    setOrder([])
    setRefuseCount(0)
  }

  function selectBurger() {
    setOrder(['불고기버거 세트'])
    setStep('fries')
  }

  function accept(item: string, next: Step) {
    setOrder(prev => [...prev, item])
    setStep(next)
  }

  function refuse(next: Step) {
    setRefuseCount(prev => prev + 1)
    setStep(next)
  }

  const popupStyle: React.CSSProperties = {
    position: 'absolute', inset: 0,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 10,
  }

  const popupBoxStyle: React.CSSProperties = {
    background: '#fff', borderRadius: '12px', width: '82%',
    overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  }

  const yesBtn: React.CSSProperties = {
    flex: 1, padding: '14px', border: 'none', cursor: 'pointer',
    fontSize: '15px', fontWeight: 700,
    background: '#e8380d', color: '#fff',
  }

  const noBtn: React.CSSProperties = {
    flex: 1, padding: '14px', border: 'none', cursor: 'pointer',
    fontSize: '13px', fontWeight: 400,
    background: '#eee', color: '#555',
  }

  const menuItems = [
    { emoji: '🍔', name: '불고기버거 세트', price: '7,500원' },
    { emoji: '🍗', name: '치킨버거 세트', price: '8,200원' },
    { emoji: '🌮', name: '더블패티 세트', price: '9,400원' },
  ]

  return (
    <div style={{ maxWidth: '360px', margin: '0 auto', position: 'relative' }}>
      <button onClick={reset} style={{
        position: 'absolute', top: 0, right: 0, zIndex: 20,
        background: 'transparent', border: '1px solid var(--border)',
        borderRadius: '6px', color: 'var(--muted)', cursor: 'pointer',
        fontSize: '11px', padding: '4px 10px',
        fontFamily: 'IBM Plex Mono, monospace',
      }}>↺ 다시 체험</button>

      {/* 키오스크 본체 */}
      <div style={{
        background: '#f5f5f0', borderRadius: '12px', overflow: 'hidden',
        border: '1px solid #ccc', position: 'relative',
        minHeight: '460px', boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      }}>
        {/* 상단 바 */}
        <div style={{ background: '#e8380d', padding: '14px 16px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', letterSpacing: '1px' }}>🍔 BURGER HOUSE</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', marginTop: '2px' }}>주문하실 메뉴를 선택하세요</div>
        </div>

        {/* 메뉴 목록 */}
        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {menuItems.map((item, i) => (
            <div
              key={i}
              onClick={i === 0 ? selectBurger : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                background: '#fff', borderRadius: '10px', padding: '14px',
                border: '2px solid transparent',
                cursor: i === 0 ? 'pointer' : 'default',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                transition: 'border-color 0.15s',
                opacity: i === 0 ? 1 : 0.45,
              }}
              onMouseEnter={e => { if (i === 0) e.currentTarget.style.borderColor = '#e8380d' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent' }}
            >
              <div style={{ fontSize: '32px' }}>{item.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#222' }}>{item.name}</div>
                <div style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>{item.price}</div>
              </div>
              {i === 0 && (
                <div style={{ fontSize: '11px', color: '#e8380d', fontWeight: 700 }}>선택 →</div>
              )}
            </div>
          ))}
        </div>

        {/* 주문 현황 */}
        {step === 'done' && (
          <div style={{ padding: '0 14px 14px' }}>
            <div style={{ background: '#fff8f0', border: '1px solid #ffd0a0', borderRadius: '8px', padding: '12px 14px' }}>
              <div style={{ fontSize: '12px', color: '#e8380d', fontWeight: 700, marginBottom: '6px' }}>주문 내역</div>
              {order.map((item, i) => (
                <div key={i} style={{ fontSize: '13px', color: '#333', lineHeight: 1.8 }}>• {item}</div>
              ))}
            </div>
            <div style={{ marginTop: '10px', fontSize: '11px', color: '#888', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace' }}>
              {refuseCount}번 거절한 뒤 주문이 완료됐습니다
            </div>
          </div>
        )}

        {/* 팝업 — 감자 */}
        {step === 'fries' && (
          <div style={popupStyle}>
            <div style={popupBoxStyle}>
              <div style={{ padding: '20px 18px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>🍟</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#222', marginBottom: '6px' }}>감자튀김을 추가하시겠어요?</div>
                <div style={{ fontSize: '12px', color: '#888' }}>+1,500원</div>
              </div>
              <div style={{ display: 'flex', borderTop: '1px solid #eee' }}>
                <button style={noBtn} onClick={() => refuse('drink')}>괜찮아요</button>
                <button style={yesBtn} onClick={() => accept('감자튀김 추가', 'drink')}>추가할게요</button>
              </div>
            </div>
          </div>
        )}

        {/* 팝업 — 음료 */}
        {step === 'drink' && (
          <div style={popupStyle}>
            <div style={popupBoxStyle}>
              <div style={{ padding: '20px 18px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>🥤</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#222', marginBottom: '6px' }}>음료를 추가하시겠어요?</div>
                <div style={{ fontSize: '12px', color: '#888' }}>+1,000원</div>
              </div>
              <div style={{ display: 'flex', borderTop: '1px solid #eee' }}>
                <button style={noBtn} onClick={() => refuse('sauce')}>괜찮아요</button>
                <button style={yesBtn} onClick={() => accept('음료 추가', 'sauce')}>추가할게요</button>
              </div>
            </div>
          </div>
        )}

        {/* 팝업 — 소스 */}
        {step === 'sauce' && (
          <div style={popupStyle}>
            <div style={popupBoxStyle}>
              <div style={{ padding: '20px 18px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>🥫</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#222', marginBottom: '6px' }}>디핑 소스를 추가하시겠어요?</div>
                <div style={{ fontSize: '12px', color: '#888' }}>+500원</div>
              </div>
              <div style={{ display: 'flex', borderTop: '1px solid #eee' }}>
                <button style={noBtn} onClick={() => refuse('done')}>괜찮아요</button>
                <button style={yesBtn} onClick={() => accept('소스 추가', 'done')}>추가할게요</button>
              </div>
            </div>
          </div>
        )}

        {/* 완료 팝업 */}
        {step === 'done' && (
          <div style={popupStyle}>
            <div style={popupBoxStyle}>
              <div style={{ background: '#e8380d', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>✅</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>주문 완료!</div>
              </div>
              <div style={{ padding: '16px 18px', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: '#555', lineHeight: 1.8 }}>
                  {refuseCount > 0
                    ? <><span style={{ color: '#e8380d', fontWeight: 700 }}>{refuseCount}번</span> 거절한 뒤에야 주문이 완료됐어요.</>
                    : '주문이 완료됐어요.'
                  }
                </div>
                <button onClick={reset} style={{
                  marginTop: '14px', padding: '10px 24px', borderRadius: '8px',
                  background: '#e8380d', color: '#fff', border: 'none',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 700,
                }}>처음으로</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--muted)', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace' }}>
        불고기버거 세트를 눌러보세요
      </div>
    </div>
  )
}
