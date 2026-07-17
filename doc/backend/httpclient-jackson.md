# Apache HttpClient 5 & Jackson

백엔드에서 외부 API를 호출하고(JSON 요청/응답) 그 결과를 파싱하는 조합. "서버가 브라우저처럼 다른 서버에 HTTP 요청을 보내는" 역할이 HttpClient, "JSON 문자열 ↔ Java 객체 변환"이 Jackson이다.

## Apache HttpClient 5

### 개요

Java 진영의 대표적인 HTTP 클라이언트 라이브러리. JDK 내장 `HttpURLConnection`보다 커넥션 풀, 타임아웃, 재시도 등 실무 기능이 풍부하다. (참고: Spring 생태계에는 `RestTemplate`/`WebClient`/`RestClient`라는 상위 추상화도 있는데, 이 프로젝트는 HttpClient를 직접 쓴다.)

### 이 프로젝트에서

- 의존성: `org.apache.httpcomponents.client5:httpclient5` (`backend/pom.xml`)
- 사용처: `service/` 4개 클래스 전부 — 외부 API 호출 담당
  - `BattleService` → Anthropic Claude API (POST + 헤더 `x-api-key`, `anthropic-version`)
  - `YoutubeService` → YouTube Data API v3 (GET)
  - `StockService` → Yahoo Finance (GET)
  - `JobService` → 사람인 API + Kakao Local API (GET)

### 정식 문서

- 공식 사이트: https://hc.apache.org/httpcomponents-client-5.4.x/
- 빠른 시작: https://hc.apache.org/httpcomponents-client-5.4.x/quickstart.html
- 예제: https://hc.apache.org/httpcomponents-client-5.4.x/examples.html

## Jackson (jackson-databind)

### 개요

Java 표준급 JSON 라이브러리. Spring Boot의 `@RestController`가 객체를 JSON으로 내보낼 때 내부적으로 쓰는 것도 Jackson이다. 이 프로젝트는 그 자동 변환 외에, 외부 API 응답 JSON을 수동으로 파싱할 때도 직접 쓴다.

### 이 프로젝트에서

- 의존성: `com.fasterxml.jackson.core:jackson-databind` (starter-web에 포함되지만 pom에 명시)
- 두 가지 사용 패턴:
  1. **자동**: 컨트롤러 리턴 객체(`BattleResponse` 등) → JSON 직렬화, 요청 바디 → `BattleRequest` 역직렬화
  2. **수동**: `ObjectMapper.readTree()`로 외부 API 응답을 `JsonNode` 트리로 읽어 필요한 필드만 꺼내는 방식 (외부 응답 전체를 DTO로 만들 필요 없을 때 유용)

### 정식 문서

- GitHub (문서 허브): https://github.com/FasterXML/jackson
- databind: https://github.com/FasterXML/jackson-databind
- Javadoc: https://javadoc.io/doc/com.fasterxml.jackson.core/jackson-databind
