import { test, expect } from '@playwright/test'
import { ROUTES } from './routes'

// 폰 폭에서 가로 스크롤이 생기는지 본다. 긴 영문 토큰·고정 폭 표·넘치는 이미지가 원인이고,
// 데스크톱 폭에서는 안 보이다가 폰에서만 화면이 옆으로 밀린다.
const PHONE = { width: 400, height: 800 }

test.use({ viewport: PHONE })

for (const route of ROUTES) {
  test(`${route} 가 폰 폭 ${PHONE.width}px 에서 안 넘친다`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('networkidle')

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement
      const over: { tag: string; cls: string; right: number }[] = []
      const limit = window.innerWidth
      for (const el of Array.from(document.body.querySelectorAll('*'))) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) continue
        if (r.right > limit + 1) {
          over.push({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 40), right: Math.round(r.right) })
        }
      }
      return { scrollWidth: doc.scrollWidth, innerWidth: limit, worst: over.slice(0, 5) }
    })

    expect(
      overflow.scrollWidth,
      `${route} 가로 넘침 — 범인 후보 ${JSON.stringify(overflow.worst)}`,
    ).toBeLessThanOrEqual(overflow.innerWidth + 1)
  })
}
