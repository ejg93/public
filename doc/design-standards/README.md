# 설계 표준 참고문서 (doc/design-standards/)

공통코드 등 DB/시스템 설계할 때 근거로 삼을 공식 문서 모음. `frontend/`, `backend/` 문서와 달리
이 포트폴리오가 실제로 쓰는 기술이 아니라 **일반 설계 원칙 참고자료**임 — 다른 프로젝트(디케어 등) 설계할 때도 재사용.

각 시스템/프로젝트별 세부 지침(예: 디케어 자체 코드체계 규칙)은 여기 넣지 말고 해당 프로젝트 메모에 따로 기록.

## 다운로드된 원문 — [references/](references/)

| 파일 | 발행처 | 내용 | 원문 링크 |
|---|---|---|---|
| [01_공공기관_데이터베이스_표준화지침.pdf](references/01_공공기관_데이터베이스_표준화지침.pdf) | 행정안전부 (고시 제2023-18호) | 공공기관 DB 표준화 규정 원문. 표준단어/도메인/코드 관리 원칙 | [mois.go.kr](https://www.mois.go.kr/cmm/fms/FileDown.do?atchFileId=FILE_00117321l32l02P&fileSn=0) |
| [02_공공데이터베이스_표준화_관리_매뉴얼.pdf](references/02_공공데이터베이스_표준화_관리_매뉴얼.pdf) | 한국지능정보사회진흥원 (2021.06) | 위 지침 실무 매뉴얼. 코드 명명규칙·분류체계 예시 다수 (243p) | [cisp.or.kr](https://www.cisp.or.kr/wp-content/uploads/2021/12/%EA%B3%B5%EA%B3%B5%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4_%ED%91%9C%EC%A4%80%ED%99%94_%EA%B4%80%EB%A6%AC_%EB%A7%A4%EB%89%B4%EC%96%BC_202106.pdf) |
| [03_eGovFrame_공통컴포넌트_적용가이드_2.0.pdf](references/03_eGovFrame_공통컴포넌트_적용가이드_2.0.pdf) | 전자정부 표준프레임워크센터 | 공통컴포넌트(코드관리·게시판 등) 설계/적용 가이드 (1346p) | [egovframe.go.kr](https://www.egovframe.go.kr/cmm/file/readDownloadFile.do?fileId=FILE_000000000010684&fileSn=0) |
| [04_eGovFrame_호환성확인_가이드라인.pdf](references/04_eGovFrame_호환성확인_가이드라인.pdf) | 전자정부 표준프레임워크센터 (2024.11) | 버전 호환성 확인 절차 (보조자료, 코드설계와 직접 관련은 적음) | [maven.egovframe.go.kr](https://maven.egovframe.go.kr/publist/HDD1/public/documents/%ED%98%B8%ED%99%98%EC%84%B1%ED%99%95%EC%9D%B8_%EA%B0%80%EC%9D%B4%EB%93%9C%EB%9D%BC%EC%9D%B8_20241114.pdf) |

> 다운로드일: 2026-07-24. 정부/공공 배포 자료 원문 그대로 보관 — 별도 요약·재가공 안 함.

## 다운로드 불가 — 필요시 유료 열람

| 표준 | 이유 |
|---|---|
| ISO/IEC 11179 (메타데이터 레지스트리 표준) | ISO 유료 표준. 그룹코드/상세코드 개념의 국제표준 원류. 필요시 [iso.org](https://www.iso.org/standard/78914.html)에서 구매 |

## 코드관리 실제 구현 참고 (문서 아닌 소스코드)

전자정부 표준프레임워크 공통컴포넌트 저장소에 분류코드/공통코드/상세코드 관리 기능이 실제 구현체로 있음.
문서보다 실물 스키마·서비스 계층 구조 보고 싶으면 참고:
[github.com/eGovFramework/egovframe-common-components](https://github.com/eGovFramework/egovframe-common-components)

## 참고 시 주의

- 이 폴더 PDF들은 공공 배포 자료 원문 — 저작권은 각 발행처(행안부/NIA/eGovFrame센터)에 있음. 재배포·상업적 가공 전 출처 명시.
- 레포가 공개(Vercel 배포용) 저장소라 PDF 용량(총 ~6.7MB) 커밋 여부는 별도 확인 필요 — git에 안 올리고 로컬 참고용으로만 둘지 결정할 것.
