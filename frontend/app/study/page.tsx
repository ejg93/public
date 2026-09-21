import fs from 'fs'
import path from 'path'
import { S, Section } from '@/components/CaseStudy'
import StudyProgress from '@/components/StudyProgress'

export const metadata = { title: 'STUDY NOTES' }

// 노트 종류. 목록은 이 순서로 묶는다.
const KINDS = ['배움', '결정', '계획'] as const
type Kind = (typeof KINDS)[number]
const KIND_DESC: Record<Kind, string> = {
  배움: '강의·프레임워크·작업 방법을 개념 단위로 끊어 익힌 것',
  결정: '내 프로젝트에서 무엇을 왜 그렇게 정했는지 남긴 것',
  계획: '앞으로 배울 것을 주 단위 닫힘 조건과 함께 잡아 둔 것',
}

// 태그 사전. 노트 head 의 keywords 는 여기서만 고른다 — 노트마다 제각각이면 거를 수 없다.
const TAGS = new Set([
  'Tier / Layer', '트랜잭션', '캐시', 'MSA', 'Oracle',
  'App Router', 'Server / Client', '하이드레이션', '번들',
  '권한', '상태머신', '법 요건',
  '청크', '게이트', 'LLM', 'MCP',
  'SLO', '동시성',
])

type Note = {
  slug: string
  title: string
  desc: string
  kind: Kind
  tags: string[]
  date: string
  total: number
}

// 노트 목록의 단일 진실은 public/study 의 HTML 파일 자체다.
// 노트 한 장 추가 = HTML 한 장 + <head> 의 메타 넷(description·keywords·date·kind).
// 절 수는 본문의 article.doc 개수다. data-overview 가 붙은 단계 개요는 진행률에 안 세므로 뺀다.
function readNotes(): Note[] {
  const dir = path.join(process.cwd(), 'public/study')
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'))

  const notes = files.map(file => {
    const html = fs.readFileSync(path.join(dir, file), 'utf8')
    const pick = (re: RegExp) => html.match(re)?.[1]?.trim() ?? ''
    const slug = file.replace(/\.html$/, '')
    const desc = pick(/<meta\s+name="description"\s+content="([^"]*)"/)
    if (!desc) throw new Error(`${file} 에 description 메타가 없다`)
    const kind = pick(/<meta\s+name="kind"\s+content="([^"]*)"/)
    if (!(KINDS as readonly string[]).includes(kind)) throw new Error(`${file} 의 kind 메타가 ${KINDS.join('·')} 중 하나가 아니다: "${kind}"`)
    const tags = pick(/<meta\s+name="keywords"\s+content="([^"]*)"/).split(',').map(t => t.trim()).filter(Boolean)
    const unknown = tags.filter(t => !TAGS.has(t))
    if (unknown.length) throw new Error(`${file} 의 keywords 에 사전 밖 태그가 있다: ${unknown.join(', ')}`)
    const total = (html.match(/<article class="doc"(?![^>]*data-overview)/g) ?? []).length
    return {
      slug,
      title: pick(/<title>([^<]*)<\/title>/) || slug,
      desc,
      kind: kind as Kind,
      tags,
      date: pick(/<meta\s+name="date"\s+content="([^"]*)"/),
      total,
    }
  })

  return notes.sort((a, b) => b.date.localeCompare(a.date))
}

export default function Study() {
  const notes = readNotes()

  return (
    <div style={{ paddingTop: '20px', maxWidth: '860px' }}>

      {/* ── 헤더 ───────────────────────────────────── */}
      <div className="mono" style={{ fontSize: '11px', color: 'var(--accent)', letterSpacing: '2px', marginBottom: '14px' }}>
        학습 노트
      </div>

      <h1 className="display display-xl" style={{ lineHeight: 0.95, marginBottom: '24px' }}>
        <span style={{ color: 'var(--text)' }}>STUDY</span><br />
        <span style={{ color: 'var(--accent)' }}>NOTES</span>
      </h1>

      <p style={{ ...S.body, fontSize: '13px', margin: '0 0 40px' }}>
        노트 {notes.length}장. 한 장이 대분류 하나고, 안에서 절 단위로 넘기며 읽는다.<br />
        절마다 「학습 완료」를 체크하면 이 브라우저에만 남고, 여기 카드에 진행률로 뜬다.
      </p>

      {KINDS.map(kind => {
        const group = notes.filter(n => n.kind === kind)
        if (!group.length) return null
        return (
          <Section key={kind} label={`${kind} · ${group.length}장`}>
            <p style={{ ...S.body, fontSize: '12px', margin: '-8px 0 14px' }}>{KIND_DESC[kind]}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {group.map(n => (
                <a key={n.slug} href={`/study/${n.slug}`} style={{ ...S.card, display: 'block', textDecoration: 'none' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px' }}>{n.title}</div>
                  <p style={{ ...S.body, fontSize: '13px', margin: '0 0 12px' }}>{n.desc}</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {n.tags.map(t => (
                      <span key={t} className="mono" style={{
                        fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px',
                        border: '1px solid var(--border)', borderRadius: '4px', padding: '3px 8px',
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="mono" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px' }}>
                      {n.total}절 · {n.date}
                    </span>
                    <StudyProgress slug={n.slug} total={n.total} />
                  </div>
                </a>
              ))}
            </div>
          </Section>
        )
      })}
    </div>
  )
}
