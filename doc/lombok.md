# Lombok

## 개요

Java 보일러플레이트(getter/setter/생성자/toString/로거 선언)를 어노테이션으로 대체하는 라이브러리. 컴파일 시점에 코드를 생성해 바이트코드에 끼워넣는다. 소스에는 없지만 컴파일된 클래스에는 메서드가 실제로 존재한다.

VO/DTO마다 getter/setter 수십 줄씩 찍어내던 것을 클래스 위에 `@Getter @Setter` 두 줄로 끝내는 도구라고 보면 된다.

## 이 프로젝트에서

- 의존성: `backend/pom.xml` (optional, 빌드 산출물에서 제외 설정됨 — 컴파일 타임에만 필요하기 때문)
- 주 사용처: `dto/` (BattleRequest, BattleResponse), `entity/StockPrice.java`, 서비스 클래스의 `@Slf4j`
- 자주 쓰는 어노테이션:
  - `@Getter` / `@Setter` — 접근자 자동 생성
  - `@Slf4j` — `private static final Logger log = ...` 선언 대체. `log.debug(...)` 바로 사용 (`BattleService.java`의 로그가 이것)
  - `@Data` — getter+setter+toString+equals+hashCode 일괄 (엔티티에는 남용 주의: 연관관계 있으면 toString 무한루프 가능)
  - `@NoArgsConstructor` / `@AllArgsConstructor` — 생성자 생성 (JPA 엔티티는 기본 생성자 필수라 자주 붙음)

## 주의사항

- IDE 플러그인 필요 (IntelliJ는 번들됨, annotation processing 활성화 필요) — 없으면 IDE가 "메서드 없음" 빨간줄 표시.
- 컴파일 시 생성이므로 디버깅 중 소스와 바이트코드가 달라 보이는 지점이 있다.

## 정식 문서

- 공식 사이트: https://projectlombok.org/
- 기능별 문서: https://projectlombok.org/features/
- @Slf4j 등 로그 어노테이션: https://projectlombok.org/features/log
- Maven 설정: https://projectlombok.org/setup/maven
