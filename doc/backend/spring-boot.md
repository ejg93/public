# Spring Boot 3.2 (Java 17)

## 개요

Spring 기반 애플리케이션을 "설정 최소화 + 내장 서버"로 띄우는 프레임워크. 전통적인 Spring(XML 설정 + 외장 톰캣에 war 배포) 경험이 있다면, Spring Boot는 그 설정 지옥을 걷어내고 `main()` 하나로 내장 톰캣까지 실행하는 버전이라고 보면 된다. jar 하나로 패키징되어 `java -jar`로 실행 가능 — Railway 같은 클라우드 배포와 궁합이 좋은 이유.

Spring Boot 3.x는 **Java 17 이상 필수**, 패키지가 `javax.*` → `jakarta.*`로 바뀐 세대다 (구버전 예제 코드 복사 시 주의).

## 이 프로젝트에서

- 버전: **3.2.5** / Java **17** / 빌드: Maven (`backend/pom.xml`)
- 진입점: `PortfolioApplication.java` — `@SpringBootApplication`
- 구조: 전형적인 계층형
  - `controller/` — `@RestController`. URL 매핑과 요청/응답 처리 (Battle, Job, Stock, Youtube)
  - `service/` — `@Service`. 비즈니스 로직 + 외부 API 호출
  - `repository/` — Spring Data JPA 인터페이스
  - `entity/` / `dto/` — DB 매핑 객체 / 요청·응답 객체
  - `WebConfig.java` — CORS 설정 (Vercel 프론트에서 다른 도메인인 Railway 백엔드를 호출하므로 필수)
- 설정: `src/main/resources/application.properties` (git 제외, `.template` 복사해서 사용). API 키·DB 접속 정보를 `@Value`로 주입.

## 핵심 개념 요약

- **스타터(starter)**: `spring-boot-starter-web` 하나로 Spring MVC + 내장 톰캣 + Jackson이 딸려온다. 의존성 버전은 부모 pom이 관리 (pom에 버전 명시 없는 이유).
- **자동 설정(auto-configuration)**: classpath에 뭐가 있는지 보고 알아서 빈 구성. 예: postgresql 드라이버 + datasource 프로퍼티만 있으면 DB 연결 구성 완료.
- **@RestController**: `@Controller` + `@ResponseBody`. 리턴 객체가 Jackson으로 JSON 직렬화되어 나간다. JSP 포워딩 없음.

## 정식 문서

- Spring Boot 공식 문서: https://docs.spring.io/spring-boot/index.html
- 3.2.5 레퍼런스 (프로젝트 버전): https://docs.spring.io/spring-boot/docs/3.2.5/reference/html/
- Spring Framework Web MVC: https://docs.spring.io/spring-framework/reference/web/webmvc.html
- 프로퍼티 전체 목록: https://docs.spring.io/spring-boot/docs/3.2.5/reference/html/application-properties.html
