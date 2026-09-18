package com.portfolio.dto;

import lombok.Data;
import java.util.List;

// ── 요청 DTO ──────────────────────────────────────────
@Data
public class BattleRequest {

    // 토론자 성향. 양쪽 다 같은 모델을 쓰고 이 값으로 시스템 프롬프트만 갈린다
    private String persona;     // "logic" | "empathy"
    private String userMsg;     // 이번 메시지
    private List<Message> history;  // 이전 대화 내역 (최근 10턴)

    @Data
    public static class Message {
        private String role;    // "user" | "assistant"
        private String content;
    }
}
