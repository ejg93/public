# 사이드바 개편 계획 — 2026-09-12

포트폴리오의 어필 포인트를 「결정과 검증이 기록으로 남는 개발」로 잡고, 사이드바 1~4번을 그 순서로 만든다.
이 파일은 실행 계획이다. **다 치면 지운다.** 진행 상태는 아래 각 항목의 체크박스에 적는다.

## 실행 세션이 먼저 읽을 것

1. 루트 `CLAUDE.md` 전체 — 특히 「글 작성 규칙」 4·7. **hook 이 켜져 있다**: 파일을 고칠 때마다 존댓말과 줄바꿈을 기계가 보고 걸리면 막는다(`scripts/doc-lint.sh`). 막히면 문구를 고치지 검사기를 끄지 않는다
2. `frontend/CLAUDE.md` — 스타일은 인라인 `style={{}}`, CSS 변수는 `--bg --surface --surface2 --border --text --muted --accent --accent2 --accent3 --sidebar-w`
3. `frontend/app/projectshop/page.tsx` — 카드·섹션·본문 스타일의 기준. 새 페이지는 이 톤을 따른다
4. 검증은 `bash scripts/verify.sh`(저장소 루트). 화면은 chrome-devtools MCP 로 `localhost:3000` 을 열어 1280·400 폭 스크린샷으로 본다

**건드리지 않는 것**: `frontend/public/notes/`·`game/`·`docrules/`. `public/toolbox/` 는 `toolbox.html` 을 **읽기만** 한다.

## 공통 규칙

- 항목 하나 = 커밋 하나. 순서는 아래 0→5. 5번(Sidebar)이 마지막인 이유는 링크할 라우트가 먼저 있어야 해서다
- 새 페이지의 데이터(카드 목록·링크)는 `page.tsx` 상단 상수 배열에 둔다. 두 문장 이상인 문자열은 `\n` 으로 끊고 `whiteSpace: 'pre-line'` 으로 그린다(`projectshop/page.tsx` 의 `S.body` 가 그 예)
- 저장소 링크는 상수로: `REPO_SHOP = 'https://github.com/ejg93/ProjectShop'`, `REPO_PORTFOLIO = 'https://github.com/ejg93/public'`, `REPO_CHUNKFRAME = 'https://github.com/ejg93/chunkframe'`. 파일 링크는 `${REPO}/blob/main/<경로>`
- 화면 문구는 평서형. 사용자에게 존댓말을 쓰는 화면이 아니다(포트폴리오 전체가 그렇다)
- **표 셀은 한 문장, 95폭 이내.** 줄바꿈 lint 가 tsx 의 `<td>` 도 본다. 긴 인용문은 셀에 넣지 말고 카드 안 `<pre>` 로 — lint 가 `<pre`·`<code` 줄은 건너뛴다
- 인용문은 **PLAN 에 적힌 원문 그대로** 쓴다. 지어내거나 다듬지 않는다 — 실제로 찍히는 메시지라는 것이 증거의 값이다

## 0. 공통 컴포넌트 추출  [ ]

`projectshop/page.tsx` 의 `S`(h2·card·body)와 `Section` 을 `frontend/components/CaseStudy.tsx` 로 옮기고 export 한다. `projectshop/page.tsx` 는 import 로 바꾼다. 1·2·3 페이지가 같은 것을 쓴다.

닫힘: `verify.sh` 초록, `/projectshop` 화면이 전과 같다.

## 1. `/projectshop` — 추적 흐름 한 줄기  [ ]

**왜**: 지금 페이지는 숫자·ADR 넷·CI 목록으로 흩어져 있다. 심사자가 3분 안에 이해하려면 「법 → 제약 → 테스트 → CI」 한 줄기를 따라가게 해야 한다.

**어디에**: 「저장소 실측」 섹션 바로 뒤, 「01 · 왜 이 주제를 골랐나」 앞에 `00 · 한 줄기로 따라가기` 섹션.

**내용** — 세로로 이어진 카드 4장. 각 카드에 단계 라벨, 한 줄 설명, GitHub 파일 링크(새 탭). 사실은 전부 ProjectShop 저장소에서 확인했다:

| 단계 | 설명(이 사실만 쓴다) | 링크 경로(`REPO_SHOP/blob/main/…`) |
|---|---|---|
| 법 | 전자상거래법 제15조제1항 — 공급 약정이 없으면 결제일부터 3영업일 안에 발송. 요건표 R21 | `doc/reference/commerce-compliance.md` |
| DB 제약 | `V26__supply_deadline.sql` — `seller_order.supply_lead_days` 를 `not null default 3` 으로, `check (0~60)` 으로 박고, `ship_due_at` 을 결제 승인 때 박제한다 | `backend/src/main/resources/db/migration/V26__supply_deadline.sql` |
| 테스트 | `ShipDeadlineTest` — 기한 계산과 미발송 판정을 고정한다 | `backend/src/test/java/com/projectshop/shop/order/ShipDeadlineTest.java` |
| CI·화면 | `ci.yml` backend 잡이 push 마다 `./gradlew build` 로 그 테스트를 돌린다. 화면은 `checkout/summary.tsx` 가 기한을 고지한다 | `.github/workflows/ci.yml`, `frontend/src/app/checkout/summary.tsx` |

카드 아래 한 줄: 「요건 40개가 전부 이 모양으로 이어지지는 않는다 — 아래 04 의 숫자가 그 구멍이다.」

**같이 고칠 것**: 「04 · 아직 안 닫힌 것」의 숫자를 **40개 중 14개**로 바꾼다(`scripts/req-coverage.sh` 2026-09-12 실측. 페이지의 37/12 는 낡았다). 문장은 그대로, 숫자만.

닫힘: 링크 6개가 전부 200 (curl -I 로 확인), `verify.sh` 초록, 1280·400 폭 스크린샷.

### 1-b. 「저장소 실측」 숫자를 GitHub 에서 받아온다  [ ]

**왜**: 박힌 숫자는 하루 만에 낡는다(590→594). 공개 저장소라 GitHub REST API 가 토큰 없이도 열려 있다.

**필수 항목이다.** 1번을 치면 1-b 까지 쳐야 닫힌다 — 박힌 숫자를 남기는 것이 이 항목의 실패 조건이다.

**방식**: 서버 컴포넌트 + ISR(15분). `page.tsx` 에서 `'use client'` 를 뗀다(상호작용이 없다). 데이터 함수는 `frontend/lib/github.ts`:

```ts
const REPO = 'ejg93/ProjectShop'
const opt = { headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}, next: { revalidate: 900 } }
```

| 숫자 | 호출 | 세는 법 |
|---|---|---|
| 커밋 | `GET https://api.github.com/repos/${REPO}/commits?per_page=1` | 응답 `Link` 헤더에서 `page=(\d+)>; rel="last"` 의 숫자 |
| ADR | `GET …/git/trees/main?recursive=1` 한 번 | `tree[].path` 가 `doc/adr/` 로 시작하고 `.md` |
| 마이그레이션 | 같은 응답 | `backend/src/main/resources/db/migration/V*.sql` |
| 기술 문서 | 같은 응답 | `doc/` 아래 `.md` |
| 테스트 파일 | 같은 응답 | `backend/src/test/**/*Test.java` + `frontend/src/**/*.test.ts(x)` + `frontend/e2e/**/*.spec.ts` |
| CI 워크플로 | `GET …/actions/workflows` | `total_count` |
| 갱신 시각 | `GET …/repos/${REPO}` | `pushed_at` |

| 최근 커밋 5개 | `GET …/commits?per_page=5` | `commit.message` 첫 줄 · `commit.author.date` · `sha` 앞 7자 · `html_url` |

호출 5번. `tree` 응답의 `truncated` 가 true 면 실패로 친다.

**「지금 상황」 절 신설** — 「저장소 실측」 섹션 바로 아래. 최근 커밋 5개를 한 줄씩: `YYYY-MM-DD` · 메시지 첫 줄(60자 넘으면 `…`) · `sha` 7자(링크). 숫자보다 「오늘 무엇을 했나」가 진행 중이라는 증거다. 이 호출이 실패하면 절을 통째로 숨긴다(fallback 없음).

**fallback**: 어느 호출이든 실패하면(429·403 포함) 지금 `METRICS` 에 박힌 반올림 값을 쓴다. 상수 배열은 `FALLBACK` 으로 이름을 바꿔 남긴다.
섹션 라벨: 성공이면 `저장소 실측 · GitHub · <pushed_at 을 YYYY-MM-DD 로>`, 실패면 지금처럼 `저장소 실측 · 2026-09 기준`. 숫자는 성공 시 정확값(반올림 안 함).

**토큰**: 무인증 한도가 IP 당 60회/시라 Vercel 공용 IP 에서 막힐 수 있다. Vercel Project Settings 에 `GITHUB_TOKEN`(fine-grained, public repo read 만, 만료 1년) 을 넣는다 — **`NEXT_PUBLIC_` 접두 금지**, 서버에서만 읽는다. `.env.local` 에도 같은 이름. `frontend/CLAUDE.md` 환경변수 표에 행 추가: 「없어도 동작한다. 없으면 무인증 60회/시」.

**요건 커버리지(40개 중 14개)는 API 로 못 받는다** — `req-coverage.sh` 가 계산하는 값이라 저장소 파일에 없다. 이번엔 손 숫자 유지. 나중에 ProjectShop CI 가 결과를 `doc/metrics.json` 으로 남기면 그때 같은 fetch 에 얹는다.

닫힘: 로컬 `npm run build` 때 GitHub 에서 숫자를 받아 594 같은 정확값이 뜨고 「지금 상황」에 오늘 커밋이 보인다. 토큰 없이도 뜬다. 네트워크를 끊고 빌드해도(또는 `REPO` 를 없는 이름으로 바꿔) fallback 숫자와 「2026-09 기준」 라벨로 떨어지고 「지금 상황」은 안 보인다. `verify.sh` 초록. **배포 뒤 ProjectShop 에 커밋을 하나 밀고 15분 뒤 포폴 페이지에 그 커밋이 뜨는지 본다** — 이것이 실시간 연동의 최종 확인이다.

## 2. `/workflow` — HOW I WORK  [ ]

**왜**: ProjectShop 의 진짜 차별점은 쇼핑몰이 아니라 「규칙을 기계가 지키게 만든 작업 방식」이다. 이 페이지가 그것을 한 자리에 모으고, `chunkframe` 으로 「재사용 가능한 방법」임을 보인다.

**파일**: `frontend/app/workflow/page.tsx`. `'use client'` 불필요(정적). `CaseStudy` 컴포넌트 사용.

**구성**

헤더 — 라벨 `METHOD`, 제목 `HOW I` / `WORK`(projectshop 헤더와 같은 2행 display). 부제 한 줄: 「규칙은 문서에 적는 것으로 끝나지 않는다 — 어기면 기계가 막는다.」

`01 · 세션의 뼈대` — 카드 4장 가로(auto-fit 그리드): 예열 / 청크 / 마무리 / 점검. 각각 한 줄. 출처는 `public/study/ai-workflow-notes.html` 의 `<h1>세션의 뼈대</h1>` 절 — **그 절을 읽고 한 줄씩 요약**한다. 카드 아래 링크: 「전체 노트 →」 `/study/ai-workflow-notes`.

`02 · 기계가 막는 것` — **카드 6장 세로**(표가 아니다 — 인용문이 길어 셀에 못 넣는다). 카드 하나 = 제목 한 줄 / 「언제」 한 줄 / **막힐 때 실제로 찍히는 메시지**를 `<pre>` 로 / 파일 링크. 설명문은 제목·언제 두 줄로 끝내고, 나머지는 인용문이 말하게 둔다 — 배선도(`settings.json`)가 아니라 알람이 울린 기록이 증거다.

인용문은 아래 원문 그대로. `$fail`·`${o}` 같은 변수 자리는 괄호 안 예시값으로 바꾼다.

| # | 제목 | 언제 | 인용문(그대로) | 링크 |
|---|---|---|---|---|
| 1 | 커밋 안 된 작업물이 있으면 세션이 못 멈춘다 | Stop hook | `커밋 안 된 작업물이 있다 — 청크 하나 = 커밋 하나, 미완이면 WIP 커밋을 남긴다(CLAUDE.md 「청크 규칙」). 버릴 것이면 git stash 로 치운다.` | `REPO_SHOP/blob/main/.claude/settings.json` |
| 2 | 검증이 초록이 아니면 push 가 안 나간다 | `git push` 직전 | `full 도장이 없다: backend — push 앞엔 bash scripts/verify.sh --full (느린 레인·next build) 이 HEAD 에서 초록이어야 한다(2z-2).` | 같은 파일 + `REPO_SHOP/blob/main/scripts/verify.sh` |
| 3 | PR 은 main 을 base 로, 한 번에 하나만 | `gh pr create` 직전 | `PR 의 base 는 언제나 main 이다(2g-1). 쌓아 올리면 아래가 머지될 때 GitHub 이 base 없는 PR 을 닫고, 닫힌 PR 은 reopen 도 base 변경도 안 된다.` 와 `열린 작업 PR 이 1 개 있다. 직렬로 간다(2g-1) — 앞 PR 을 머지하고 다음 묶음을 연다.` | 같은 파일 |
| 4 | 문서가 부서지면 저장 직후 막힌다 | 문서를 고친 직후 | `[제목에 날짜] doc/reference/money-rules.md — 기준 문서는 「지금 무엇이 맞나」만 답한다. 이력은 PROGRESS.md 로(doc/README.md):` 와 `[존댓말] CLAUDE.md — 개발자가 읽는 글은 평서형이다(CLAUDE.md 「글 작성 규칙」 4번):` | `REPO_SHOP/blob/main/scripts/doc-lint.sh` |
| 5 | 법 요건 중 테스트가 안 부르는 것을 센다 | 점검 때. 게이트가 아니라 리포트 | `테스트가 언급하지 않는 요건: 14/40 — R2 R10 R12 R13 R23 R26 R27 R29 R30 R31 R33 R35 R38 R39` | `REPO_SHOP/blob/main/scripts/req-coverage.sh` |
| 6 | 이 포트폴리오도 같은 방식이다 — 글 규칙을 고친 줄에서 잡는다 | 파일을 고친 직후 | `[줄바꿈] frontend/app/projectshop/page.tsx — 고친 줄이 규칙 7에 걸린다(CLAUDE.md 「글 작성 규칙」 7):` 다음 줄 `40: A 조각 109폭 > 95 — 의미 단위에서 <br /> 또는 \n 으로 끊는다` | `REPO_PORTFOLIO/blob/main/scripts/linebreak-lint.js` |

6번 카드 밑에 한 줄: 「검사기를 붙인 직후 hook 이 40번 줄을 잡았다. 오탐이었고, 검사기를 고쳤다 — 2026-09-12.」 (사실이다. 이 세션에서 일어났다.)

`03 · 기록은 재발을 못 막고 강제 지점은 막는다` — 카드 1장, 아래 세 문장 **그대로**(ProjectShop `CLAUDE.md` 의 사례를 청크 번호 없이 옮긴 것이다. 밖에서 읽히게 번호만 뺐고 사실은 같다):

「뷰가 컬럼을 굳힌다」는 함정을 진행 로그에만 적었더니 다음 날 같은 자리를 다시 밟았다.<br />
같은 내용을 대조 테스트로 내리자 그다음 마이그레이션에서 바로 잡혔다.<br />
기록은 재발을 못 막고 강제 지점은 막는다.

`04 · 템플릿` — 카드 1장. `chunkframe` 은 ProjectShop 에서 도메인(커머스·한국법)을 빼고 메커니즘만 남긴 틀. 들어있는 것 넷: `CLAUDE.md`(세션 생명주기·라우팅 표·규칙 우선순위), `PLAN.md`/`PROGRESS.md` 빈 틀, `doc/reference/document-map.md`, `scripts/doc-lint.sh`. 링크 `REPO_CHUNKFRAME`. 출처는 그 저장소 README — 거기 적힌 것만 쓴다.

닫힘: 링크 전부 200, `verify.sh` 초록, 스크린샷 2폭. `frontend/CLAUDE.md` 라우트 표에 `/workflow` 행.

## 3. `/toolbox` — 앱 셸 안의 도구 소개  [ ]

**왜**: 폐쇄망 단일 HTML 도구 7종·행안부 표준·Tibero/Oracle 딕셔너리는 공공 SI 심사자에게 가장 직접적인 증거인데 지금은 about 칩 하나로만 들어간다.

**지금 구조**: `next.config.js` 가 `/toolbox` → `/toolbox/toolbox.html`(정적 런처), `/tools/:path*` → `/toolbox/tools/:path*` 로 rewrite. 런처의 카드 목록은 `toolbox.html` 52~65행의 JS 배열(`{ file: "tools/…", icon: "…", name: "…", … }`)이다.

**원칙**: 도구 목록의 단일 진실은 `toolbox.html` 이다(toolbox/CLAUDE.md 규칙 5). **세 번째 사본을 만들지 않는다** — 페이지가 빌드 때 그 파일을 읽어 목록을 뽑는다.

**파일**: `frontend/app/toolbox/page.tsx`. 서버 컴포넌트. `fs.readFileSync(path.join(process.cwd(), 'public/toolbox/toolbox.html'), 'utf8')` 로 읽고, 정규식으로 `file`·`icon`·`name`·`desc` 를 뽑는다. **먼저 `toolbox.html` 50~70행을 열어 객체 모양을 확인하고 정규식을 맞춘다.** 뽑힌 항목이 7개가 아니면 `throw` — 조용히 빈 목록을 내지 않는다.

**구성**
- 헤더 — 라벨 `CLOSED_NET`, 제목 `TOOL` / `BOX`. 부제: 「사내 폐쇄망 PC 에 HTML 파일 하나만 복사해서 여는 개발 보조 도구. 빌드도 서버도 없다.」
- `01 · 절대 규칙` — 카드 3장 가로: 외부 CDN·npm 금지 / 파일 하나로 완결 / 개인정보 localStorage 저장 금지. 출처 `public/toolbox/CLAUDE.md` 「절대 규칙」 1~3 — 그 문장을 줄여 쓴다
- `02 · 도구` — 파싱한 7개를 카드로. **카드를 누르면 빈 입력칸이 뜨는 도구가 있다**(논리명 변환기는 CSV 셋을 넣어야 돌고, 산출물 SQL 은 결과를 DB 에서 돌려야 의미가 있다). 그래서 카드 하나에 링크를 셋으로 나눈다:
  - **열기** — `/tools/<파일명>` 새 탭. `file` 값에서 `tools/` 접두를 떼고 `/tools/` 를 붙인다. 한글 파일명은 `encodeURI`
  - **샘플** — 논리명 변환기 카드에만. `/toolbox/논리명_변환기_sample/` 아래 CSV 넷과 README 링크(경로는 `encodeURI`). 이 넷은 상수로 박는다 — 샘플 세트는 거의 안 바뀐다:
    `행정안전부_공공데이터 공통표준단어_20251101.csv` · `샘플_기관표준단어.csv` · `샘플_컬럼목록1000개.csv` · `보조_공통약어사전.csv` · `샘플_컬럼목록1000개_README.md`
  - **한 줄 안내** — 카드 본문. 런처의 `desc` 를 그대로. 산출물 SQL 카드에는 「DB 없이도 SQL 은 생성되고 복사할 수 있다」 한 줄을 덧붙인다
- `02` 위에 **「먼저 해볼 것」 카드 1장** — 방문자가 3분 안에 결과를 보게 하는 경로. 세 줄: ① 논리명 변환기를 연다 ② 샘플 CSV 셋(공통표준단어 → 1번, 기관표준단어 → 2번, 컬럼목록 → 3번)을 넣는다 ③ 결과표 상단에 `컬럼 944 · 완전매칭 589 (56.2%)` 가 나오면 정상. 이 숫자는 샘플 README 의 기대 수치다 — README 가 바뀌면 여기도 바꾼다(주석으로 적어 둔다)
- `03 · 근거 자료` — 카드 2장: 행안부 공공데이터 표준화 지침(`REPO_PORTFOLIO/blob/main/doc/design-standards/README.md`) / DB 벤더 딕셔너리 라우팅(`REPO_PORTFOLIO/blob/main/frontend/public/toolbox/db_docs/README.md`). 각각 「논리명 변환기가 / 산출물 SQL 이 무엇에 쓰나」 한 줄
- 맨 아래 링크: 「런처 원본 열기 →」 `/toolbox/toolbox.html` 새 탭

**`next.config.js`**: `/toolbox` → `toolbox.html` rewrite 를 **지운다**(앱 라우트가 그 자리를 받는다). `/tools/:path*` 는 남긴다. about 칩 `tool:/toolbox` 는 그대로 동작한다.

닫힘: `/toolbox` 가 앱 셸(사이드바 포함)로 뜨고 카드 7개, 카드 클릭 시 도구가 새 탭에서 열린다. `/toolbox/toolbox.html` 직접 접근도 된다. `verify.sh` 초록. `frontend/CLAUDE.md` 라우트 표에 `/toolbox` 행, `public/toolbox/CLAUDE.md` 「파일」 절에 「`app/toolbox/page.tsx` 가 이 런처 배열을 빌드 때 읽는다 — 객체 키(`file`·`icon`·`name`·`desc`)를 바꾸면 그 정규식도 고친다」 한 줄.

## 4. `/study` — 학습 노트 색인을 라우트로  [ ]

**왜**: 노트 한 장 추가할 때 HTML·`index.html` NOTES 배열·`next.config.js` rewrite 세 곳을 고친다. 파일 하나가 단일 진실이면 안 어긋난다.

**지금**: `public/study/` 에 노트 5장 + 손으로 짠 `index.html`. rewrite 는 `/study` → `index.html` 과 노트별 5쌍.

**단계**
1. 노트 5장 `<head>` 에 메타 추가. `description` 은 `index.html` 137~165행 NOTES 배열의 `desc` 를 **그대로** 옮긴다. `keywords` 는 `tags` 를 `,` 로 이어서. `date` 는 그 파일이 처음 커밋된 날 — `git log --diff-filter=A --format=%ad --date=short -- <파일>`:
   ```html
   <meta name="description" content="…">
   <meta name="keywords" content="청크,강제 지점,…">
   <meta name="date" content="2026-09-12">
   ```
2. `frontend/app/study/page.tsx` 서버 컴포넌트. `fs.readdirSync('public/study')` 에서 `.html` 만, `index.html` 제외. 각 파일에서 `<title>`·`description`·`keywords`·`date` 를 정규식으로 뽑는다. `date` 내림차순. 하나라도 `description` 이 없으면 `throw`. 카드: 제목 / 설명 / 태그 칩 / 링크 `/study/<slug>` (slug = 파일명에서 `.html` 뗀 것)
3. `next.config.js`: `/study` rewrite 와 노트별 5쌍을 지우고 `{ source: '/study/:slug', destination: '/study/:slug.html' }` 하나로
4. `public/study/index.html` 삭제. 노트 HTML 안에 `/study` 로 돌아가는 링크가 있으면 그대로 둔다(앱 라우트가 받는다)

닫힘: `/study` 에 카드 5장이 날짜순으로, 각 카드가 노트로 간다. `/study/ai-workflow-notes` 같은 직접 URL 도 된다. `verify.sh` 초록. `frontend/CLAUDE.md` 라우트 표에 `/study` 행(「목록은 `public/study/*.html` 의 메타에서 빌드 때 만든다. 노트 추가 = HTML 한 장 + 메타 셋」).

## 5. Sidebar 최종 배열 + 문서  [ ]

`frontend/components/Sidebar.tsx` 의 `menus` 를 아래로 바꾼다. `EXPERIMENT_0x` 라벨은 스스로 실험이라 깎아 부르는 셈이라 없앤다.

```ts
const menus = [
  { label: 'HOME',         href: '/',            icon: '⌂', desc: 'INTRO' },
  { label: 'ABOUT ME',     href: '/about',       icon: '◉', desc: 'PROFILE' },
  { label: 'PROJECT SHOP', href: '/projectshop', icon: '▤', desc: 'CASE_STUDY' },
  { label: 'HOW I WORK',   href: '/workflow',    icon: '⚙', desc: 'METHOD' },
  { label: 'TOOLBOX',      href: '/toolbox',     icon: '🧰', desc: 'CLOSED_NET' },
  { label: 'STUDY NOTES',  href: '/study',       icon: '✎', desc: 'NOTES' },
  { label: 'DEV LOG',      href: '/board',       icon: '✍', desc: 'LOG' },
  { label: 'AI BATTLE',    href: '/ai-battle',   icon: '⚔', desc: 'LAB' },
  { label: 'YT COMMENTS',  href: '/youtube',     icon: '▶', desc: 'LAB' },
]
```

`active` 판정이 `path.startsWith(m.href)` 라 `/study/...`·`/toolbox/...` 도 켜진다. 그대로 둔다.

같이 고칠 것: 루트 `README.md` 「기능」 표에 `/projectshop`·`/workflow`·`/toolbox`·`/study` 행. `frontend/app/page.tsx` 홈의 카드 둘(PROJECT SHOP·AI BATTLE)은 그대로.

닫힘: 사이드바 9개 링크가 전부 200, 접힌 상태(60px)에서 아이콘만 보이고 `title` 로 라벨이 뜬다. `verify.sh` 초록. 스크린샷 2폭.

## 끝나면

- 이 파일을 지우고 memory 의 `plan-study-sidebar` 도 지운다
- 푸시하면 Vercel 이 `main` 을 배포한다. Railway 는 무관
