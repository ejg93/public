# backend — Spring Boot 3 API

Java 17 + Spring Boot 3.2.5. 프론트가 호출하는 REST API를 제공하고, Railway가 이 폴더를 루트로 배포한다. Postgres 플러그인이 붙어 있다.

## 구조

```
com/portfolio/
├── controller/   REST 엔드포인트
├── service/      외부 API 호출·비즈니스 로직
├── dto/          요청/응답 객체
├── entity/       StockPrice — JPA 엔티티
└── repository/   StockPriceRepository
```

외부 API 호출은 전부 `service/`에서 한다. 컨트롤러는 요청 검증과 응답 변환만 맡는다. CORS 설정은 `WebConfig.java`에 있다.

## 엔드포인트

| API | 담당 클래스 | 외부 의존 |
|---|---|---|
| `POST /api/battle/chat`, `GET /api/battle/health` | `BattleController` / `BattleService` | Anthropic Claude API |
| `GET /api/stock/{search,load,price,chart}` | `StockController` / `StockService` | Yahoo Finance(비공식) + Postgres 캐시 |
| `GET /api/youtube/{comments,replies}` | `YoutubeController` / `YoutubeService` | YouTube Data API v3 |
| `GET /api/jobs` | `JobController` / `JobService` | 사람인 오픈 API + Kakao Local(주소→좌표) |

주가 데이터만 `StockPrice` 엔티티로 DB에 영속화한다. 나머지는 매 요청 외부 호출.

## 환경변수

`src/main/resources/application.properties` + Railway Variables. 로컬은 `application.properties.template`를 복사해서 채운다. 실제 키가 든 `application.properties`는 커밋 대상이 아니다.

| 변수 | 용도 |
|---|---|
| `anthropic.api.key` | AI 배틀 |
| `youtube.api.key` | 유튜브 댓글·답글 |
| `kakao.rest.key` | Kakao Local REST 서버사이드 호출 |
| `saramin.access.key` | 채용정보 |
| `spring.datasource.*` | Railway Postgres 접속 |

**Yahoo Finance는 키가 필요 없다.** `StockService.java`가 공개 엔드포인트를 직접 호출한다. 과거에 쓰던 `polygon.api.key`는 제거됐으니 다시 넣지 않는다.

## 로컬 실행

```bash
cp src/main/resources/application.properties.template src/main/resources/application.properties
# 위 파일에 실제 키 채운 뒤
mvn spring-boot:run       # localhost:8080
```

## 검증

Maven Wrapper로 빌드한다. `mvn`은 이 PC에 설치돼 있지 않지만 `./mvnw`가 Maven 3.9.9를 `~/.m2/wrapper/`에 자동으로 받아 쓴다.

**JAVA_HOME을 매번 지정해야 한다.** 시스템 `JAVA_HOME`은 JDK 11을 가리키고 PATH의 `java`는 JDK 25인데, 이 프로젝트는 Java 17 타깃이다. 둘 다 그대로 쓰면 안 된다.

```bash
# Bash
JAVA_HOME="C:/Program Files/Java/jdk-17.0.19" ./mvnw -B compile
```
```powershell
# PowerShell
$env:JAVA_HOME='C:\Program Files\Java\jdk-17.0.19'; .\mvnw.cmd -B compile
```

| 명령 | 무엇을 확인하나 |
|---|---|
| `./mvnw -B compile` | 컴파일 통과 여부. 자바 코드 수정 후 필수 |
| `./mvnw -B package` | jar 생성까지. 배포 형태 확인 |
| `./mvnw -B spring-boot:run` | 실제 기동. `application.properties`에 키가 채워져 있어야 한다 |

**테스트 코드는 없다** (`src/test` 없음). `./mvnw test`는 통과하지만 검증력이 0이다. 통과했다고 동작을 보증하지 말 것 — API 회귀 확인은 기동해서 직접 호출하는 방법뿐이다.

컴파일만 확인하고 기동은 안 했으면, 확인한 범위와 못 한 범위를 나눠서 보고한다.

## doc 참조 트리거

아래 작업을 할 때만 해당 문서를 연다. 그 외에는 열지 않는다.

| 작업 | 문서 |
|---|---|
| 외부 API 요청 파라미터·응답 스펙·쿼터 확인 | [doc/backend/external-apis.md](../doc/backend/external-apis.md) |
| 배포 환경 변수·Railway 설정 변경 | [doc/deployment.md](../doc/deployment.md) |
| 라이브러리 버전 확인이 필요할 때 | `pom.xml` 직접 확인 |
