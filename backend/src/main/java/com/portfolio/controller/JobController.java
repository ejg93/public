package com.portfolio.controller;

import com.portfolio.service.JobService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<?> getJobs() {
        try {
            log.info("구인 목록 요청");
            return ResponseEntity.ok(jobService.fetchJobs());
        } catch (Exception e) {
            log.error("구인 목록 오류", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
