# Spring Data JPA

## 개요

JPA(Java Persistence API)는 "객체 ↔ 테이블 매핑(ORM)" 표준이고, 구현체는 Hibernate. Spring Data JPA는 그 위에 한 겹 더 얹어 **인터페이스만 선언하면 쿼리 구현을 자동 생성**해주는 라이브러리다.

MyBatis/iBatis + Oracle에서 SQL을 직접 쓰던 방식과 비교하면: SQL을 개발자가 작성하는 대신, 엔티티 클래스와 메서드 이름 규칙(`findBySymbolAndDate...`)으로부터 프레임워크가 SQL을 만들어낸다. 단순 CRUD는 코드가 극단적으로 줄지만, 복잡한 통계성 쿼리는 오히려 어려워서 그런 경우 `@Query`로 JPQL/네이티브 SQL을 직접 쓴다.

## 이 프로젝트에서

- 의존성: `spring-boot-starter-data-jpa` (`backend/pom.xml`)
- 엔티티: `entity/StockPrice.java` — 주가 데이터를 테이블에 매핑. `@Entity`, `@Id` 등 어노테이션 사용
- 리포지토리: `repository/StockPriceRepository.java` — `JpaRepository` 상속 인터페이스. 구현 클래스 없이 save/findAll 등 기본 메서드 자동 제공
- 용도: Yahoo Finance에서 받아온 주가를 PostgreSQL에 캐시처럼 저장, 재조회 시 DB 우선 사용 (`service/StockService.java`)

## 핵심 개념 요약

- **엔티티**: `@Entity` 붙은 클래스 = 테이블 1:1 매핑. 필드 = 컬럼.
- **리포지토리 인터페이스**: `extends JpaRepository<엔티티, ID타입>` 만으로 CRUD 완성. 메서드 이름 규칙(`findBy필드명`)으로 조건 조회 자동 생성.
- **ddl-auto**: `spring.jpa.hibernate.ddl-auto` 설정으로 테이블 자동 생성/갱신 가능. 운영에서는 `validate`나 `none` 권장 (자동 변경은 사고 위험).
- **영속성 컨텍스트**: 트랜잭션 안에서 엔티티 변경을 추적해 커밋 시 자동 UPDATE(더티 체킹). MyBatis에는 없는 개념이라 처음엔 낯설 수 있음.

## 정식 문서

- Spring Data JPA 레퍼런스: https://docs.spring.io/spring-data/jpa/reference/
- 쿼리 메서드 이름 규칙: https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html
- Hibernate ORM 문서: https://hibernate.org/orm/documentation/
- Jakarta Persistence 스펙: https://jakarta.ee/specifications/persistence/
