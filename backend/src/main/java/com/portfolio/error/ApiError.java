package com.portfolio.error;

/**
 * 오류 응답 본문. 화면이 분기에 쓰는 것은 code 고, message 는 사람이 읽는 줄이다.
 * 업스트림이 준 문장을 그대로 싣지 않는다 — 태그와 내부 사정이 섞여 나간다.
 */
public record ApiError(String code, String message) {
}
