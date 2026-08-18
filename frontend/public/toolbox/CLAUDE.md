# toolbox — 폐쇄망 반입용 단일 파일 HTML 도구

사내 폐쇄망 PC에 HTML 파일 하나만 복사해서 바로 여는 개발 보조 도구 모음. 빌드 과정도 서버도 없고, 브라우저가 파일을 직접 연다.

여기 있는 파일은 Next.js 앱 코드가 아니다. `public/` 아래 정적 파일이라 프레임워크·번들러·npm 의존이 전혀 개입하지 않는다.

## 절대 규칙

1. **외부 CDN·npm 금지** — `<script src="https://...">`, 웹폰트, 외부 이미지 전부 금지. 폐쇄망에서는 로드 자체가 실패한다. 라이브러리가 필요하면 코드를 파일 안에 인라인으로 넣는다.
2. **파일 하나로 완결** — HTML·CSS·JS를 한 파일에 담는다. 도구를 여러 파일로 쪼개지 않는다.
3. **개인정보 localStorage 저장 금지** — 주민번호·사업자번호 등을 넣고 돌리는 입력칸(정규식 테스트 등)은 값을 저장하지 않는다. 스키마명·즐겨찾기처럼 개인정보가 아닌 설정만 저장한다.
4. **변경 이력은 `개선사항_메모.md`에 누적** — 각 도구 파일 상단에는 `<!-- 변경이력·개선메모: 개선사항_메모.md 참고 -->` 주석만 유지하고, 실제 이력은 메모 파일에 날짜와 함께 적는다.
5. **도구를 추가·개명·삭제하면 두 곳을 같이 고친다** — `개선사항_메모.md`의 파일 목록 표, 그리고 `toolbox.html` 런처 카드.

## 파일

```
toolbox.html   런처. 각 도구를 새 탭으로 여는 카드 목록
tools/         도구 본체 HTML
doc/           도구가 근거로 삼는 표준 문서 (예: 가운뎃점_공문서_표준.md)
db_docs/       DB 벤더 공식 매뉴얼 원본 + 어디를 볼지 알려주는 README.md
논리명_변환기_sample/   논리명_변환기 테스트 입력 세트
개선사항_메모.md        파일 현황 + 완료·예정 개선 항목
```

도구별 기능 설명과 도입 시점은 `개선사항_메모.md` 파일 목록 표에 있다. 작업 시작 전 그 표를 먼저 본다.

## 근거자료 참조 트리거

SQL·표준 용어를 다루는 도구는 기억으로 쓰지 말고 아래 문서를 먼저 연다. 벤더마다 딕셔너리 뷰 이름과 컬럼이 다르고, 방언별 함수 지원 범위도 갈린다.

| 무엇을 할 때 | 먼저 열 것 |
|---|---|
| `산출물_sql.html`·`sql_snippets.html`의 딕셔너리 뷰·시스템 카탈로그 쿼리를 추가·수정 | **`db_docs/README.md`** — 찾는 객체별로 어느 벤더 문서의 어느 파일인지 라우팅 표가 있다 |
| 방언별 함수 지원 여부·예약어 충돌 판단 | 같은 README의 라우팅 표. Tibero 함수는 `Tibero_SQL참조안내서/ch_sql_functions.html`, 예약어는 `appendix_reserved_words.html` |
| 딕셔너리 컬럼을 산출물 항목에 매핑 (최초등록일·최종수정자 등) | 같은 README의 **「확인된 사실」** 절 — `LAST_DDL_TIME` 신뢰 불가, `ALL_OBJECTS.CREATED` 사용 가능 등 실측이 누적돼 있다. 문서에 없는 내용이다 |
| `특수문자_모음.html`의 가운뎃점·구분점 항목 수정 | **`doc/가운뎃점_공문서_표준.md`** — 일반 공문서는 `·`(U+00B7), 법령은 `ㆍ`(U+318D)로 갈린다 |
| `논리명_변환기.html`의 표준단어·표준도메인·표준코드 규칙 변경 | 저장소 루트 **`doc/design-standards/README.md`** — 행안부 표준화지침(고시 제2023-18호)이 원문으로 있다 |

`db_docs/` 하위를 통짜로 grep하지 않는다. PDF 44MB와 SQL Server 마크다운 수천 개가 들어 있어 검색이 무의미하다. **README의 라우팅 표가 지목한 파일만 연다.**

## 검증 — 브라우저 없이 로직만 돌린다

빌드도 타입 검사도 없는 단일 파일이라, 고친 뒤 눈으로만 보면 회귀를 놓친다. 변환·계산·SQL 생성 로직을 고쳤으면 Node로 함수만 떼어 돌린다.

```js
// 임시 파일(작업 디렉터리 밖)에서
const html = require('fs').readFileSync('tools/jsp_formatter.html', 'utf8');
const src = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));

// DOM을 건드리는 함수가 섞여 있으면 최소 stub 을 얹는다
const el = () => ({ value:'', textContent:'', innerHTML:'', className:'', style:{},
                    classList:{ add(){}, remove(){} }, checked:true });
const stubs = {};
global.document = { getElementById: id => stubs[id] || (stubs[id] = el()), addEventListener(){} };
eval(src);

// 이후 formatJsp(...) 처럼 순수 함수를 직접 호출해 입력·기대출력 쌍으로 비교
```

입력 케이스를 여러 개 만들어 한 번에 돌리고, **통과·실패를 그대로 보고한다.** 실패를 남긴 채 작업을 끝내지 않는다. 성능이 걸리는 도구(수천 행 입력)는 소요 시간도 같이 잰다.

`jsp_formatter.html`은 화면의 **비교 탭** 자체가 검증기다. 포매팅 로직을 고쳤으면 대표 JSP를 넣고 구조 변경 0건인지 확인한다.

### 브라우저 실렌더 검증 — Puppeteer

위 Node 방식이 못 보는 것 — 실제 렌더, 클릭·복사·탭 전환 동작, 콘솔 에러 — 은 Puppeteer로 확인한다.
`C:/workspace/node_modules`에 설치돼 있다(크롬 바이너리 포함). 이 저장소 밖이라 절대경로로 require 한다.

```js
// 임시 파일(작업 디렉터리 밖)에서
const puppeteer = require('C:/workspace/node_modules/puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('JS 에러:', e.message));                      // 로드·동작 중 예외
  page.on('console', m => { if (m.type() === 'error') console.log('콘솔:', m.text()); });
  await page.goto('file:///C:/workspace/portfolio/frontend/public/toolbox/tools/도구.html');
  // page.click()·page.type()·page.evaluate() 로 UI 조작, page.screenshot() 으로 화면 캡처
  await browser.close();
})();
```

가려 쓰는 기준 — UI·레이아웃·이벤트 배선을 고쳤으면 Puppeteer, 변환·계산 로직만 고쳤으면 위 Node 방식이 더 빠르다.
스크린샷은 작업 디렉터리 밖에 저장한다.

**Puppeteer 스크립트는 경로·파일명에 한글이 없어야 한다** — 한글이 있으면 Node 22 + puppeteer require가
크래시한다(0xC0000005, 2026-08-18 실측). 업로드하는 데이터 파일(CSV)의 한글 경로는 문제없다.

`논리명_변환기.html`의 변환 로직을 고쳤으면 `node regress_logicalname.js`(toolbox 루트)를 돌린다 —
샘플 세트를 업로드·변환해 기대 수치(README와 한 몸)와 대조하는 회귀 점검이다.

`npm run lint`(ESLint)·`npm run typecheck`(tsc)·`npm run build`는 frontend 앱 코드 전용이라 이 폴더 HTML엔 안 걸린다.
localStorage 저장값을 읽는 도구는 오염된 값(깨진 JSON)을 넣고도 로드되는지까지 본다 — 최상위 `JSON.parse`는 try/catch 필수.

## 화면 스타일

VS Code 다크 테마를 기준으로 `:root`에 CSS 변수를 선언하고(`--bg` `--surface` `--border` `--text` `--muted` `--accent`) 그 변수만 써서 색을 지정한다. 폰트는 `'Consolas','D2Coding',monospace`. 새 도구도 같은 변수 이름과 팔레트를 그대로 쓴다.

`toolbox.html`은 `prefers-color-scheme: light`에서 밝은 팔레트로 전환한다.

## 문구

도구 안의 라벨·설명·안내 문구는 루트 [CLAUDE.md](../../../CLAUDE.md)의 글 작성 규칙을 따른다. 설명란 첫 문장에 `무엇을` `무엇으로` `어떻게`가 다 들어가야 한다.
