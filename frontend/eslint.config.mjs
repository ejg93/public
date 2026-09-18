// Next 16 은 `next lint` 를 없앴다. ESLint 를 직접 부르고 설정도 flat 형식으로 옮겼다.
// eslint-config-next 16 의 core-web-vitals 는 이미 flat 배열을 내보낸다.
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const config = [
  {
    ignores: ['.next/**', '.next-verify/**', '.next-e2e/**', 'node_modules/**', 'playwright-report/**', 'test-results/**'],
  },
  ...nextCoreWebVitals,
  {
    rules: {
      // 화면 문구에 따옴표·꺾쇠를 그대로 쓴다. 엔티티로 바꾸면 소스가 읽기 나빠진다
      'react/no-unescaped-entities': 'off',
    },
  },
]

export default config
