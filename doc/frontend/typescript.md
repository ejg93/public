# TypeScript 5

## 개요

자바스크립트에 타입을 얹은 언어. Java처럼 변수·함수에 타입을 선언하고 컴파일 시점에 오류를 잡는다. 브라우저는 TypeScript를 직접 못 읽으므로 빌드할 때 순수 자바스크립트로 변환(트랜스파일)된다. Java 하던 입장에선 "컴파일러가 타입 검사해주는 JS"로 이해하면 정확하다.

## 이 프로젝트에서

- 버전: **5** / 설정 파일: `frontend/tsconfig.json`
- 프론트 전체가 `.ts` / `.tsx` (tsx = JSX 포함 TypeScript)
- 대표 사용 예 — `app/board/posts.ts`의 게시물 타입 정의:
  - `type Post = { id: string; title: string; ... blocks: Block[] }`
  - `type Block = TextBlock | CodeBlock | DemoBlock | ...` ← **유니온 타입**. "Block은 이 다섯 중 하나"라는 뜻. 각 블록의 `type` 필드 값('text', 'code' 등)으로 구분하는 패턴(discriminated union).
- `app/public-data/page.tsx`의 `declare global { interface Window { kakao: any } }` — 외부 스크립트(Kakao SDK)가 window에 심어주는 전역 객체를 타입 시스템에 알려주는 선언.

## 핵심 개념 요약

- **type / interface**: 객체 형태 정의. Java의 DTO 클래스 선언과 비슷한 역할.
- **유니온 타입 (`A | B`)**: 여러 타입 중 하나. Java에는 없는 개념으로, instanceof 분기 대신 필드 값으로 좁혀 쓴다.
- **`any`**: 타입 검사 포기 선언. 외부 SDK처럼 타입 정보가 없을 때 임시로 쓴다 (남용 금지).
- **제네릭 (`useState<string>`)**: Java 제네릭과 동일 개념.

## 정식 문서

- 공식 문서: https://www.typescriptlang.org/docs/
- 핸드북(입문~심화): https://www.typescriptlang.org/docs/handbook/intro.html
- 유니온/내로잉: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
