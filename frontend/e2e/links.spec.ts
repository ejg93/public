import { test, expect } from '@playwright/test'
import { ROUTES } from './routes'

// 화면에 걸린 내부 링크를 전부 모아 실제로 요청해 본다.
// 2026-09-12 에 한글 경로가 인코딩 없이 나가 클릭은 되는데 복사한 주소는 404 인 일이 있었다.
// scripts/href-lint.js 는 소스의 문자열을 보고, 여기서는 최종 주소를 본다.
test('내부 링크가 전부 살아 있다', async ({ page, request }) => {
  const found = new Map<string, string>()

  for (const route of ROUTES) {
    await page.goto(route, { waitUntil: 'domcontentloaded' })
    const hrefs = await page.$$eval('a[href]', (els) => els.map((el) => (el as HTMLAnchorElement).href))
    for (const href of hrefs) {
      const url = new URL(href)
      if (url.origin !== new URL(page.url()).origin) continue
      if (url.protocol !== 'http:' && url.protocol !== 'https:') continue
      const path = url.pathname + url.search
      if (!found.has(path)) found.set(path, route)
    }
  }

  expect(found.size, '내부 링크를 하나도 못 찾았다 — 선택자가 틀렸을 수 있다').toBeGreaterThan(10)

  const dead: string[] = []
  for (const [path, from] of Array.from(found.entries())) {
    const res = await request.get(path, { maxRedirects: 5 })
    if (res.status() >= 400) dead.push(`${res.status()} ${path} (${from} 에서 걸림)`)
  }

  expect(dead, `죽은 내부 링크 ${dead.length}개 / 검사 ${found.size}개`).toEqual([])
})
