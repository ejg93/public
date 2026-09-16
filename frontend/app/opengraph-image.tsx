import { ImageResponse } from 'next/og'

// 링크 미리보기 카드(카톡·링크드인·슬랙이 URL 을 붙일 때 그린다).
// 그리는 쪽(Satori)에 한글 글꼴이 없어, 쓸 글자만 Google Fonts 에서 받아 넣는다.
// 받기에 실패하면 한 줄 소개를 영문으로 대신 그린다
export const runtime = 'edge'
export const alt = 'EJK PORTFOLIO — Java backend developer, public & finance SI'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const TAGLINE_KO = '공공·금융 SI Java 백엔드 5년차 — 요구사항 재정의부터 테이블 설계·배치 운영까지'
const TAGLINE_EN = '5 YRS · PUBLIC & FINANCE SI · REQUIREMENTS → SCHEMA → BATCH'

// 그 문장에 든 글자만 담은 Noto Sans KR 조각을 받는다. 오래된 UA 를 보내야 Satori 가 읽는 TTF 로 준다
async function loadKoreanFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@500&text=${encodeURIComponent(text)}`
    const css = await (await fetch(cssUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1' },
    })).text()
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1]
    if (!url) return null
    const res = await fetch(url)
    return res.ok ? res.arrayBuffer() : null
  } catch {
    return null
  }
}

export default async function OpenGraphImage() {
  const koFont = await loadKoreanFont(TAGLINE_KO)
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: '#0d1117',
          color: '#e6edf3',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: 8, color: '#00ff88' }}>DEV PORTFOLIO</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* 그리는 쪽이 공백 엔티티를 접어 버려 단어 사이는 gap 으로 띄운다 */}
          <div style={{ display: 'flex', gap: 26, fontSize: 84, fontWeight: 700, lineHeight: 1 }}>
            <span>JAVA</span>
            <span style={{ color: '#00ff88' }}>DEVELOPER</span>
            <span style={{ color: '#adbac7' }}>EJK</span>
          </div>
          <div style={{ display: 'flex', fontSize: koFont ? 28 : 30, color: '#adbac7', fontFamily: koFont ? 'NotoSansKR' : 'monospace' }}>
            {koFont ? TAGLINE_KO : TAGLINE_EN}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, fontSize: 22, color: '#4d9fff' }}>
          {['SPRING', 'ORACLE', 'JSP', 'EGOVFRAME', 'NEXT.JS'].map(s => (
            <span key={s} style={{ padding: '8px 18px', border: '2px solid #21262d', borderRadius: 999 }}>{s}</span>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: koFont ? [{ name: 'NotoSansKR', data: koFont, style: 'normal', weight: 500 }] : undefined,
    },
  )
}
