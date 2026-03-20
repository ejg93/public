'use client'
import { useState } from 'react'

// ── 타입 ──────────────────────────────────────────────
type DetailItem = {
  id: string
  label: string
  title: string
  content: string
  image?: string
  links?: { label: string; url: string }[]  // ← 이거 추가
}

type QAItem = {
  q: string
  a: string        // (id.레이블) 형태로 클릭 가능한 링크 표시
  details: DetailItem[]
}

// ── 데이터 ─────────────────────────────────────────────
const QA: QAItem[] = [
  {
    q: "업무는 어떻게 하고 있는가?",
    a: "대체로 업무는 인트라넷을 사용하는 폐쇄된 환경에서 이뤄졌기 때문에\n" +
        "최대한 많은 개발도구, 플러그인들을 설치한 뒤 폐쇄망으로 전환하여 업무를 진행한다.\n" +
        "AI 이전에는 구글 검색으로 문서를 뒤져가며 해결방안을 찾아다녔지만\n" +
        "AI 이후에는 기술적인 문제보다는 설계자의 입장에서 해당 기능에 대해 어떤 불편을 겪는지에 초점을 두고\n" +
        "최대한 많은 방안을 생각해본 뒤, 어떤 방안을 선택할지 논의하는 식으로 처리한다.\n" +
        "메모하는 습관이 있어서 업무 중 발견한 이슈나 방법, 아이디어를 기록해두고 활용한다.\n" +
        "(dev-tools)[Ai시대의 공부법](yt:https://www.youtube.com/watch?v=EWAjNmFKmW4) ",
    details: [
      {
        id: "dev-tools",
        label: "주요 개발 도구",
        title: "주요 개발 도구",
          content: "[ IDE / 에디터 ]\n" +
              "IntelliJ IDEA Ultimate\n" +
              "Notepad++\n" +
              "  플러그인: Compare, CSV Lint, Explorer,\n" +
              "  Poor Man's T-SQL Formatter, JS Tool,\n" +
              "  XML Tools, TextFX Characters, SQLinForm\n" +
              "\n" +
              "[ 압축 / 파일 관리 ]\n" +
              "Bandizip\n" +
              "Everything\n" +
              "Q-Dir (폴더 4분할)\n" +
              "WinMerge (파일 비교 분석)\n" +
              "\n" +
              "[ 서버 / 네트워크 ]\n" +
              "FileZilla or WinSCP\n" +
              "CurrPorts (포트 연결 확인)\n" +
              "SnakeTail (로그 모니터링)\n" +
              "\n" +
              "[ DB ]\n" +
              "HeidiSQL\n" +
              "\n" +
              "[ 화면 / 발표 도구 ]\n" +
              "Epic Pen / Gink / ZoomIt (모니터 낙서 및 확대)\n" +
              "\n" +
              "[ 개발 보조 ]\n" +
              "ZZaturi Window Manager\n" +
              "SQL 구문 정리.txt\n" +
              "산출물 양식\n" +
              "개인 서명 파일",
        image: ""
      }
    ]
  },
  {
    q: "AI로 일자리를 위협받는 것에 대해 어떻게 생각하는가?",
    a: "실제로 개발자들의 일자리에 큰 변화가 생겼다는 통계가 있다.\n" +
        "통계를 보면 현 상황에 적응하지 못한 초급 개발자는 하락세,\n" +
        "경력이 높은 개발자들은 오히려 상승세를 타고 있다.\n" +
        "결국 어떻게 적응하느냐가 쟁점이라고 본다.\n" +
        "AI 서비스를 이슈 해결, 학습, 설계 논의 등 목적에 맞게 구분해서 활용하고 있다.\n" +
        "AI는 방대한 데이터를 기반으로 가능한 많은 답을 펼쳐놓는 발산형 도구다.\n" +
        "반면 인간은 현실의 제약과 맥락을 감각하며 그 중 하나로 수렴시킬 수 있다.\n" +
        "인간에게 필요한 것은 펼쳐진 답 중에서 현실에 맞는 선택을 하는 안목이다.\n"+
        "(job-stat)",
    details: [
      {
        id: "job-stat",
        label: "개발자 고용 시장 변화",
        title: "개발자 고용 시장 변화",
        content: "스탠포드 대학 연구 기준 \n22~25세 개발자 고용이 2022~2025년 사이 약 20% 감소.\n반면 시니어 개발자 이상은 같은 기간내 수요 증가.\n\n초급 개발자: 반복적인 구현 작업 → AI로 대체 가능성 높음\n시니어 개발자: 설계·판단·리뷰 역량 → AI가 보조하는 영역",
        image: "/images/job-stat.png",
        links: [
          { label: "전자신문 — AI 코딩 시대, 시니어 개발자의 재발견", url: "https://www.etnews.com/20250515000230" },
          { label: "위시켓 — 2025 프리랜서 개발자 리포트", url: "https://yozm.wishket.com/magazine/detail/3328/" },
        ]
      },
    ]
  },
  {
    q: "평소 업무 외적으로 어떤 활동을 하는가?",
    a: "지속가능한 삶을 유지하고 싶어 규칙적으로 생활하고 있다.\n" +
       "운동, 식습관, 수면 등 검증된 방법을 찾아 적용하며 유지 중이다.\n" +
       "평소 몰랐던 개념은 따로 메모해서 따로 시간을 내서 공부한다.\n" +
       "이 포트폴리오도 그 연장선이다.\n" +
       "(what-i-doing)",
    details: [
      {
        id: "what-i-doing",
        label: "규칙적인 생활",
        title: "규칙적인 생활",
        content: "[ 아침 ]\n" +
            "하루견과 섭취\n" +
            "멀티비타민 1정 + 오메가3 1정\n" +
            "(Life Extension Two Per Day / Ultra Omega-3D Fish Oil)\n" +
            "\n" +
            "[ 점심 ]\n" +
            "삶은 달걀 2개 + 바나나 2개\n" +
            "식후 짧은 수면\n" +
            "기상 후 믹스커피 한 잔\n" +
            "\n" +
            "[ 운동 ]\n" +
            "주 3~4회,\n" +
            "다리 운동(홈트레이닝, 조깅 약 45분)\n" +
            "팔 운동  (홈트레이닝 3세트 약 1시간)\n" +
            "\n" +
            "[ 취침 전 ]\n" +
            "좌우 고관절 스트레칭\n" +
            "다리 벽에 올리기 10분\n"
      }
    ]
  },
  {
    q: "인생관",
    a: "여기에 본인 답변을 입력하세요.",
    details: []
  },
]

// ── 공통 태그 버튼 스타일 ────────────────────────────────
const tagBtnBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  height: '24px',
  marginLeft: '4px',
  padding: '0 10px',
  borderRadius: '999px',
  fontSize: '11px',
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'IBM Plex Mono, monospace',
  letterSpacing: '1px',
  lineHeight: 1,
  verticalAlign: 'middle',
  transition: 'all 0.15s',
}

// ── 텍스트 파싱 ──────────────────────────────────────────
// 지원 형식:
//   (id)              → 오른쪽 사이드바 (초록 버튼)
//   [label](yt:url)   → 유튜브 버튼 (빨간 로고)
//   [label](url)      → 외부 링크 버튼 (파란 버튼)
function parseAnswer(text: string, details: DetailItem[], onSelect: (d: DetailItem) => void, activeId: string | null) {
  const parts = text.split(/(\([a-z0-9-]+\)|\[.+?\]\((?:yt:)?https?:\/\/.+?\))/g)
  return parts.map((part, i) => {

    // ── 유튜브 링크: [label](yt:url) ──
    const ytMatch = part.match(/^\[(.+?)\]\(yt:(https?:\/\/.+?)\)$/)
    if (ytMatch) {
      return (
        <a
          key={i}
          href={ytMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...tagBtnBase,
            gap: '6px',
            padding: '0 12px 0 8px',
            background: 'rgba(255,0,0,0.12)',
            color: '#ff4444',
            border: '1px solid rgba(255,0,0,0.3)',
            textDecoration: 'none',
          }}
        >
          <svg width="14" height="10" viewBox="0 0 24 17" fill="#ff4444">
            <path d="M23.5 2.5S23.2.6 22.4 0C21.4-.9 20.3-.9 19.8-.8 16.5 0 12 0 12 0S7.5 0 4.2-.8C3.7-.9 2.6-.9 1.6 0 .8.6.5 2.5.5 2.5S.2 4.7.2 6.9v2.1c0 2.2.3 4.4.3 4.4s.3 1.9 1.1 2.5c1 .9 2.4.9 3 1C5.8 17 12 17 12 17s4.5 0 7.8-.8c.5-.1 1.6-.1 2.6-1 .8-.6 1.1-2.5 1.1-2.5s.3-2.2.3-4.4V6.9c0-2.2-.3-4.4-.3-4.4zM9.7 11.5V5l6.3 3.3-6.3 3.2z"/>
          </svg>
          {ytMatch[1]}
        </a>
      )
    }

    // ── 외부 링크: [label](url) ──
    const urlMatch = part.match(/^\[(.+?)\]\((https?:\/\/.+?)\)$/)
    if (urlMatch) {
      return (
        <a
          key={i}
          href={urlMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...tagBtnBase,
            background: 'rgba(77,159,255,0.12)',
            color: 'var(--accent3)',
            border: '1px solid rgba(77,159,255,0.3)',
            textDecoration: 'none',
          }}
        >
          ↗ {urlMatch[1]}
        </a>
      )
    }

    // ── 사이드바: (id) ──
    const match = part.match(/^\(([a-z0-9-]+)\)$/)
    if (match) {
      const detail = details.find(d => d.id === match[1])
      if (detail) {
        const isActive = activeId === detail.id
        return (
          <span
            key={i}
            onClick={() => onSelect(detail)}
            style={{
              ...tagBtnBase,
              background: isActive ? 'var(--accent)' : 'rgba(0,255,136,0.12)',
              color: isActive ? '#000' : 'var(--accent)',
              border: `1px solid ${isActive ? 'var(--accent)' : 'rgba(0,255,136,0.3)'}`,
            }}
          >
            ↗ {detail.label}
          </span>
        )
      }
    }

    return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>
  })
}

// ── QA 아이템 컴포넌트 ────────────────────────────────
function QACard({ item, index, onSelect, activeId }: {
  item: QAItem
  index: number
  onSelect: (d: DetailItem) => void
  activeId: string | null
}) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${open ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: '10px',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      <div onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '18px 22px', cursor: 'pointer',
      }}>
        <span className="mono" style={{ fontSize: '11px', color: 'var(--accent)', letterSpacing: '2px', flexShrink: 0 }}>
          Q.{String(index + 1).padStart(2, '0')}
        </span>
        <span style={{ fontSize: '15px', color: 'var(--text)', fontWeight: 600, flex: 1, lineHeight: 1.5 }}>
          {item.q}
        </span>
        <span className="mono" style={{
          fontSize: '11px', color: 'var(--muted)', flexShrink: 0,
          transition: 'transform 0.2s', display: 'inline-block',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>▼</span>
      </div>

      <div style={{ maxHeight: open ? '1000px' : '0', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
        <div style={{ padding: '0 22px 20px', borderTop: '1px solid var(--border)', paddingTop: '18px' }}>
          <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 2, margin: 0 }}>
            {parseAnswer(item.a, item.details, onSelect, activeId)}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── 오른쪽 사이드 패널 ────────────────────────────────
function SidePanel({ detail, onClose }: { detail: DetailItem | null; onClose: () => void }) {
  const visible = detail !== null

  return (
    <>
      {/* 오버레이 (패널 외부 클릭 시 닫기) */}
      {visible && (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 150 }}
        />
      )}

      {/* 패널 */}
      <div style={{
        position: 'fixed',
        top: 0, right: 0, bottom: 0,
        width: '420px',
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
        zIndex: 200,
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {detail && (
          <>
            {/* 패널 헤더 */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              background: 'var(--surface)',
              zIndex: 1,
            }}>
              <div>
                <div className="mono" style={{ fontSize: '10px', color: 'var(--accent)', letterSpacing: '3px', marginBottom: '4px' }}>DETAIL</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>{detail.title}</div>
              </div>
              <button onClick={onClose} style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--muted)',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '6px 10px',
                lineHeight: 1,
              }}>✕</button>
            </div>

            {/* 이미지 (있을 경우) */}
            {detail.image && (
              <div style={{ padding: '20px 24px 0' }}>
                <img
                  src={detail.image}
                  alt={detail.title}
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    display: 'block',
                  }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            )}

            {/* 본문 */}
            <div style={{ padding: '20px 24px' }}>
              <p style={{
                fontSize: '14px',
                color: 'var(--muted)',
                lineHeight: 2,
                margin: 0,
                whiteSpace: 'pre-wrap',
              }}>
                {detail.content}
              </p>
              {detail.links && detail.links.length > 0 && (
                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="mono" style={{ fontSize: '10px', color: 'var(--accent)', letterSpacing: '3px', marginBottom: '4px' }}>
                      REFERENCES
                    </div>
                    {detail.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 14px',
                          background: 'var(--surface2)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          color: 'var(--accent)',
                          fontSize: '13px',
                          transition: 'border-color 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                      >
                        <span style={{ fontSize: '14px' }}>↗</span>
                        {link.label}
                      </a>
                    ))}
                  </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}

// ── 메인 페이지 ───────────────────────────────────────
export default function About() {
  const [activeDetail, setActiveDetail] = useState<DetailItem | null>(null)

  function handleSelect(d: DetailItem) {
    if (activeDetail?.id === d.id) {
      setActiveDetail(null)
    } else {
      setActiveDetail(d)
    }
  }

  return (
    <div style={{ maxWidth: '780px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '40px' }}>
        <div className="mono" style={{ fontSize: '11px', color: 'var(--accent)', letterSpacing: '4px', marginBottom: '8px' }}>
          EXPERIMENT_00
        </div>
        <h1 className="display" style={{ fontSize: '56px', lineHeight: 1, marginBottom: '12px' }}>
          <span style={{ color: 'var(--text)' }}>ABOUT</span>
          <span style={{ color: 'var(--accent)' }}> ME</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.8 }}>
          개발자 EJG의 생각 · 철학 · 관점<br />
        </p>
      </div>

      {/* Q&A 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {QA.map((item, i) => (
          <QACard
            key={i}
            item={item}
            index={i}
            onSelect={handleSelect}
            activeId={activeDetail?.id ?? null}
          />
        ))}
      </div>

      {/* 오른쪽 사이드 패널 */}
      <SidePanel detail={activeDetail} onClose={() => setActiveDetail(null)} />
    </div>
  )
}
