# Next.js 14 (App Router)

## 개요

React 기반 풀스택 프레임워크. 순수 React는 "화면 그리는 라이브러리"일 뿐이라 라우팅(URL → 페이지 매핑), 빌드, 서버 렌더링을 직접 구성해야 하는데, Next.js가 그걸 전부 묶어서 제공한다.

JSP 세계에 비유하면: JSP에서 `/board/list.jsp` 파일을 만들면 그 URL로 접근되듯이, Next.js App Router는 `app/board/page.tsx` 파일을 만들면 `/board` URL이 생긴다. **폴더 구조가 곧 URL 구조**라는 점이 같다. 차이는 JSP는 서버에서 HTML을 완성해서 내려주는 반면, Next.js는 서버 렌더링(SSR)과 브라우저 렌더링(CSR)을 페이지·컴포넌트 단위로 섞어 쓸 수 있다는 것.

## 이 프로젝트에서

- 버전: **14.2.5** (App Router 방식)
- `frontend/app/` 아래 폴더가 곧 라우트:
  - `app/page.tsx` → `/`
  - `app/board/page.tsx` → `/board`
  - `app/board/post/[id]/page.tsx` → `/board/post/글ID` (동적 라우트 — `[id]` 폴더명이 URL 파라미터가 됨)
- 페이지 대부분이 파일 첫 줄에 `'use client'` 선언 → 클라이언트 컴포넌트. useState 등 브라우저 상호작용이 필요해서다. 선언이 없으면 기본이 서버 컴포넌트.
- `next/script`의 `<Script>` 컴포넌트로 Kakao Maps SDK 로드 (`app/public-data/page.tsx`)
- `frontend/next.config.js` — 빌드 설정. 숨은 정적 페이지 `/study/architecture-notes`(→ `public/study/architecture-notes.html`) 접근 설정 포함.
- `public/` 폴더의 파일은 그대로 정적 서빙됨 (이미지, html 등)

## 핵심 개념 요약

- **App Router vs Pages Router**: Next.js 13부터 도입된 신형이 App Router(`app/` 폴더). 구형은 `pages/` 폴더. 이 프로젝트는 App Router.
- **서버 컴포넌트 / 클라이언트 컴포넌트**: 기본은 서버에서 렌더링. `'use client'`를 붙이면 브라우저에서 실행되어 useState, onClick 등을 쓸 수 있다.
- **동적 라우트**: `[id]` 같은 대괄호 폴더명. 컴포넌트에서 `params.id`로 받는다.

## 정식 문서

- 공식 문서: https://nextjs.org/docs
- 14 버전 문서 (프로젝트 버전): https://nextjs.org/docs/14/getting-started
- App Router 라우팅: https://nextjs.org/docs/14/app/building-your-application/routing
- `next/script`: https://nextjs.org/docs/14/app/api-reference/components/script
