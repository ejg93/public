import { test, expect } from '@playwright/test'
import { ROUTES } from './routes'

// 폰 폭에서 가로 스크롤이 생기는지 본다. 긴 영문 토큰·고정 폭 표·넘치는 이미지가 원인이고,
// 데스크톱 폭에서는 안 보이다가 폰에서만 화면이 옆으로 밀린다.
//
// 폭을 둘 잰다. 400 은 흔한 폰이고, 320 은 더 좁은 기기이면서 글꼴 폭 차이를 흡수하는 여유다 —
// 2026-09-18 에 리눅스 러너가 400px 에서 넘쳤는데 같은 화면이 윈도우에서는 통과했다.
// 글꼴이 넓으면 flex 아이템의 min-content 가 커져서 같은 코드가 환경마다 갈린다.
const WIDTHS = [400, 320]

for (const width of WIDTHS) {
  test.describe(`폰 폭 ${width}px`, () => {
    test.use({ viewport: { width, height: 800 } })

    for (const route of ROUTES) {
      test(`${route} 가 안 넘친다`, async ({ page }) => {
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
  })
}
