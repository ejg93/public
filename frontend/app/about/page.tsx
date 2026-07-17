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
    a: "업무가 대체로 폐쇄망 환경에서 이뤄지기 때문에\n" +
        "인터넷이 되는 동안 필요한 개발도구와 플러그인을 미리 설치해두고 폐쇄망으로 전환합니다.\n" +
        "AI 이전에는 구글 검색으로 문서를 뒤져가며 어떻게 구현할지에 초점을 뒀지만\n" +
        "지금은 어떤 방안을 택할지가 더 중요해졌습니다.\n" +
        "SR이나 이슈가 오면 방안을 여러 개 펼쳐놓고\n" +
        "부작용이 가장 적은 쪽을 골라 논의해서 정합니다.\n" +
        "구현은 공식 API 문서를 근거로 삼아 기본 원칙에서 벗어나지 않게 합니다.\n" +
        "업무 중 발견한 이슈나 아이디어는 그때그때 메모해두고 다시 꺼내 씁니다.\n" +
        "(dev-tools)[개발용 HTML 도구](tool:/toolbox)[Ai시대의 공부법](yt:https://www.youtube.com/watch?v=EWAjNmFKmW4)",
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
    // 구조: 입장 → 통계(상세는 job-stat 버튼) → 발산/수렴 → 내 경험 → 결론
    a: "위협이라기보다 역할이 바뀌었다고 봅니다.\n" +
        "통계로도 초급 개발자 고용은 줄었지만 경력자 수요는 오히려 늘었습니다.\n" +
        "AI는 빅데이터를 기반으로 수많은 답을 펼쳐놓는 발산형 도구입니다.\n" +
        "반면 인간은 현실의 제약과 맥락을 파악해 하나로 수렴시킬 수 있습니다.\n" +
        "저는 AI를 활용해 이슈 처리나 개인적인 개발을 하면서\n" +
        "'버튼을 왜 사용자가 불편해할 위치에 배치하지?'\n" +
        "'이렇게 하면 문서 통일성이 없는데?' 같은 문제를 자주 만났습니다.\n" +
        "AI의 답은 사실이 아니라 가장 그럴듯하다고 추정된 정보에서 나오기 때문에\n" +
        "매번 제가 다시 검증하는 과정이 필요했습니다.\n" +
        "결국 사람이 검증하고 방향을 잡아줘야 하며\n" +
        "그러려면 더 거시적인 안목을 갖춰야 합니다.\n" +
        "(job-stat)",
    details: [
      {
        id: "job-stat",
        label: "고용 시장의 변화",
        title: "개발자 고용 시장 변화",
        content: "스탠포드 대학 연구 기준\n22~25세 개발자 고용이 2022~2025년 사이 약 20% 감소.\n반면 시니어 개발자 이상은 같은 기간 내 수요 증가.\n\n초급 개발자: 반복적인 구현 작업 → AI로 대체 가능성 높음\n시니어 개발자: 설계·판단·리뷰 역량 → AI가 보조하는 영역",
        image: "/images/job-stat.png",
        links: [
          { label: "전자신문 — AI 코딩 시대, 시니어 개발자의 재발견", url: "https://www.etnews.com/20250515000230" },
          { label: "위시켓 — 2025 프리랜서 개발자 리포트", url: "https://yozm.wishket.com/magazine/detail/3328/" },
        ]
      },
    ]
  },
  {
    q: "평소 어떻게 생활하는가?",
    a: "오래 지속할 수 있는 생활을 원해서 규칙적으로 지내고 있습니다.\n" +
       "운동, 식습관, 수면은 검증된 방법을 찾아 적용하고 그대로 유지합니다.\n" +
       "업무 중 모르고 넘어간 부분은 메모하고 검색합니다.\n" +
       "그중 기억해두고 싶은 것은 OneNote에 분류해 쌓아둡니다.\n" +
       "안목은 개발 안에서만 넓어지지 않는다고 생각해\n" +
       "공무원, 학원강사, 제빵사, 전기기사처럼 다른 직종 지인들의 업무 고충을 듣고\n" +
       "어떻게 풀 수 있을지 고민해보기도 합니다.\n" +
       "(daily-routine)",
    details: [
      {
        id: "daily-routine",
        label: "일일 기준 루틴",
        title: "일일 기준 루틴",
        content: "[ 아침 ]\n" +
            "하루견과 섭취\n" +
            "멀티비타민 1정 + 오메가3 1정\n" +
            "\n" +
            "[ 점심 ]\n" +
            "삶은 달걀 2개 + 바나나 2개\n" +
            "식후 짧은 수면\n" +
            "\n" +
            "[ 운동 ]\n" +
            "주 3~4회,\n" +
            "다리 운동(홈트레이닝, 조깅 약 45분)\n" +
            "팔 운동 (홈트레이닝 3세트 약 1시간)\n" +
            "\n" +
            "[ 취침 전 ]\n" +
            "좌우 고관절 스트레칭\n" +
            "다리 벽에 올리기 10분\n"
      }
    ]
  },
  {
    q: "지금까지 가장 기억에 남는 프로젝트는?",
    // 뼈대: 설계 없음 → 레거시 역으로 읽어 설계 복원 → 구체 사례(관리자 메모) → 그 설계로 팀이 굴러감
    a: "최근에 참여한 공공기관 프로젝트가 가장 기억에 남습니다.\n" +
        "요구사항 정의서가 제대로 없어 레거시 코드를 읽어가며 설계를 복원했습니다.\n" +
        "그 과정에서 관리자용 메모가 화면에만 있고 실제로는 저장되지 않는 것을 발견해\n" +
        "테이블과 컬럼을 정의하고 기존 업무 데이터와 FK로 엮는 구조를 제안했습니다.\n" +
        "이렇게 요구사항마다 기존 기능을 파악하고 설계를 다시 잡는 일을 반복했고\n" +
        "발주처도 대부분 그 설계를 기준으로 개발을 진행했습니다.\n" +
        "환경이 좋은 편은 아니었지만 집중해서 기한 내에 완료했습니다.\n" +
        "(problem)",
    details: [
      {
        id: "problem",
        label: "레거시 개선 내역",
        title: "레거시 개선 내역",
        // ★사실 확인 필요★ 아래 3번 "발주처에 요청했으나 제공 불가로 확인, 명세 기준으로
        //   개발 후 연동 시점에 검증" — 원문("없다고 하여 그대로 개발")보다 내가 내용을 더 넣은 것.
        //   실제로 요청했는지 / 연동 시점에 검증했는지 확인해서 사실과 다르면 되돌릴 것.
        //   면접에서 파고들면 바로 드러나는 자리임.
        content:
            "1) 로직 순서가 꼬여 있는 부분\n" +
            "→ 기능 단위로 정리하고, 분리할 부분과\n" +
            "공통화할 부분을 구분하여 모듈 구조를 정립\n\n" +
            "2) 주석·코드에 통일성이 없고 명칭 표기법이 섞여 있음\n" +
            "→ 네이밍 규칙 등을 일관성 있게 정리,\n" +
            "주요 구간을 중심으로 리팩토링 진행\n\n" +
            "3) 개발용 API가 없어 연동 테스트가 불가능한 상태\n" +
            "→ 발주처에 요청했으나 제공 불가로 확인,\n" +
            "명세 기준으로 개발 후 연동 시점에 검증\n\n" +
            "4) impl에 들어갈 코드가 controller에 들어감\n" +
            "→ 역할에 맞게 코드를 적절한 계층으로 이동시키고\n" +
            "controller는 요청/응답 처리만 담당하도록 변경\n\n" +
            "5) 요구사항 정의서에 화면명이 적혀 있지 않음\n" +
            "→ 개발자와 직접 대화하여 요구사항 정리 및 문서화\n"
      }
    ]
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
//   [label](tool:경로) → public/ 정적 도구 링크 (회색 버튼, toolbox 테마색)
//   [label](url)      → 외부 링크 버튼 (파란 버튼)
function parseAnswer(text: string, details: DetailItem[], onSelect: (d: DetailItem) => void, activeId: string | null) {
  const parts = text.split(/(\([a-z0-9-]+\)|\[.+?\]\(tool:[^)]+\)|\[.+?\]\((?:yt:)?https?:\/\/.+?\))/g)
  return parts.map((part, i) => {

    // ── 정적 도구 링크: [label](tool:/toolbox) ──
    const toolMatch = part.match(/^\[(.+?)\]\(tool:([^)]+)\)$/)
    if (toolMatch) {
      return (
        <a
          key={i}
          href={toolMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...tagBtnBase,
            gap: '6px',
            background: 'rgba(212,212,212,0.10)',
            color: '#d4d4d4',
            border: '1px solid #3c3c3c',
            textDecoration: 'none',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#0078d4')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#3c3c3c')}
        >
          🛠 {toolMatch[1]}
        </a>
      )
    }

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
          개발자 EJG의 생각<br />
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
