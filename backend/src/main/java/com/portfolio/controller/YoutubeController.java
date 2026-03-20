package com.portfolio.controller;

import com.portfolio.service.YoutubeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
        try {
            log.info("유튜브 댓글 요청 - videoId: {}", videoId);
            return ResponseEntity.ok(youtubeService.fetchComments(videoId));
        } catch (Exception e) {
            log.error("유튜브 댓글 오류", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/replies")
    public ResponseEntity<?> getReplies(@RequestParam String commentId) {
        try {
            log.info("답글 요청 - commentId: {}", commentId);
            return ResponseEntity.ok(youtubeService.fetchReplies(commentId));
        } catch (Exception e) {
            log.error("답글 오류", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
