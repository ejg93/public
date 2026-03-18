package com.portfolio.controller;

import com.portfolio.dto.BattleRequest;
import com.portfolio.dto.BattleResponse;
import com.portfolio.service.BattleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/battle")
@RequiredArgsConstructor
public class BattleController {

    private final BattleService battleService;

    /**
     * AI 채팅 요청
     * POST /api/battle/chat
     */
    @PostMapping("/chat")
    public ResponseEntity<BattleResponse> chat(@RequestBody BattleRequest request) {
        try {
            log.info("배틀 요청 - model: {}, msg: {}", request.getModel(), request.getUserMsg());
            BattleResponse response = battleService.chat(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("배틀 처리 중 오류", e);
            return ResponseEntity.internalServerError()
                    .body(new BattleResponse("[오류] " + e.getMessage(), 0));
        }
    }

    /**
     * 헬스체크
     * GET /api/battle/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
}
