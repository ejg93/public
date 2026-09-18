import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { ROUTES } from './routes'

// axe 로 라우트마다 접근성 위반을 센다. 대비·라벨·랜드마크처럼 눈으로는 놓치는 자리를 기계가 든다.
// 라이트·다크 둘 다 본다 — 색 토큰이 테마마다 달라서 대비는 한쪽만 통과할 수 있다.
const THEMES = ['light', 'dark'] as const

// 심각도 낮은 것까지 막으면 손댈 수 없는 상태가 된다. 읽기를 실제로 막는 둘만 0 으로 고정한다
const BLOCKING = new Set(['serious', 'critical'])

for (const theme of THEMES) {
  for (const route of ROUTES) {
    test(`${route} ${theme} 접근성 위반 0`, async ({ page }) => {
      // 첫 페인트 전에 테마를 세운다. layout.tsx 의 themeBoot 이 읽는 값과 같은 키다
      await page.addInitScript((t) => {
        try {
          if (t === 'dark') localStorage.setItem('theme', 'dark')
          else localStorage.removeItem('theme')
        } catch (e) {}
      }, theme)

      await page.goto(route, { waitUntil: 'domcontentloaded' })
      await page.waitForLoadState('networkidle')

      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      const blocking = violations
        .filter((v) => BLOCKING.has(String(v.impact)))
        .map((v) => `${v.impact} ${v.id}: ${v.nodes.length}곳 — ${v.nodes[0]?.target.join(' ')}`)

      expect(blocking, `${route} ${theme}`).toEqual([])
    })
  }
}
