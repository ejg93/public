# Tailwind CSS 3.4

## 개요

CSS를 별도 파일에 클래스로 정의하는 대신, HTML에 `class="flex gap-4 text-sm"`처럼 **미리 정의된 유틸리티 클래스를 조합**해서 스타일링하는 프레임워크. 빌드 시 실제로 사용된 클래스만 추려 CSS 파일을 생성한다. PostCSS(CSS 후처리기) 플러그인으로 동작하며, autoprefixer(브라우저 접두사 자동 부여)와 함께 쓰인다.

## 이 프로젝트에서

- 버전: **3.4.1** ← 주의: 현재 Tailwind 최신은 v4이고 설정 방식이 크게 달라졌다. 문서 볼 때 반드시 v3 문서를 볼 것.
- 설정 파일: `frontend/tailwind.config.js`, `frontend/postcss.config.js`
- 실제 사용도: **설정만 되어 있고, 페이지 코드 대부분은 인라인 `style={{...}}` 방식**을 쓴다 (`app/board/demos.tsx` 등). Tailwind 클래스 의존도는 낮은 편. 전역 CSS 변수(`var(--accent)` 등)와 인라인 스타일 조합이 주력.

## 핵심 개념 요약

- **유틸리티 퍼스트**: `p-4`(padding), `flex`, `text-red-500` 같은 단일 목적 클래스 조합.
- **JIT 빌드**: 소스 코드를 스캔해 사용된 클래스만 CSS로 생성 → 결과물이 작다.
- **v3 vs v4**: v3는 `tailwind.config.js`로 설정, v4는 CSS 파일 내 설정으로 변경됨. 이 프로젝트는 v3.

## 정식 문서

- v3 공식 문서 (프로젝트 버전): https://v3.tailwindcss.com/docs
- 최신(v4) 문서 — 참고용: https://tailwindcss.com/docs
- PostCSS: https://postcss.org/
- autoprefixer: https://github.com/postcss/autoprefixer
