import type { Metadata } from 'next'

// /about 은 참조용으로만 남긴 라우트다. 메뉴에 없고 검색 색인에서도 뺀다
export const metadata: Metadata = {
  title: 'ABOUT',
  robots: { index: false, follow: false },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
