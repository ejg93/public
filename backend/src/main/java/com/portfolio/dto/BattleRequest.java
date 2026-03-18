package com.portfolio.dto;

import lombok.Data;
import java.util.List;

// ── 요청 DTO ──────────────────────────────────────────
@Data
public class BattleRequest {

    private String model;       // "opus" | "sonnet"
    private String userMsg;     // 이번 메시지
    private List<Message> history;  // 이전 대화 내역 (최근 10턴)

    @Data
    public static class Message {
        private String role;    // "user" | "assistant"
        private String content;
    }
}
