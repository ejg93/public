# 기술 스택 문서 (doc/)

이 폴더는 포트폴리오 프로젝트에서 실제로 사용 중인 기술(스킬)들을 하나씩 정리한 문서 모음이다.
루트 `CLAUDE.md`는 프로젝트 구조/배포/라우트 중심이고, 여기는 "각 기술이 뭐고, 어디에 쓰이고, 정식 문서가 어디인지"를 다룬다.

기술 문서는 `frontend/`(프론트엔드)와 `backend/`(백엔드) 두 하위 폴더로 나눠 정리한다. 외부 API는 백엔드 `service/` 계층에서 호출하므로 `backend/`에 둔다.

> 작성 기준일: 2026-07-15. 버전은 `frontend/package.json`, `backend/pom.xml` 기준.

## 프론트엔드 — [frontend/](frontend/)

| 스킬 | 버전 | 프로젝트 내 용도 | 문서 |
|---|---|---|---|
| Next.js (App Router) | 14.2.5 | 프론트 전체 프레임워크, 라우팅 | [nextjs.md](frontend/nextjs.md) |
| React | 18 | UI 컴포넌트, 상태 관리 (useState/useEffect/useRef) | [react.md](frontend/react.md) |
| TypeScript | 5 | 프론트 전체 타입 시스템 | [typescript.md](frontend/typescript.md) |
| Tailwind CSS | 3.4.1 | 유틸리티 CSS (설정만 존재, 페이지 대부분은 인라인 스타일) | [tailwindcss.md](frontend/tailwindcss.md) |
| Recharts | 3.8.1 | `/stock` 주가 라인 차트 | [recharts.md](frontend/recharts.md) |
| Kakao Maps JS SDK | v2 | `/public-data` 채용정보 지도 표시 | [kakao-maps-sdk.md](frontend/kakao-maps-sdk.md) |

## 백엔드 — [backend/](backend/)

| 스킬 | 버전 | 프로젝트 내 용도 | 문서 |
|---|---|---|---|
| Spring Boot | 3.2.5 (Java 17) | 백엔드 전체 프레임워크, REST API | [spring-boot.md](backend/spring-boot.md) |
| Spring Data JPA | (Boot 관리) | `StockPrice` 엔티티 저장/조회 | [spring-data-jpa.md](backend/spring-data-jpa.md) |
| PostgreSQL | Railway 플러그인 | 주가 데이터 영속화 | [postgresql.md](backend/postgresql.md) |
| Lombok | (Boot 관리) | getter/setter/로그 보일러플레이트 제거 | [lombok.md](backend/lombok.md) |
| HttpClient 5 / Jackson | (Boot 관리) | 외부 API 호출 + JSON 파싱 | [httpclient-jackson.md](backend/httpclient-jackson.md) |

## 외부 API — [backend/external-apis.md](backend/external-apis.md)

| API | 사용처 | 문서 |
|---|---|---|
| Anthropic Claude API | `/ai-battle` — `BattleService.java` | [external-apis.md](backend/external-apis.md) |
| YouTube Data API v3 | `/youtube` — `YoutubeService.java` | [external-apis.md](backend/external-apis.md) |
| Yahoo Finance (비공식) | `/stock` — `StockService.java`, 키 없이 호출 | [external-apis.md](backend/external-apis.md) |
| Kakao Local REST API | 채용정보 주소 → 좌표 변환 — `JobService.java` | [external-apis.md](backend/external-apis.md) |
| 사람인 오픈 API | `/public-data` 채용정보 — `JobService.java` | [external-apis.md](backend/external-apis.md) |

## 배포

배포(Vercel/Railway) 상세는 [deployment.md](deployment.md) 참고.
