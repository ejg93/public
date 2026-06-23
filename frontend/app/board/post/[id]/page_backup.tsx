'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { POSTS } from '../../posts'
import { BadButtonsDemo, GoodButtonsDemo, KakaoDarkPatternDemo, KakaoEmojiDemo, ButtonFeedbackDemo, CapsLockDemo, InstallCheckboxDemo, KioskDemo } from '../../demos'

const DEMOS: Record<string, React.ReactNode> = {
  'bad-buttons':         <BadButtonsDemo />,
  'good-buttons':        <GoodButtonsDemo />,
  'kakao-dark-pattern':  <KakaoDarkPatternDemo />,
  'kakao-emoji':         <KakaoEmojiDemo />,
  'button-feedback':     <ButtonFeedbackDemo />,
  'capslock-demo':       <CapsLockDemo />,
  'install-checkbox':    <InstallCheckboxDemo />,
  'kiosk-demo':          <KioskDemo />,
}

const CATEGORY_COLOR: Record<string, string> = {
  'UI/UX': 'var(--accent)',
  '개발': 'var(--accent3)',
  '게임': 'var(--accent2)',
}

export default function PostPage() {
  const { id } = useParams()
  const post = POSTS.find(p => p.id === id)

  if (!post) return (
    <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--muted)' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>404</div>
      <div>게시물을 찾을 수 없어요.</div>
      <Link href="/board" style={{ color: 'var(--accent)', marginTop: '16px', display: 'inline-block' }}>← 목록으로</Link>
    </div>
  )

  const color = CATEGORY_COLOR[post.category] || 'var(--accent)'

  return (
    <div style={{ maxWidth: '720px' }}>
      {/* 뒤로가기 */}
      <Link href="/board" style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        color: 'var(--muted)', textDecoration: 'none', fontSize: '13px',
        fontFamily: 'IBM Plex Mono, monospace', marginBottom: '32px',
        transition: 'color 0.15s',
      }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
      >
        ← 목록으로
      </Link>

      {/* 헤더 */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{
            padding: '3px 10px', borderRadius: '999px', fontSize: '11px',
            fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace',
            background: `${color}22`, color, border: `1px solid ${color}44`,
          }}>
            {post.category}
          </span>
          <span className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>
            {new Date(post.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text)', lineHeight: 1.3, marginBottom: '16px' }}>
          {post.title}
        </h1>

        <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '20px' }}>
          {post.summary}
        </p>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {post.tags.map(tag => (
            <span key={tag} style={{
              padding: '2px 8px', borderRadius: '4px', fontSize: '11px',
              background: 'var(--surface2)', color: 'var(--muted)',
              fontFamily: 'IBM Plex Mono, monospace',
            }}>#{tag}</span>
          ))}
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border)', marginBottom: '40px' }} />

      {/* 본문 블록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {post.blocks.map((block, i) => {
          if (block.type === 'text') {
            const parseLine = (line: string, lineKey: number) => {
              const parts = line.split(/(\*\*.*?\*\*|\[.+?\]\((?:yt:)?https?:\/\/.+?\))/g)
              return (
                <p key={lineKey} style={{ margin: '0 0 8px 0' }}>
                  {parts.map((p, k) => {
                    if (p.startsWith('**') && p.endsWith('**')) {
                      return <strong key={k} style={{ color: 'var(--text)', fontWeight: 700 }}>{p.slice(2, -2)}</strong>
                    }
                    const ytMatch = p.match(/^\[(.+?)\]\(yt:(https?:\/\/.+?)\)$/)
                    if (ytMatch) {
                      return (
                        <a key={k} href={ytMatch[2]} target="_blank" rel="noopener noreferrer" style={{
                          display: 'inline-flex', alignItems: 'center', height: '24px',
                          marginLeft: '4px', padding: '0 12px 0 8px', borderRadius: '999px',
                          fontSize: '11px', fontWeight: 700, gap: '6px',
                          fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '1px',
                          background: 'rgba(255,0,0,0.12)', color: '#ff4444',
                          border: '1px solid rgba(255,0,0,0.3)', textDecoration: 'none',
                          verticalAlign: 'middle',
                        }}>
                          <svg width="14" height="10" viewBox="0 0 24 17" fill="#ff4444">
                            <path d="M23.5 2.5S23.2.6 22.4 0C21.4-.9 20.3-.9 19.8-.8 16.5 0 12 0 12 0S7.5 0 4.2-.8C3.7-.9 2.6-.9 1.6 0 .8.6.5 2.5.5 2.5S.2 4.7.2 6.9v2.1c0 2.2.3 4.4.3 4.4s.3 1.9 1.1 2.5c1 .9 2.4.9 3 1C5.8 17 12 17 12 17s4.5 0 7.8-.8c.5-.1 1.6-.1 2.6-1 .8-.6 1.1-2.5 1.1-2.5s.3-2.2.3-4.4V6.9c0-2.2-.3-4.4-.3-4.4zM9.7 11.5V5l6.3 3.3-6.3 3.2z"/>
                          </svg>
                          {ytMatch[1]}
                        </a>
                      )
                    }
                    const urlMatch = p.match(/^\[(.+?)\]\((https?:\/\/.+?)\)$/)
                    if (urlMatch) {
                      return (
                        <a key={k} href={urlMatch[2]} target="_blank" rel="noopener noreferrer" style={{
                          display: 'inline-flex', alignItems: 'center', height: '24px',
                          marginLeft: '4px', padding: '0 10px', borderRadius: '999px',
                          fontSize: '11px', fontWeight: 700,
                          fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '1px',
                          background: 'rgba(77,159,255,0.12)', color: 'var(--accent3)',
                          border: '1px solid rgba(77,159,255,0.3)', textDecoration: 'none',
                          verticalAlign: 'middle',
                        }}>↗ {urlMatch[1]}</a>
                      )
                    }
                    return <span key={k}>{p}</span>
                  })}
                </p>
              )
            }
            return (
              <div key={i} style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 2 }}>
                {block.content.split('\n').map((line, j) => parseLine(line, j))}
              </div>
            )
          }

          if (block.type === 'code') {
            return (
              <div key={i}>
                {block.label && (
                  <div className="mono" style={{ fontSize: '11px', color: color, marginBottom: '8px', letterSpacing: '1px' }}>
                    {block.label}
                  </div>
                )}
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: '10px', overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '8px 16px', borderBottom: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
                    <span className="mono" style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: '8px' }}>{block.lang}</span>
                  </div>
                  <pre style={{
                    padding: '20px', margin: 0, overflowX: 'auto',
                    fontSize: '13px', lineHeight: 1.8,
                    color: 'var(--text)', fontFamily: 'IBM Plex Mono, monospace',
                  }}>
                    {block.code}
                  </pre>
                </div>
              </div>
            )
          }

          if (block.type === 'demo') {
            const demo = DEMOS[block.demoId]
            if (!demo) return null
            return (
              <div key={i}>
                {block.label && (
                  <div className="mono" style={{ fontSize: '11px', color, marginBottom: '10px', letterSpacing: '1px' }}>
                    {block.label}
                  </div>
                )}
                <div style={{
                  background: 'var(--surface)', border: `1px solid ${color}44`,
                  borderRadius: '10px', padding: '24px',
                }}>
                  {demo}
                </div>
              </div>
            )
          }

          if (block.type === 'image') {
            return (
              <div key={i}>
                <img src={block.src} alt={block.caption || ''} style={{
                  width: '100%', borderRadius: '8px',
                  border: '1px solid var(--border)',
                }} />
                {block.caption && (
                  <div className="mono" style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'center', marginTop: '8px' }}>
                    {block.caption}
                  </div>
                )}
              </div>
            )
          }

          if (block.type === 'image_pair') {
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <img src={block.src1} alt={block.caption1 || ''} style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--border)', display: 'block' }} />
                  {block.caption1 && (
                    <div className="mono" style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'center', marginTop: '8px' }}>
                      {block.caption1}
                    </div>
                  )}
                </div>
                <div>
                  <img src={block.src2} alt={block.caption2 || ''} style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--border)', display: 'block' }} />
                  {block.caption2 && (
                    <div className="mono" style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'center', marginTop: '8px' }}>
                      {block.caption2}
                    </div>
                  )}
                </div>
              </div>
            )
          }

          return null
        })}
      </div>

      {/* 하단 */}
      <div style={{ marginTop: '60px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
        <Link href="/board" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: 'var(--muted)', textDecoration: 'none', fontSize: '13px',
          fontFamily: 'IBM Plex Mono, monospace',
        }}>
          ← 목록으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
