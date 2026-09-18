package com.portfolio.error;

import org.springframework.http.HttpStatus;

/**
 * 외부 API 가 정상이 아닐 때 서비스가 던진다. 컨트롤러는 여기 담긴 상태코드와 code 를 그대로 내보낸다.
 * 업스트림 원문은 로그로만 남기고 밖으로는 안 내보낸다.
 */
public class UpstreamException extends RuntimeException {

    private final String code;
    private final HttpStatus status;

    public UpstreamException(HttpStatus status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public ApiError toBody() {
        return new ApiError(code, getMessage());
    }
}
