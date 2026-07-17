# Portfolio

개인 포트폴리오 프로젝트. Next.js 프론트 + Spring Boot 백엔드, 2개 리포 없이 모노레포로 관리.

사용 기술(스킬)별 상세 문서는 [doc/](doc/README.md) 폴더 참고. 기술 문서는 다음처럼 나뉜다:

- [doc/frontend/](doc/frontend/) — Next.js · React · TypeScript · Tailwind · Recharts · Kakao Maps JS SDK
- [doc/backend/](doc/backend/) — Spring Boot · Spring Data JPA · PostgreSQL · Lombok · HttpClient/Jackson · 외부 API(external-apis.md)

> **작업 지시**: 코드/문서 작업 전, 해당 작업이 **프론트엔드**(frontend/, Next.js·React·TS·차트·지도)인지 **백엔드**(backend/, Spring·JPA·DB·외부 API)인지 먼저 판단하고, 관련 있으면 해당 `doc/frontend/` 또는 `doc/backend/` 문서를 먼저 읽고 그 내용(버전·용도·정식 문서)에 맞춰 작업한다. 외부 API·DB·서버 로직 = 백엔드, 화면·컴포넌트·라우팅·클라이언트 SDK = 프론트엔드. 양쪽에 걸치면 둘 다 확인한다.

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



# 배포 — Vercel & Railway

모노레포(폴더 하나에 frontend/backend 공존)를 플랫폼 두 곳에 나눠 배포한다. 둘 다 `main` 브랜치 push 시 자동 배포(GitHub 연동).

```
GitHub(main push)
 ├─→ Vercel   : frontend/ 를 루트로 빌드·배포 (Next.js)
 └─→ Railway  : backend/  를 루트로 빌드·배포 (Spring Boot) + Postgres 플러그인
```

프론트 → 백엔드 연결은 Vercel 환경변수 `NEXT_PUBLIC_SPRING_URL`이 Railway 배포 URL을 가리키는 방식. 도메인이 다르므로 백엔드 `WebConfig.java`의 CORS 설정이 필수다.

## Vercel (frontend)

- Next.js 개발사가 운영하는 호스팅 — Next.js 배포는 사실상 무설정
- 이 프로젝트 설정: 프로젝트 루트를 `frontend/`로 지정 (모노레포 Root Directory 설정)
- 환경변수: `NEXT_PUBLIC_SPRING_URL`, `NEXT_PUBLIC_KAKAO_JS_KEY` — Project Settings > Environment Variables에 등록. `NEXT_PUBLIC_` 접두사가 붙은 변수만 브라우저에 노출된다 (빌드 시점에 코드에 박제되므로 변경하면 재배포 필요)
- 대시보드: https://vercel.com/ejg93s-projects/ejgsproject
- 정식 문서:
    - Vercel 문서 홈: https://vercel.com/docs
    - 모노레포 배포: https://vercel.com/docs/monorepos
    - 환경변수: https://vercel.com/docs/environment-variables
    - Next.js 배포 가이드: https://vercel.com/docs/frameworks/nextjs

## Railway (backend + PostgreSQL)

- 컨테이너 기반 PaaS. Java/Maven 프로젝트를 감지해 자동 빌드(Nixpacks) 후 실행
- 이 프로젝트 설정: 서비스 루트를 `backend/`로 지정, Postgres 플러그인 연결
- 환경변수: `application.properties`의 `${...}` 자리표시자들이 Railway Variables에서 주입됨 (ANTHROPIC/YOUTUBE/POLYGON/KAKAO/SARAMIN 키 + `spring.datasource.*`)
- 대시보드: https://railway.com/dashboard
- 정식 문서:
    - Railway 문서 홈: https://docs.railway.com/
    - 모노레포: https://docs.railway.com/guides/monorepo
    - 환경변수: https://docs.railway.com/guides/variables
    - PostgreSQL 플러그인: https://docs.railway.com/guides/postgresql

## 배포 체크리스트

1. 로컬에서 `npm run build`(frontend), `mvn package`(backend) 통과 확인
2. 새 환경변수 추가 시: Vercel/Railway 양쪽 콘솔에도 등록 + 루트 README 표 갱신
3. 백엔드 URL 변경 시: Vercel의 `NEXT_PUBLIC_SPRING_URL` 갱신 후 프론트 재배포 (빌드 시점 박제이므로)
4. CORS 오류 발생 시: `WebConfig.java`의 허용 origin에 프론트 도메인 포함됐는지 확인
