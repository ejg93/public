'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { POSTS } from '../../posts'
import { BadButtonsDemo, GoodButtonsDemo } from '../../demos'

const DEMOS: Record<string, React.ReactNode> = {
  'bad-buttons':  <BadButtonsDemo />,
  'good-buttons': <GoodButtonsDemo />,
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

      {/* 본문 블록 렌더링 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {post.blocks.map((block, i) => {
          if (block.type === 'text') {
            return (
              <div key={i} style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 2, whiteSpace: 'pre-wrap' }}>
                {block.content.split('\n').map((line, j) => {
                  // **bold** 처리
                  const parts = line.split(/(\*\*.*?\*\*)/g)
                  return (
                    <p key={j} style={{ margin: '0 0 8px 0' }}>
                      {parts.map((p, k) =>
                        p.startsWith('**') && p.endsWith('**')
                          ? <strong key={k} style={{ color: 'var(--text)', fontWeight: 700 }}>{p.slice(2, -2)}</strong>
                          : p
                      )}
                    </p>
                  )
                })}
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
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '8px 16px',
                    borderBottom: '1px solid var(--border)',
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
                  background: 'var(--surface)',
                  border: `1px solid ${color}44`,
                  borderRadius: '10px',
                  padding: '24px',
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

          return null
        })}
      </div>

      {/* 하단 네비게이션 */}
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
