'use client'
import { useState } from 'react'

// ── 나쁜 버튼 데모 ────────────────────────────────────
export function BadButtonsDemo() {
  const [msg, setMsg] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ color: 'var(--muted)', fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', marginBottom: '4px' }}>
        아래 버튼들을 눌러보세요
      </div>

      {/* 1. 배경이랑 같은 색 버튼 */}
      <div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>① 배경과 구분 안 되는 버튼</div>
        <button
          onClick={() => setMsg('찾았군요...')}
          style={{
            padding: '10px 20px',
            background: 'var(--surface2)',
            color: 'var(--muted)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          제출
        </button>
      </div>

      {/* 2. 애매한 텍스트 */}
      <div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>② 뭘 하는지 모르는 버튼</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setMsg('확인을 눌렀습니다')} style={{ padding: '10px 20px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>확인</button>
          <button onClick={() => setMsg('취소를 눌렀습니다')} style={{ padding: '10px 20px', background: 'var(--accent2)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>취소</button>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>→ 확인하면 저장? 취소하면 삭제? 뭘 확인하는 건지 모름</div>
      </div>

      {/* 3. 너무 작은 버튼 */}
      <div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>③ 클릭 영역이 너무 작은 버튼</div>
        <button onClick={() => setMsg('겨우 클릭했군요')} style={{ padding: '2px 6px', background: 'var(--accent3)', color: '#000', border: 'none', borderRadius: '2px', cursor: 'pointer', fontSize: '10px' }}>저장</button>
      </div>

      {/* 4. 파괴적 액션이 강조된 버튼 */}
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
      <div style={{ color: 'var(--muted)', fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace', marginBottom: '4px' }}>
        같은 기능, 다른 버튼
      </div>

      {/* 1. 명확한 색상 대비 */}
      <div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>① 명확한 색상과 텍스트</div>
        <button onClick={() => setMsg('제출됐습니다')} style={{ padding: '10px 24px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}>
          양식 제출하기
        </button>
      </div>

      {/* 2. 명확한 액션 텍스트 */}
      <div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>② 뭘 하는지 명확한 버튼</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setMsg('변경사항을 저장했습니다')} style={{ padding: '10px 20px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>변경사항 저장</button>
          <button onClick={() => setMsg('취소하고 돌아갑니다')} style={{ padding: '10px 20px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>취소하고 돌아가기</button>
        </div>
      </div>

      {/* 3. 로딩 상태 */}
      <div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>③ 로딩 상태 피드백</div>
        <button onClick={handleSave} disabled={loading} style={{
          padding: '10px 24px',
          background: loading ? 'var(--border)' : 'var(--accent3)',
          color: loading ? 'var(--muted)' : '#000',
          border: 'none', borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '14px', fontWeight: 700,
          transition: 'all 0.2s',
          minWidth: '120px',
        }}>
          {loading ? '저장 중...' : '저장하기'}
        </button>
      </div>

      {/* 4. 파괴적 액션은 작게, 확인은 크게 */}
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
