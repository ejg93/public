import fs from 'fs'
import path from 'path'
import { S, Section } from '@/components/CaseStudy'

type Note = {
  slug: string
  title: string
  desc: string
  tags: string[]
  date: string
}

// 노트 목록의 단일 진실은 public/study 의 HTML 파일 자체다.
// 노트 한 장 추가 = HTML 한 장 + <head> 의 메타 셋(description·keywords·date).
function readNotes(): Note[] {
  const dir = path.join(process.cwd(), 'public/study')
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'))

  const notes = files.map(file => {
    const html = fs.readFileSync(path.join(dir, file), 'utf8')
    const pick = (re: RegExp) => html.match(re)?.[1]?.trim() ?? ''
    const slug = file.replace(/\.html$/, '')
    const desc = pick(/<meta\s+name="description"\s+content="([^"]*)"/)
    if (!desc) throw new Error(`${file} 에 description 메타가 없다`)
    return {
      slug,
      title: pick(/<title>([^<]*)<\/title>/) || slug,
      desc,
      tags: pick(/<meta\s+name="keywords"\s+content="([^"]*)"/).split(',').map(t => t.trim()).filter(Boolean),
      date: pick(/<meta\s+name="date"\s+content="([^"]*)"/),
    }
  })

  return notes.sort((a, b) => b.date.localeCompare(a.date))
}

export default function Study() {
  const notes = readNotes()

  return (
    <div style={{ paddingTop: '20px', maxWidth: '860px' }}>

      {/* ── 헤더 ───────────────────────────────────── */}
      <div className="mono" style={{ fontSize: '11px', color: 'var(--accent)', letterSpacing: '4px', marginBottom: '14px' }}>
        NOTES
      </div>

      <h1 className="display" style={{ fontSize: '64px', lineHeight: 0.95, marginBottom: '24px' }}>
        <span style={{ color: 'var(--text)' }}>STUDY</span><br />
        <span style={{ color: 'var(--accent)' }}>NOTES</span>
      </h1>

      <p style={{ ...S.body, fontSize: '15px', marginBottom: '56px' }}>
        강의와 프로젝트에서 배운 것을 주제별로 끊어 적은 노트.<br />
        목록은 노트 HTML 의 메타에서 빌드 때 만든다.
      </p>

      <Section label={`노트 ${notes.length}장 · 최신순`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notes.map(n => (
            <a key={n.slug} href={`/study/${n.slug}`} style={{ ...S.card, display: 'block', textDecoration: 'none' }}>
              <div className="mono" style={{ fontSize: '10px', color: 'var(--accent3)', letterSpacing: '1px', marginBottom: '8px' }}>
                {n.date}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px' }}>{n.title}</div>
              <p style={{ ...S.body, fontSize: '13px', margin: '0 0 12px' }}>{n.desc}</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {n.tags.map(t => (
                  <span key={t} className="mono" style={{
                    fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px',
                    border: '1px solid var(--border)', borderRadius: '4px', padding: '3px 8px',
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </Section>
    </div>
  )
}
