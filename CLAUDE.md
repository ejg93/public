# Portfolio

한 저장소에 성격이 다른 구역이 섞여 있다. 배포되는 웹앱과 개인 보관물이 같은 트리에 있으니, **작업 시작 전 구역부터 판별하고 그 구역 규칙을 따른다.**

## 구역 지도

| 경로 | 무엇이 들어 있나 | 규칙 |
|---|---|---|
| `frontend/` | Next.js 14 App Router 앱. Vercel 배포 | [frontend/CLAUDE.md](frontend/CLAUDE.md) |
| `backend/` | Spring Boot 3 REST API. Railway 배포 | [backend/CLAUDE.md](backend/CLAUDE.md) |
| `frontend/public/toolbox/` | 사내 폐쇄망에 반입하는 단일 파일 HTML 도구 모음 | [toolbox/CLAUDE.md](frontend/public/toolbox/CLAUDE.md) |
| `frontend/public/notes/` | 개인 학습 메모(마크다운) 보관 | 요청받은 파일만 수정한다. 정리·리팩터링 대상 아님 |
| `frontend/public/game/` | 게임 확률 계산기 HTML. 개인용 | 요청받은 파일만 수정한다 |
| `frontend/public/study/` | 아키텍처 노트 HTML 1장. 숨은 경로 | 요청받은 파일만 수정한다 |
| `doc/` | 스택별 기술 문서. 색인은 [doc/README.md](doc/README.md) | 각 구역 CLAUDE.md의 트리거에 걸릴 때만 읽는다 |
| `doc/design-standards/` | 행안부 공공 DB 표준화 지침 등 외부 PDF 원본. 표준단어·도메인·코드 설계 근거 | 읽기 전용. 색인은 [design-standards/README.md](doc/design-standards/README.md), 트리거는 toolbox/CLAUDE.md |

`public/` 아래 notes·game·study는 앱 코드가 아니라 정적 보관물이다. 근처 작업 중이라도 요청 없이 손대지 않는다.

## 검증

작업을 끝내기 전에 **그 구역 CLAUDE.md의 「검증」 절에 적힌 명령을 실제로 돌린다.** 구역마다 수단이 다르고, 없는 구역도 있다.

돌리지 못했으면 못 돌렸다고 밝힌다. 안 돌려보고 "동작한다"·"빌드 통과"라고 쓰지 않는다. 일부만 확인했으면 확인한 범위와 못 한 범위를 나눠서 적는다.

## 토큰 절약

- 이미 읽은 파일 다시 읽지 않는다. 수정 직후 확인용 재읽기도 안 한다
- 큰 파일은 필요한 범위만 읽는다 (offset/limit)
- "어디에 정의됐나", "뭐가 호출하나" 류 탐색은 서브에이전트에 위임한다
- 검색 시 `node_modules/`, `target/`, `.next/`, `*.tsbuildinfo` 제외
- `doc/design-standards/`와 `public/toolbox/db_docs/`는 **통짜 grep만 금지**다. 대용량 PDF·벤더 문서 트리라 전문 검색이 무의미하다. 각 폴더 `README.md`의 라우팅 표를 읽고 지목된 파일만 연다 — 참조 자체를 피하라는 뜻이 아니다
- 빌드·테스트 출력은 실패한 부분만 인용한다. 전체 로그 붙여넣지 않는다
- 작업 하나 끝나면 `/compact` 권한다

## 배포

| 서비스 | 플랫폼 | 트리거 |
|---|---|---|
| frontend | [Vercel](https://vercel.com/ejg93s-projects/ejgsproject) | `frontend/` 루트, `main` push 시 자동 |
| backend | [Railway](https://railway.com/dashboard) | `backend/` 루트, Postgres 플러그인 |

`public/` 아래 정적 파일도 Vercel 배포에 그대로 실린다. 개인 메모·게임 파일을 커밋하면 공개 URL로 접근 가능해진다.

상세 설정·체크리스트는 [doc/deployment.md](doc/deployment.md).

## 글 작성 규칙 (문서·UI 문구 공통, 반드시 준수)

1. **중복 금지** — 같은 내용을 다른 표현으로 두 번 이상 쓰지 말 것. 앞에서 이미 한 말을 반복하는 문장은 삭제.
2. **사견 배제** — 개인적 해석이나 평가를 끼워넣지 말 것. 사용자가 실제로 한 말과 표현한 감정만 바탕으로 정리. 사용자가 하지 않은 생각을 대신 만들어 붙이지 말 것.
3. **늘어지지 않게** — 분량을 채우려고 미사여구나 뻔한 문장으로 늘리지 말 것. 필요한 만큼만 쓰고 끝낼 것.
4. **존댓말 금지** — `~습니다` `~합니다` `~하세요` `~입니다` 금지.
   평서형으로 쓴다. `~한다` `~했다` `~함` `~됨` 모두 허용. 명사형으로만 끝내라는 뜻이 아니다.
5. **자기 기능만 설명** — 어떤 항목의 설명란에는 그 항목이 하는 일만 쓴다.
   - 다른 항목이 뭘 맡는지, 여기서 안 되는 걸 어디로 가져가라는 안내는 **그 항목 설명란**에 쓴다.
   - `A로 안 되는 걸 하는 자리` 처럼 남을 기준으로 자기를 정의하지 말 것. 읽는 쪽이 A 설명을 먼저 봐야 이해되는 순환 구조가 된다.
   - 비교·우선순위를 꼭 써야 하면 상대 이름 대신 **자기 동작**으로 서술한다. (`1번보다 먼저 채택` ✗ → `토큰 조립보다 먼저 채택` ○)
6. **설명은 6하원칙** — 설명란·안내 문구 첫 문장에 `무엇을` `무엇으로` `어떻게` 가 다 들어가야 한다.
   - `컬럼명을 통째로 매칭하는 자리` ✗ — 무엇의 컬럼명인지, 무엇으로 바꾸는지가 없다.
   - `3번 컬럼 목록의 물리명을 논리명으로 바꿀 때, 컬럼명 전체를 통짜로 대응시키는 사전` ○
   - `~하는 자리` `~용` 같은 명사구로 대상·목적어를 생략하지 말 것.
