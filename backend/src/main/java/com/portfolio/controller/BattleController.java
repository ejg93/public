package com.portfolio.controller;

import com.portfolio.dto.BattleRequest;
import com.portfolio.dto.BattleResponse;
import com.portfolio.error.ApiError;
import com.portfolio.error.UpstreamException;
import com.portfolio.service.BattleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/battle")
@RequiredArgsConstructor
public class BattleController {

    private final BattleService battleService;

    // 이 엔드포인트는 호출 한 번이 모델 API 요금이 된다. 인증이 없으므로 기본은 꺼 둔다.
    // 화면을 되살릴 때 배포 환경변수에서 battle.enabled 만 켠다.
    @Value("${battle.enabled:false}")
    private boolean enabled;

    // 길이 상한이 없으면 한 번 호출로 얼마든지 큰 입력을 보낼 수 있다
    @Value("${battle.max-user-msg:2000}")
    private int maxUserMsg;

    @Value("${battle.max-history:10}")
    private int maxHistory;

    /**
     * AI 채팅 요청
     * POST /api/battle/chat
     */
    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody BattleRequest request) {
        if (!enabled) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(new ApiError("BATTLE_DISABLED", "AI 배틀 API 는 꺼져 있다"));
        }

        String userMsg = request.getUserMsg();
        if (userMsg == null || userMsg.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new ApiError("INVALID_REQUEST", "userMsg 가 비어 있다"));
        }
        if (userMsg.length() > maxUserMsg) {
            return ResponseEntity.badRequest()
                    .body(new ApiError("MESSAGE_TOO_LONG", "userMsg 는 " + maxUserMsg + "자까지다"));
        }
        if (request.getHistory() != null && request.getHistory().size() > maxHistory) {
            return ResponseEntity.badRequest()
                    .body(new ApiError("HISTORY_TOO_LONG", "history 는 " + maxHistory + "턴까지다"));
        }

        try {
            // 입력 본문은 길이만 남긴다. 통째로 찍으면 로그에 사용자 입력이 그대로 쌓인다
            log.info("배틀 요청 - persona: {}, 길이: {}자", request.getPersona(), userMsg.length());
            BattleResponse response = battleService.chat(request);
            return ResponseEntity.ok(response);
        } catch (UpstreamException e) {
            return ResponseEntity.status(e.getStatus()).body(e.toBody());
        } catch (Exception e) {
            log.error("배틀 처리 중 오류", e);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(new ApiError("UPSTREAM_ERROR", "모델 API 를 부르는 중에 실패했다"));
        }
    }
}
