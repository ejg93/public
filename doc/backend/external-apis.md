# 외부 API 정리

백엔드 `service/` 계층에서 호출하는 외부 API 4종. 전부 HttpClient 5로 호출하고 Jackson으로 파싱한다. API 키는 `application.properties`(git 제외)와 Railway Variables에 등록.

## 1. Anthropic Claude API

- 사용처: `/ai-battle` → `POST /api/battle/chat` → `BattleService.java`
- 엔드포인트: `POST https://api.anthropic.com/v1/messages`
- 인증: `x-api-key` 헤더 (`anthropic.api.key`) + `anthropic-version` 헤더 필수
- 현재 코드 상태: 프론트에서 "opus"/"sonnet"을 선택해 보내지만, 실제로는 둘 다 `claude-haiku-4-5-20251001`로 매핑되어 있다 (비용 절약용으로 보임 — `resolveModel()` 참고). 시스템 프롬프트만 모델 선택에 따라 달라짐.
- 정식 문서:
  - 개발자 문서 홈: https://docs.claude.com/
  - Messages API 레퍼런스: https://docs.claude.com/en/api/messages
  - 모델 목록: https://docs.claude.com/en/docs/about-claude/models
  - 콘솔(키 발급): https://console.anthropic.com/

## 2. YouTube Data API v3

- 사용처: `/youtube` → `GET /api/youtube/{comments,replies}` → `YoutubeService.java`
- 엔드포인트: `https://www.googleapis.com/youtube/v3` (commentThreads, comments 리소스)
- 인증: API 키 쿼리 파라미터 (`youtube.api.key`)
- 쿼터 주의: 기본 일일 10,000 유닛. 댓글 조회는 리소스당 1 유닛이라 여유 있지만 초과 시 403 반환.
- 정식 문서:
  - API 홈: https://developers.google.com/youtube/v3
  - commentThreads: https://developers.google.com/youtube/v3/docs/commentThreads/list
  - comments: https://developers.google.com/youtube/v3/docs/comments/list
  - 키 발급(Google Cloud Console): https://console.cloud.google.com/apis/library/youtube.googleapis.com

## 3. Kakao Local REST API

- 사용처: 채용공고 주소 → 좌표 변환 → `JobService.java`
- 엔드포인트: `GET https://dapi.kakao.com/v2/local/search/keyword.json`
- 인증: `Authorization: KakaoAK {REST_API_키}` 헤더 (`kakao.rest.key`) — 프론트의 JavaScript 키와 다른 키다 ([kakao-maps-sdk.md](../frontend/kakao-maps-sdk.md) 참고)
- 정식 문서:
  - Local API 가이드: https://developers.kakao.com/docs/latest/ko/local/dev-guide
  - 키워드 장소 검색: https://developers.kakao.com/docs/latest/ko/local/dev-guide#search-by-keyword

## 4. 사람인 오픈 API

- 사용처: `/public-data` → `GET /api/jobs` → `JobService.java`
- 엔드포인트: `GET https://oapi.saramin.co.kr/job-search`
- 인증: `access-key` 쿼리 파라미터 (`saramin.access.key`)
- 정식 문서:
  - 오픈 API 홈: https://oapi.saramin.co.kr/
  - 채용정보 API 가이드: https://oapi.saramin.co.kr/guide/job-search
