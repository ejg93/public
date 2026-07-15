# Portfolio

개인 포트폴리오 프로젝트. Next.js 프론트 + Spring Boot 백엔드, 2개 리포 없이 모노레포로 관리.

사용 기술(스킬)별 상세 문서는 [doc/](doc/README.md) 폴더 참고.

## 구조

```
portfolio/
├── frontend/   Next.js 14 (App Router) — Vercel 배포
└── backend/    Spring Boot 3 (Java) — Railway 배포
```

## 배포

| 서비스 | 플랫폼 | 비고 |
|---|---|---|
| frontend | [Vercel](https://vercel.com/ejg93s-projects/ejgsproject) | `frontend/` 루트로 지정, `main` push 시 자동 배포 |
| backend | [Railway](https://railway.com/dashboard) | `backend/` 루트로 지정, Postgres 플러그인 연결 |

프론트 → 백엔드 호출은 `NEXT_PUBLIC_SPRING_URL` (Vercel env var, Railway 배포 URL 가리킴) 로 연결.

## 환경변수

### frontend (`frontend/.env.local`, Vercel Project Settings에도 동일 등록)

| 변수 | 용도 |
|---|---|
| `NEXT_PUBLIC_SPRING_URL` | 백엔드(Railway) API 베이스 URL |
| `NEXT_PUBLIC_KAKAO_JS_KEY` | Kakao Maps JS SDK (브라우저) |

### backend (`backend/src/main/resources/application.properties`, Railway Variables에 동일 등록 — 로컬은 `application.properties.template` 복사해서 사용)

| 변수 | 용도 |
|---|---|
| `anthropic.api.key` | AI 배틀 기능 (Claude) |
| `youtube.api.key` | 유튜브 댓글/답글 조회 |
| `polygon.api.key` | 주식 시세 |
| `kakao.rest.key` | Kakao REST API (서버사이드) |
| `saramin.access.key` | 채용정보(사람인) 조회 |
| `spring.datasource.*` | Railway Postgres 접속 정보 |

## 기능 / 라우트 매핑

| 프론트 페이지 | 백엔드 API | 설명 |
|---|---|---|
| `/` | - | 홈 |
| `/about` | - | 소개 |
| `/ai-battle` | `POST /api/battle/chat`, `GET /api/battle/health` | Claude 기반 AI 배틀 |
| `/stock` | `GET /api/stock/{search,load,price,chart}` | 주식 시세/차트 (Polygon) |
| `/youtube` | `GET /api/youtube/{comments,replies}` | 유튜브 댓글 뷰어 |
| `/public-data` | `GET /api/jobs` | 채용정보 (사람인) |
| `/board` | - | 게시판 (데모 모음, 정적 콘텐츠) |

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
npm run dev              # localhost:3000
```
