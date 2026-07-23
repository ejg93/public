# Portfolio

개인 포트폴리오. Next.js 프론트 + Spring Boot 백엔드, 모노레포로 관리.

```
portfolio/
├── frontend/   Next.js 14 (App Router) — Vercel 배포
└── backend/    Spring Boot 3 (Java 17) — Railway 배포
```

## 작업 규칙

**문서 먼저**: 코드 작업 전 프론트/백 판단 후 해당 문서를 읽는다. 화면·컴포넌트·라우팅·클라이언트 SDK = [doc/frontend/](doc/frontend/), 외부 API·DB·서버 로직 = [doc/backend/](doc/backend/). 양쪽에 걸치면 둘 다. 스킬별 버전·용도 색인은 [doc/README.md](doc/README.md).

**토큰 절약**:
- 이미 읽은 파일 다시 읽지 않는다. 수정 직후 확인용 재읽기도 안 한다
- 큰 파일은 필요한 범위만 읽는다 (offset/limit)
- "어디에 정의됐나", "뭐가 호출하나" 류 탐색은 서브에이전트에 위임한다
- 검색 시 `node_modules/`, `target/`, `.next/`, `*.tsbuildinfo` 제외
- 빌드·테스트 출력은 실패한 부분만 인용한다. 전체 로그 붙여넣지 않는다
- 작업 하나 끝나면 `/compact` 권한다

## 라우트 매핑

| 프론트 | 백엔드 API | 설명 |
|---|---|---|
| `/` | - | 홈 |
| `/about` | - | 소개 |
| `/ai-battle` | `POST /api/battle/chat`, `GET /api/battle/health` | Claude 기반 AI 배틀 |
| `/stock` | `GET /api/stock/{search,load,price,chart}` | 주식 시세/차트 (Yahoo Finance, 키 불필요) |
| `/youtube` | `GET /api/youtube/{comments,replies}` | 유튜브 댓글 뷰어 |
| `/public-data` | `GET /api/jobs` | 채용정보 (사람인) |
| `/board` | - | 게시판 (정적 데모 모음) |

## 환경변수

**frontend** — `frontend/.env.local` + Vercel Project Settings

| 변수 | 용도 |
|---|---|
| `NEXT_PUBLIC_SPRING_URL` | 백엔드(Railway) API 베이스 URL |
| `NEXT_PUBLIC_KAKAO_JS_KEY` | Kakao Maps JS SDK (브라우저) |

**backend** — `backend/src/main/resources/application.properties` + Railway Variables
(로컬은 `application.properties.template` 복사해서 사용)

| 변수 | 용도 |
|---|---|
| `anthropic.api.key` | AI 배틀 |
| `youtube.api.key` | 유튜브 댓글/답글 |
| ~~`polygon.api.key`~~ | 미사용 — 주식 시세는 Yahoo Finance 호출(`StockService.java`), 별도 키 불필요 |
| `kakao.rest.key` | Kakao REST (서버사이드) |
| `saramin.access.key` | 채용정보(사람인) |
| `spring.datasource.*` | Railway Postgres 접속 |

## 로컬 실행

```bash
# backend
cd backend
cp src/main/resources/application.properties.template src/main/resources/application.properties
# 위 파일에 실제 키 채운 뒤
mvn spring-boot:run       # localhost:8080

# frontend
cd frontend
npm install
npm run dev               # localhost:3000
```

## 배포

| 서비스 | 플랫폼 | 비고 |
|---|---|---|
| frontend | [Vercel](https://vercel.com/ejg93s-projects/ejgsproject) | `frontend/` 루트, `main` push 시 자동 |
| backend | [Railway](https://railway.com/dashboard) | `backend/` 루트, Postgres 플러그인 |

상세 설정·정식 문서·체크리스트는 [doc/deployment.md](doc/deployment.md).
