# Kakao Maps JavaScript SDK (v2)

## 개요

카카오가 제공하는 브라우저용 지도 SDK. `<script>` 태그로 로드하면 전역 `window.kakao.maps` 객체가 생기고, 이걸로 지도 생성·마커·인포윈도우 등을 다룬다. npm 패키지가 아니라 **CDN 스크립트 방식**이라 React 프로젝트에서는 로드 타이밍 관리가 필요하다.

## 이 프로젝트에서

- 사용처: `app/public-data/page.tsx` — 채용정보(사람인) 위치를 지도에 마커로 표시
- 로드 방식: Next.js `<Script>` 컴포넌트로 `//dapi.kakao.com/v2/maps/sdk.js?appkey=...&autoload=false` 로드
  - `autoload=false` + `window.kakao.maps.load(콜백)` 패턴: SDK 내부 리소스 로딩이 끝난 뒤 콜백 실행을 보장
  - 앱 키는 `NEXT_PUBLIC_KAKAO_JS_KEY` 환경변수 (브라우저 노출용 JavaScript 키 — REST 키와 다름)
- 사용 API:
  - `new kakao.maps.Map(DOM, { center, level })` — 지도 생성
  - `kakao.maps.LatLng(lat, lng)` — 좌표 객체
  - `kakao.maps.Marker` — 마커 (사용자 위치 + 채용공고 위치들)
  - `kakao.maps.InfoWindow` — 마커 클릭 시 말풍선
  - `kakao.maps.event.addListener(marker, 'click', ...)` — 이벤트 바인딩
- React 연동 포인트: `useRef`로 지도 컨테이너 DOM을 잡고, `mapInited` ref로 중복 초기화 방지 (리렌더링 때마다 지도를 새로 만들면 안 되므로)

## 키 종류 주의

| 키 | 용도 | 이 프로젝트 |
|---|---|---|
| JavaScript 키 | 브라우저 SDK (지도 표시) | `NEXT_PUBLIC_KAKAO_JS_KEY` (frontend) |
| REST API 키 | 서버사이드 REST 호출 (주소→좌표 등) | `kakao.rest.key` (backend, [external-apis.md](../backend/external-apis.md) 참고) |

카카오 개발자 콘솔에서 도메인(플랫폼) 등록 필수 — 등록 안 된 도메인에서는 지도가 안 뜬다.

## 정식 문서

- Maps API 문서 홈: https://apis.map.kakao.com/web/
- 가이드: https://apis.map.kakao.com/web/guide/
- API 레퍼런스: https://apis.map.kakao.com/web/documentation/
- 샘플: https://apis.map.kakao.com/web/sample/
- 카카오 개발자 콘솔(키 발급): https://developers.kakao.com/
