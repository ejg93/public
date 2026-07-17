# Next.js

*last modified: 2026-04-27T08:58:42.000Z*

## Next.js 렌더링 방식

### SSG (Static Site Generation) - 정적 생성

- 빌드할 때 미리 HTML 생성

- CDN에 올려서 서버 부담 거의 없음 (빠르고 저렴)

- 누가 봐도 내용이 똑같은 페이지에 적합

- ex) 블로그 글, 소개 페이지, 포트폴리오

### SSR (Server-Side Rendering) - 서버사이드 렌더링

- 요청마다 서버에서 HTML 생성

- 최신 데이터 필요하거나 SEO 중요할 때

- 트래픽 많을수록 서버 부담 증가

- ex) 뉴스, 상품 상세 페이지

### CSR (Client-Side Rendering) - 클라이언트 렌더링

- HTML 껍데기만 주고 브라우저에서 JS로 데이터 fetch

- 로그인 이후 사용자별 데이터에 적합

- 초기 로딩 느릴 수 있음, SEO 불리

- ex) 마이페이지, 대시보드, 장바구니

"use client" 사용하는 페이지에 해당

---

## Next.js App Router 기준

- `use client` 선언 → CSR (브라우저에서 실행)

- 선언 없음 → 기본 서버 컴포넌트 (SSR/SSG)

---

## 구조 예시 (Next.js + Spring Boot 분리)

Next.js (3000) → 렌더링 담당

Spring Boot (8080) → API/데이터 담당

- 정적 콘텐츠 → SSG

- 로그인 후 개인화 데이터 → CSR로 Spring API 호출

- SEO 필요한 동적 페이지 → SSR

