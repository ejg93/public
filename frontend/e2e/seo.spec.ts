import { test, expect } from '@playwright/test'
import { ROUTES } from './routes'

// sitemap·robots 는 코드로 만들어서 눈에 안 띈다. 주소가 죽거나 내용이 비어도 화면은 멀쩡해 보인다
test('sitemap 에 색인 대상 라우트가 다 들어 있다', async ({ request }) => {
  const res = await request.get('/sitemap.xml')
  expect(res.status()).toBe(200)
  const xml = await res.text()

  // /about 은 noindex 라 빠져 있어야 한다. 나머지는 다 들어 있어야 한다
  const indexed = ROUTES.filter((r) => r !== '/about')
  const missing = indexed.filter((r) => !xml.includes(r === '/' ? '</loc>' : `${r}</loc>`))
  expect(missing, 'sitemap 에서 빠진 라우트').toEqual([])
  expect(xml, '/about 은 색인 대상이 아니다').not.toContain('/about</loc>')
})

test('robots 가 sitemap 위치를 알린다', async ({ request }) => {
  const res = await request.get('/robots.txt')
  expect(res.status()).toBe(200)
  const txt = await res.text()
  expect(txt).toContain('Sitemap:')
  expect(txt).toContain('/sitemap.xml')
})

test('/about 은 색인에서 빠진다', async ({ page }) => {
  await page.goto('/about', { waitUntil: 'domcontentloaded' })
  const robots = await page.locator('meta[name="robots"]').getAttribute('content')
  expect(robots ?? '').toContain('noindex')
})
