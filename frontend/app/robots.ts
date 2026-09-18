import type { MetadataRoute } from 'next'

// 크롤러에게 사이트맵 위치를 알린다. /about 을 여기서 Disallow 로 막지 않는 이유는,
// 막으면 크롤러가 페이지를 아예 안 읽어서 그 안의 noindex 메타를 못 보기 때문이다.
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://public-alpha-roan.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  }
}
