# DB 공식 문서 (산출물_sql.html 5방언 대응)

> 2026-07-14 수집. `산출물_sql.html`의 방언 탭 5종에 대응하는 벤더 공식 레퍼런스.
> 오프라인 보관용 — 폐쇄망 반입 전 사내 보안정책 확인할 것.

## 파일 목록

| 방언 | 파일/폴더 | 형식 | 출처 |
|------|-----------|------|------|
| **Tibero/Oracle** | `Tibero_참조안내서/` | HTML (오프라인) | technet.tmax.co.kr (pver-20240502) |
| | `Tibero_SQL참조안내서/` | HTML (오프라인) | 동일 |
| **MySQL/MariaDB** | `MySQL_8.0_레퍼런스매뉴얼.pdf` | PDF 44MB | downloads.mysql.com |
| **PostgreSQL** | `PostgreSQL_17_공식매뉴얼.pdf` | PDF 15MB | postgresql.org |
| **SQL Server** | `SQLServer_시스템카탈로그뷰/` | Markdown | github.com/MicrosoftDocs/sql-docs (sparse) |
| **Sybase ASE** | `SybaseASE_16_시스템테이블_레퍼런스.pdf` | PDF 3MB | help.sap.com (ASE 16.0 SP04) |

## 산출물 작업 시 어디를 볼 것인가

| 찾는 것 | 문서 | 위치 |
|---------|------|------|
| `ALL_TABLES`·`ALL_TAB_COLUMNS`·`ALL_CONSTRAINTS` 등 딕셔너리 뷰 컬럼 명세 | Tibero 참조안내서 | `ch_static_view.html` |
| `V$INSTANCE`·`V$DATABASE` 등 동적 뷰 | Tibero 참조안내서 | `ch_dynamic_view.html` |
| 데이터 딕셔너리 개념·`ALL_`/`DBA_`/`USER_` 차이 | Tibero 참조안내서 | `ch_data_dictionary_concept.html` |
| `REGEXP_LIKE` 등 함수 지원 범위·문법 | Tibero SQL참조안내서 | `ch_sql_functions.html` |
| 예약어 (테이블/컬럼명 충돌 확인) | Tibero SQL참조안내서 | `appendix_reserved_words.html` |
| `sys.tables`·`sys.columns`·`sys.extended_properties` | SQL Server | `docs/relational-databases/system-catalog-views/` |
| `INFORMATION_SCHEMA.*` | SQL Server | `docs/relational-databases/system-information-schema-views/` |
| `sysobjects`·`syscolumns`·`systabstats` | Sybase ASE PDF | 시스템 테이블 장 |
| `information_schema.TABLES/COLUMNS` | MySQL PDF | INFORMATION_SCHEMA 장 |
| `pg_class`·`pg_attribute`·`pg_constraint` | PostgreSQL PDF | System Catalogs 장 |

## 확인된 사실 (2026-07-14 작업 중)

- **Tibero 6 `REGEXP_LIKE`**: 함수는 존재. 단 정규식 엔진이 Oracle보다 제한적 —
  그룹 내 교대(`(a|b)`) 사용 시 `JDBC-11042: Invalid regular expression` 발생 사례 있음.
  괄호 짝이 안 맞아도 같은 에러. 복잡한 패턴은 `LIKE ... ESCAPE '\'` 로 분해하는 게 안전.
- **`LAST_DDL_TIME`**: DDL 외에 GRANT·COMMENT·인덱스 생성·통계수집에도 갱신됨.
  "테이블 구조 최종 변경일"로 신뢰 불가. 값 분포 확인 후 사용 여부 판단할 것.
- **`ALL_OBJECTS.CREATED`**: 실제 생성 시각 — 신뢰 가능. `최초등록일`에 사용 가능.
- **최종수정자/변경구분**: DB 딕셔너리에 없음. 감사(auditing) 미설정 시 복원 불가 —
  작성자명·`신규` 일괄 기입 + 사유 명시가 표준 처리.

## 미수집

- **MariaDB 전용 매뉴얼**: 단일 PDF 배포 없음 (mariadb.com/kb 웹 전용).
  MySQL 8.0 PDF로 대부분 호환. 차이 나는 부분만 웹 확인.
- **Tibero 기타 안내서** (관리자/유틸리티): technet 로그인 필요분은 미수집.
  `pver-20240502-000002/` 아래 다른 경로에 있을 수 있음.
