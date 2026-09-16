import './globals.css'
import type { Metadata } from 'next'
import { Noto_Sans_KR, IBM_Plex_Mono, Bebas_Neue } from 'next/font/google'
import AppShell from '@/components/AppShell'

// 웹폰트는 빌드 때 받아 같은 도메인에서 낸다. CSS @import 로 걸면 CSS 를 받은 뒤에야 폰트 요청이 시작된다.
// 세 변수는 globals.css 의 body·.mono·.display 와 인라인 fontFamily 가 읽는다
const sans = Noto_Sans_KR({ subsets: ['latin'], weight: ['300', '400', '500', '700'], variable: '--font-sans', display: 'swap' })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-mono', display: 'swap' })
const display = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-display', display: 'swap' })

// 링크를 카톡·메일에 붙였을 때 뜨는 카드(og:*)의 절대 주소 기준. 미리보기 이미지는 opengraph-image.tsx 가 그린다
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://public-alpha-roan.vercel.app'

// 서버 컴포넌트라야 metadata 를 내보낼 수 있다. 상태를 쥔 껍데기는 AppShell 이 맡는다.
// template 은 하위 페이지가 title 을 내보낼 때만 붙는다 — 「PROJECT SHOP · EJK PORTFOLIO」
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'EJK PORTFOLIO',
    template: '%s · EJK PORTFOLIO',
  },
  description: '설계 결정과 검증 체계를 기록으로 남기는 JSP·Java·Spring 5년차 개발자 포트폴리오',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'EJK PORTFOLIO',
    title: 'EJK PORTFOLIO',
    description: '공공·금융 SI Java 백엔드 5년차 — 요구사항 재정의부터 테이블 설계·배치 운영까지',
  },
  twitter: { card: 'summary_large_image' },
}

// 첫 페인트 전에 저장된 테마를 세운다. 리액트가 붙은 뒤에 세우면 라이트가 한 프레임 번쩍한다
const themeBoot = `try{if(localStorage.getItem('theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
