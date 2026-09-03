# 포트폴리오

Next.js + Spring Boot 풀스택. 프론트는 Vercel, 백엔드는 Railway에 각각 자동배포된다.

**배포**: [URL 필요]

## 기능

| 화면 | 내용 | 붙인 외부 API |
|---|---|---|
| `/ai-battle` | Claude 기반 AI 배틀 | Anthropic Claude API |
| `/stock` | 주식 시세·차트 | Yahoo Finance(비공식) |
| `/youtube` | 유튜브 댓글 뷰어 | YouTube Data API v3 |
| `/public-data` | 채용정보 목록 + 지도 | 사람인 오픈 API, Kakao Local/Maps |

## 스택

- **프론트**: Next.js 14(App Router), React 18, TypeScript, Recharts
- **백엔드**: Spring Boot 3(Java 17), Spring Data JPA, PostgreSQL(Railway)
- **배포**: Vercel(frontend) + Railway(backend), `main` push마다 자동배포

## 만들면서 실제로 부딪힌 것

- **모노레포를 플랫폼 두 곳에 나눠 배포** — 폴더 하나에 frontend/backend 같이 두고, 각 플랫폼의 Root Directory 설정으로 절반씩만 빌드하게 했다. 도메인이 갈리니 백엔드 CORS 설정이 필수였다.
- **환경변수가 빌드 시점에 박제된다** — `NEXT_PUBLIC_` 값은 브라우저에 그대로 노출되고, 백엔드 URL이 바뀌면 프론트를 재배포해야 반영된다는 걸 배포하면서 알았다.
- **외부 API 다섯 개를 붙이면서 인증 방식이 다 달랐다** — 키 없이 되는 것(Yahoo Finance), 공개 키를 브라우저에 노출해도 되는 것(Kakao JS SDK), 서버에서만 쥐고 있어야 하는 것(Claude, YouTube, 사람인)을 구분해서 백엔드/프론트 어느 쪽에 둘지 갈랐다.

## 로컬 실행

```bash
# frontend
cd frontend && npm install && npm run dev   # localhost:3000

# backend
cd backend && mvn spring-boot:run           # localhost:8080
```
