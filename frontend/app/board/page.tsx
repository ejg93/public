'use client'
import Link from 'next/link'
import { POSTS } from './posts'
import { useState } from 'react'

const CATEGORY_COLOR: Record<string, string> = {
  'UI/UX': 'var(--accent)',
  '개발': 'var(--accent3)',
  '게임': 'var(--accent2)',
}

export default function BoardPage() {
  const [hovered, setHovered] = useState<string | null>(null)

  // 최신순 정렬
  const sorted = [...POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const total = sorted.length

  return (
    <div style={{ maxWidth: '780px' }}>
      <div style={{ marginBottom: '40px' }}>
        <div className="mono" style={{ fontSize: '11px', color: 'var(--accent)', letterSpacing: '4px', marginBottom: '8px' }}>
          EXPERIMENT_01
        </div>
        <h1 className="display" style={{ fontSize: '56px', lineHeight: 1, marginBottom: '12px' }}>
          <span style={{ color: 'var(--text)' }}>DEV</span>
          <span style={{ color: 'var(--accent)' }}> LOG</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.8 }}>
          UI/UX 설계, 개발 경험, 그리고 생각들.<br />
          <span className="mono" style={{ fontSize: '11px' }}>코드가 포함된 글은 직접 실행해볼 수 있습니다.</span>
        </p>
      </div>

      {/* 헤더 행 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '48px 1fr 80px 110px',
        padding: '8px 16px',
        borderBottom: '1px solid var(--border)',
        borderTop: '1px solid var(--border)',
      }}>
        <span className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>No</span>
        <span className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>제목</span>
        <span className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>분류</span>
        <span className="mono" style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'right' }}>날짜</span>
      </div>

      {/* 게시물 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {sorted.map((post, i) => {
          const color = CATEGORY_COLOR[post.category] || 'var(--accent)'
          const no = total - i
          const isHovered = hovered === post.id

          return (
            <Link key={post.id} href={`/board/post/${post.id}`} style={{ textDecoration: 'none' }}>
              <div
                onMouseEnter={() => setHovered(post.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr 80px 110px',
                  padding: '13px 16px',
                  borderBottom: '1px solid var(--border)',
                  background: isHovered ? 'var(--surface)' : 'transparent',
                  transition: 'background 0.15s',
                  cursor: 'pointer',
                  alignItems: 'center',
                }}
              >
                <span className="mono" style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {String(no).padStart(2, '0')}
                </span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: isHovered ? color : 'var(--text)',
                  transition: 'color 0.15s',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  paddingRight: '16px',
                }}>
                  {post.title}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'IBM Plex Mono, monospace',
                  color,
                }}>
                  {post.category}
                </span>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'right' }}>
                  {new Date(post.date).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' })}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mono" style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '16px', textAlign: 'right' }}>
        총 {total}개
      </div>
    </div>
  )
}
