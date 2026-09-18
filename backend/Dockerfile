# Railway 가 자동 감지로 java·maven 을 깔면 JAVA_HOME 을 잘못 잡아 빌드가 깨진다
# (2026-09-18: "Error: JAVA_HOME is not defined correctly. We cannot execute /usr/local/bin/java").
# 빌드 환경을 여기서 고정한다 — 이 파일이 있으면 Railway 는 자동 감지를 안 쓴다.
#
# 이미지를 둘로 나눈다. 빌드에는 JDK 와 Maven 이 필요하지만 실행에는 JRE 만 있으면 된다.
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build

# 의존성 목록만 먼저 넣고 받아 둔다. 소스만 바뀐 재배포에서 이 층이 캐시로 남는다
COPY pom.xml ./
RUN mvn -B -q dependency:go-offline

COPY src ./src
RUN mvn -B -q -DskipTests package

# 실행 이미지. pom 의 java.version 과 같은 17 이다
FROM eclipse-temurin:17-jre
WORKDIR /app

# 이름에 버전이 붙어 있어 와일드카드로 받는다
COPY --from=build /build/target/*.jar app.jar

# Railway 가 PORT 를 넣어 준다. 없으면 8080 으로 뜬다(application.properties 의 server.port 와 같다)
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
