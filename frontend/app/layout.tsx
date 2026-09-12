import './globals.css'
import type { Metadata } from 'next'
import AppShell from '@/components/AppShell'

// 서버 컴포넌트라야 metadata 를 내보낼 수 있다. 상태를 쥔 껍데기는 AppShell 이 맡는다.
// template 은 하위 페이지가 title 을 내보낼 때만 붙는다 — 「PROJECT SHOP · EJG PORTFOLIO」
export const metadata: Metadata = {
  title: {
    default: 'EJG PORTFOLIO',
    template: '%s · EJG PORTFOLIO',
  },
  description: '설계 결정과 검증 체계를 기록으로 남기는 JSP·Java·Spring 5년차 개발자 포트폴리오',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
