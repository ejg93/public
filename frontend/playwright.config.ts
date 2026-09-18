import { defineConfig, devices } from '@playwright/test'

// 실제 배포본과 같은 조건을 보려고 dev 가 아니라 build + start 를 띄운다.
// 포트는 3100 이다. dev 서버가 쓰는 3000 과 겹치면 둘 다 망가진다.
// 산출물도 .next-e2e 로 갈라 둔다 — next.config.js 의 distDir 이 NEXT_DIST_DIR 을 읽는다.
const PORT = Number(process.env.E2E_PORT || 3100)
const BASE_URL = `http://localhost:${PORT}`

// verify.sh 는 방금 .next-verify 에 빌드해 놓고 부른다. 같은 산출물을 다시 만들 이유가 없어서
// E2E_SKIP_BUILD 로 빌드를 건너뛰고 E2E_DIST 로 그 폴더를 가리킨다
const DIST = process.env.E2E_DIST || '.next-e2e'
const SKIP_BUILD = process.env.E2E_SKIP_BUILD === '1'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: SKIP_BUILD ? `npm run start -- -p ${PORT}` : `npm run build && npm run start -- -p ${PORT}`,
    url: BASE_URL,
    // 기본은 새로 띄운다. 3100 에 낡은 빌드가 떠 있으면 그것을 검사해 놓고 통과했다고 읽게 된다.
    // scripts/dev-up.sh 로 띄워 둔 서버를 일부러 쓸 때만 E2E_REUSE=1 을 준다
    reuseExistingServer: process.env.E2E_REUSE === '1',
    timeout: 300_000,
    env: { NEXT_DIST_DIR: DIST },
  },
})
