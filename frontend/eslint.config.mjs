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
      // 본문에 넣는 그림이 거의 SVG 다. next/image 는 SVG 를 최적화하지 않으므로 바꿔도
      // 얻는 것이 없고, 남은 PNG 둘은 Vercel 이미지 최적화 사용량을 새로 태운다.
      // 그래서 본문 그림에는 img 를 그대로 쓴다 — projectshop 의 Figure 도 next/image 를
      // unoptimized 로 쓰고 있어 같은 판단이다.
      '@next/next/no-img-element': 'off',
    },
  },
]

export default config
