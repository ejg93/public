package com.portfolio;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

// 키가 든 application.properties 는 커밋 대상이 아니다. CI 에는 그 파일이 없으므로
// @Value 가 값을 못 찾아 기동이 깨진다. 여기서 더미 값을 넣어 컨텍스트만 세운다.
@SpringBootTest(properties = {
        "anthropic.api.key=test-key",
        "youtube.api.key=test-key",
        "kakao.rest.key=",
        "saramin.access.key=",
        "cors.allowed-origins=http://localhost:3000",
})
class PortfolioApplicationTests {

    @Test
    @DisplayName("스프링 컨텍스트가 뜬다")
    void contextLoads() {
        // 빈 주입 실패·설정 오류는 여기서 터진다. compile 은 못 잡는 자리다
    }
}
