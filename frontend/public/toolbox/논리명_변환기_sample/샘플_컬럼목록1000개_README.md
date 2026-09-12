# 논리명_변환기 샘플 세트 — 형식과 기대 수치 (회귀 기준)

`논리명_변환기.html`을 고친 뒤 이 세트를 돌려 아래 수치가 그대로 나오는지 확인한다.
수치가 어긋나면 로직 회귀다. 자동 점검은 toolbox 루트의 `regress_logicalname.js` 참고(git 제외, 로컬 전용).

> 2026-08-18 재작성. 샘플 CSV가 통째로 재생성되면서 이전 README의 기대 수치(완전매칭 99% 등)는 무효가 됐다.
> 아래 수치는 현 샘플 실측 기준이다. **샘플 CSV를 다시 만들면 이 문서와 `회귀_점검.js`의 EXPECT를 같이 갱신할 것.**

## 파일 구성

| 파일 | 내용 | 투입 위치 |
|---|---|---|
| `행정안전부_공공데이터 공통표준단어_20251101.csv` | 행안부 공통표준단어 3,283행 | 1번 공통표준단어 |
| `샘플_기관표준단어.csv` | 기관표준단어 111행 (`물리명,논리명` 2열) | 2번 기관표준단어 |
| `샘플_컬럼목록1000개.csv` | 컬럼목록 996 데이터행 · distinct 컬럼 944 · distinct 테이블 104 | 3번 컬럼 목록 |
| `보조_공통약어사전.csv` | 미등록 약어 수기 보완용 보조 사전 | 5번 랭킹에서 수기 참조 |

`generate_sample.js`(생성기)·`project_erd.md`(ERD 설계 근거)는 git 제외 파일.

## 컬럼목록 형식

헤더: `OWNER,TABLE_NAME,COLUMN_ID,COLUMN_NAME,DATA_TYPE,DATA_LENGTH,DATA_SCALE,NULLABLE,DATA_DEFAULT,COMMENTS,IS_PK,PK정보,AK정보,FK정보,개인정보여부_추정`

열 자동 인식이 OWNER(1열)·TABLE_NAME(2열)·COLUMN_NAME(4열)을 잡아야 정상.
같은 컬럼이 여러 행에 반복될 수 있고(996행 → 944 distinct), 도구가 (OWNER,TABLE,COLUMN) 기준으로 중복 제거한다.

## 기대 수치 — 결과표 상단 stats 기준

전제: 무시토큰 `TB`, 직접입력 사전 비움(localStorage `lnUserDict` 없음), 토큰 조회 우선순위 기본값.

| 항목 | 기대값 |
|---|---|
| 컬럼 | **944** |
| 테이블 | **104** |
| 완전매칭 | **589 (56.2%)** |
| 혼합 | 71 (6.8%) |
| 부분 | 368 (35.1%) |
| 미매칭 | 20 (1.9%) |

미등록 약어 랭킹 상위(5번 카드): `UPD 208 · ORD 38 · TEL 26 · EMAIL 26`.
이 약어들은 랭킹·수기 보완 기능 시연용으로 일부러 사전에 안 넣은 것이다 — 사전에 추가하면 기대 수치가 무너진다.

## 회귀 점검 실행

```
cd toolbox
node regress_logicalname.js
```

Puppeteer(`C:/workspace/node_modules`, 크롬 포함)가 있어야 돈다. PASS/FAIL과 어긋난 항목을 출력한다.
스크립트가 toolbox 루트에 있는 이유 — 스크립트 경로에 한글이 있으면 Node 22 + puppeteer require가 크래시한다(0xC0000005).
샘플 CSV처럼 데이터로만 쓰는 파일은 한글 경로여도 된다.
