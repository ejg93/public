package com.portfolio.controller;

import com.portfolio.error.ApiError;
import com.portfolio.error.UpstreamException;
import com.portfolio.service.YoutubeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/youtube")
@RequiredArgsConstructor
public class YoutubeController {

    private final YoutubeService youtubeService;

    @GetMapping("/comments")
    public ResponseEntity<?> getComments(@RequestParam String videoId) {
        // 빈 값으로 부르면 하루 할당량만 깎이고 업스트림이 404 를 돌려준다
        if (videoId.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new ApiError("INVALID_REQUEST", "videoId 가 비어 있다"));
        }
        try {
            log.info("유튜브 댓글 요청 - videoId: {}", videoId);
            return ResponseEntity.ok(youtubeService.fetchComments(videoId));
        } catch (UpstreamException e) {
            // 업스트림이 준 상태·이유를 우리 코드로 바꿔 그대로 내보낸다. 원문은 서비스가 로그에 남겼다
            return ResponseEntity.status(e.getStatus()).body(e.toBody());
        } catch (Exception e) {
            log.error("유튜브 댓글 오류", e);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(new ApiError("UPSTREAM_ERROR", "YouTube API 를 부르는 중에 실패했다"));
        }
    }

    @GetMapping("/replies")
    public ResponseEntity<?> getReplies(@RequestParam String commentId) {
        if (commentId.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new ApiError("INVALID_REQUEST", "commentId 가 비어 있다"));
        }
        try {
            log.info("답글 요청 - commentId: {}", commentId);
            return ResponseEntity.ok(youtubeService.fetchReplies(commentId));
        } catch (UpstreamException e) {
            return ResponseEntity.status(e.getStatus()).body(e.toBody());
        } catch (Exception e) {
            log.error("답글 오류", e);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(new ApiError("UPSTREAM_ERROR", "YouTube API 를 부르는 중에 실패했다"));
        }
    }
}
