// projectshop·workflow·toolbox 세 케이스 스터디 페이지가 같이 쓰는 카드·섹션 스타일.
// 상호작용이 없어 'use client' 를 붙이지 않는다 — 서버 컴포넌트에서도 그대로 쓴다.

export const S = {
  h2: {
    fontSize: '13px',
    fontWeight: 700 as const,
    letterSpacing: '3px',
    color: 'var(--accent)',
    marginBottom: '20px',
    fontFamily: 'IBM Plex Mono, monospace',
  },
  card: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '20px 22px',
  },
  body: {
    fontSize: '14px',
    lineHeight: 1.85,
    color: 'var(--muted)',
    whiteSpace: 'pre-line' as const,
  },
}

export function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '64px' }}>
      <div className="mono" style={S.h2}>{label}</div>
      {children}
    </section>
  )
}
