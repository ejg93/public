# frontend — Next.js 14 앱

App Router 기반 포트폴리오 화면. Vercel이 이 폴더를 루트로 잡고 `main` push마다 자동 배포한다.

이 문서는 `app/`, `components/`, `lib/`, 설정 파일을 대상으로 한다. `public/` 아래 정적 보관물은 각자 다른 규칙을 따르니 루트 [CLAUDE.md](../CLAUDE.md) 구역 지도를 본다.

## 구조

```
app/          라우트별 page.tsx (App Router)
components/   Sidebar.tsx — 전 페이지 공통 좌측 내비
lib/api.ts    백엔드 베이스 URL·공개 키 상수 중앙 관리
```

새 화면은 `app/<경로>/page.tsx`로 만든다. 백엔드 주소나 공개 키를 페이지에 직접 박지 말고 `lib/api.ts`에서 import 한다.

## 라우트

| 프론트 | 호출하는 백엔드 API | 화면 내용 |
|---|---|---|
| `/` | - | 홈 |
| `/about` | - | 소개 |
| `/ai-battle` | `POST /api/battle/chat`, `GET /api/battle/health` | Claude 기반 AI 배틀 |
| `/stock` | `GET /api/stock/{search,load,price,chart}` | 주식 시세·차트 |
| `/youtube` | `GET /api/youtube/{comments,replies}` | 유튜브 댓글 뷰어 |
| `/public-data` | `GET /api/jobs` | 채용정보 목록 + 지도 |
| `/board` | - | 게시판. 정적 데모를 `demos.tsx`/`demoMap.tsx`로 등록 |

## 스타일

Tailwind가 설치돼 있고 `tailwind.config.js`도 있지만, **화면 스타일은 대부분 `style={{ }}` 인라인으로 작성돼 있다.** 페이지당 인라인 수십 건, className 10건 안팎. 기존 페이지를 고칠 때는 그 페이지가 이미 쓰는 방식을 따라가고, 인라인을 Tailwind 클래스로 바꾸는 일괄 변환은 요청 없이 하지 않는다.

## 환경변수

`.env.local` + Vercel Project Settings 양쪽에 넣어야 배포본에서도 동작한다.

| 변수 | 용도 |
|---|---|
| `NEXT_PUBLIC_SPRING_URL` | 백엔드(Railway) API 베이스 URL. 없으면 `http://localhost:8080` |
| `NEXT_PUBLIC_KAKAO_JS_KEY` | Kakao Maps JS SDK를 브라우저에서 로드할 때 쓰는 공개 키 |

`NEXT_PUBLIC_` 접두사가 붙은 값은 번들에 그대로 실려 브라우저에 노출된다. 비밀 키는 백엔드에 둔다.

## 로컬 실행

```bash
npm install
npm run dev               # localhost:3000
```

## 검증

코드를 고친 뒤 "됐다"고 보고하기 전에 돌린다. 아래로 갈수록 비용이 크다.

| 명령 | 무엇을 잡나 | 언제 |
|---|---|---|
| `npm run typecheck` | 타입 불일치, null 가능성, 없는 속성 접근 | `.ts`·`.tsx` 수정 후 |
| `npm run lint` | `useEffect` 의존성 누락 등 실수 패턴 | 컴포넌트·훅 수정 후 |
| `npm run build` | 위 둘 + 정적 생성·설정 오류 | **커밋 전 최소 1회** |
| `npm audit --omit=dev` | 배포본에 실리는 의존성의 취약점 | 의존성 추가·변경 후 |

`npm run build`가 Vercel이 실제로 돌리는 명령이다. 여기서 실패하면 배포도 실패한다. **빌드가 깨진 상태로 작업을 끝내지 않는다.**

`.eslintrc.json`이 있으므로 빌드 중 lint가 자동으로 돌고, lint 에러 하나로 빌드 전체가 중단된다. 스타일 룰이 새 코드를 막으면 룰을 끄는 쪽이 맞는지 먼저 판단한다.

화면이 실제로 그려지는지(차트 렌더, 지도 표시, 콘솔 에러)는 위 넷이 못 잡는다. 그건 chrome-devtools MCP로 페이지를 열어 확인한다. 단 `/stock`·`/youtube`·`/ai-battle`·`/public-data`는 백엔드가 `localhost:8080`에 떠 있어야 의미가 있다. 안 떠 있으면 확인 못 한 범위를 밝힌다.

## doc 참조 트리거

아래 작업을 할 때만 해당 문서를 연다. 그 외에는 열지 않는다.

| 작업 | 문서 |
|---|---|
| `/stock` 차트 축·툴팁·데이터 형식 변경 | [doc/frontend/recharts.md](../doc/frontend/recharts.md) |
| `/public-data` 지도 마커·좌표·SDK 로딩 변경 | [doc/frontend/kakao-maps-sdk.md](../doc/frontend/kakao-maps-sdk.md) |
| 라이브러리 버전 확인이 필요할 때 | `package.json` 직접 확인 |
