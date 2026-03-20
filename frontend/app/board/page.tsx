'use client'
import Link from 'next/link'
import { POSTS } from './posts'

const CATEGORY_COLOR: Record<string, string> = {
  'UI/UX': 'var(--accent)',
  '개발': 'var(--accent3)',
  '게임': 'var(--accent2)',
}

export default function BoardPage() {
  return (
    <div style={{ maxWidth: '780px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '40px' }}>
        <div className="mono" style={{ fontSize: '11px', color: 'var(--accent)', letterSpacing: '4px', marginBottom: '8px' }}>
          EXPERIMENT_01
        </div>
        <h1 className="display" style={{ fontSize: '56px', lineHeight: 1, marginBottom: '12px' }}>
          <span style={{ color: 'var(--text)' }}>DEV</span>
          <span style={{ color: 'var(--accent)' }}> LOG</span>
        </h1>
      </div>

      {/* 게시물 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {POSTS.map(post => {
          const color = CATEGORY_COLOR[post.category] || 'var(--accent)'
          return (
            <Link key={post.id} href={`/board/post/${post.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '24px 28px',
                transition: 'border-color 0.2s, transform 0.2s',
                cursor: 'pointer',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = color
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* 카테고리 + 날짜 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: 'IBM Plex Mono, monospace',
                    background: `${color}22`,
                    color,
                    border: `1px solid ${color}44`,
                  }}>
                    {post.category}
                  </span>
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    {new Date(post.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>

                {/* 제목 */}
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px', lineHeight: 1.4 }}>
                  {post.title}
                </h2>

                {/* 요약 */}
                <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '16px' }}>
                  {post.summary}
                </p>

                {/* 태그 */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {post.tags.map(tag => (
                    <span key={tag} style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      background: 'var(--surface2)',
                      color: 'var(--muted)',
                      fontFamily: 'IBM Plex Mono, monospace',
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
