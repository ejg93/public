import { test, expect, type ConsoleMessage, type Response } from '@playwright/test'
import { ROUTES, isBackendNoise, isDeployNoise, isGenericResourceError } from './routes'

// 라우트마다 한 번씩 열어 보고, 화면이 그려졌는지와 콘솔·네트워크가 조용한지 본다.
// typecheck·build 는 통과하면서 런타임에만 터지는 자리를 여기서 잡는다.
for (const route of ROUTES) {
  test(`${route} 가 에러 없이 그려진다`, async ({ page }) => {
    const consoleErrors: string[] = []
    const pageErrors: string[] = []
    const badResponses: string[] = []

    page.on('console', (msg: ConsoleMessage) => {
      if (msg.type() !== 'error') return
      const text = msg.text()
      if (isBackendNoise(text) || isDeployNoise(text) || isGenericResourceError(text)) return
      consoleErrors.push(text)
    })
    page.on('pageerror', (err) => pageErrors.push(err.message))
    page.on('response', (res: Response) => {
      if (res.status() < 400) return
      if (isBackendNoise(res.url()) || isDeployNoise(res.url())) return
      badResponses.push(`${res.status()} ${res.url()}`)
    })

    const res = await page.goto(route, { waitUntil: 'domcontentloaded' })
    expect(res?.status(), `${route} 응답 코드`).toBeLessThan(400)
    await page.waitForLoadState('networkidle')

    // 제목이 비면 탭·검색결과·공유 카드가 전부 빈칸으로 나간다
    await expect(page).toHaveTitle(/.+/)

    // h1 은 화면마다 정확히 하나여야 한다. 스크린리더가 문서 제목으로 읽는 줄이다
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    await expect(h1).toBeVisible()

    expect(pageErrors, `${route} 처리 안 된 예외`).toEqual([])
    expect(consoleErrors, `${route} 콘솔 에러`).toEqual([])
    expect(badResponses, `${route} 실패한 요청`).toEqual([])
  })
}
