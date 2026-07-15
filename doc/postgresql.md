# PostgreSQL

## 개요

오픈소스 RDBMS. Oracle 실무 경험 기준으로 보면 "라이선스 비용 없는 Oracle 대체재 중 가장 기능이 풍부한 것"에 가깝다. 표준 SQL 준수도가 높고, 시퀀스·윈도우 함수·CTE(WITH 절) 등 Oracle에서 쓰던 기능 대부분이 있다. 클라우드 서비스들(Railway, Supabase, AWS RDS 등)이 기본 제공하는 DB라 사이드 프로젝트 표준처럼 쓰인다.

### Oracle과 주요 차이 (실무자 관점)

| 항목 | Oracle | PostgreSQL |
|---|---|---|
| 빈 문자열 | `''` = NULL 취급 | `''`와 NULL 구분 |
| 시퀀스 | `seq.NEXTVAL` | `nextval('seq')` 또는 `SERIAL`/`IDENTITY` 컬럼 |
| DUAL | `SELECT 1 FROM DUAL` | `SELECT 1` (FROM 불필요) |
| NVL | `NVL(a,b)` | `COALESCE(a,b)` |
| ROWNUM | `ROWNUM <= 10` | `LIMIT 10 OFFSET 0` |
| 문자열 결합 | `||` | `||` (동일) |

## 이 프로젝트에서

- 호스팅: **Railway Postgres 플러그인** — 대시보드에서 붙이면 접속 정보가 환경변수로 주입됨
- 접속 설정: `spring.datasource.*` (`application.properties`, Railway Variables에 동일 등록)
- 드라이버: `org.postgresql:postgresql` (pom.xml, runtime 스코프)
- 저장 데이터: `StockPrice` 엔티티(주가 캐시)가 사실상 유일한 테이블. 접근은 전부 JPA 경유라 SQL 직접 작성 코드는 없음

## 정식 문서

- 공식 문서: https://www.postgresql.org/docs/
- SQL 명령 레퍼런스: https://www.postgresql.org/docs/current/sql-commands.html
- JDBC 드라이버 문서: https://jdbc.postgresql.org/documentation/
- Railway Postgres 가이드: https://docs.railway.com/guides/postgresql
