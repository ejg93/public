# React 18

## 개요

UI를 "컴포넌트"라는 함수 단위로 조립하는 라이브러리. JSP가 서버에서 HTML 문자열을 완성해 내려보내는 방식이라면, React는 브라우저에서 자바스크립트가 화면을 그리고, **데이터(상태)가 바뀌면 바뀐 부분만 다시 그린다**. jQuery로 `$('#el').html(...)` 하며 DOM을 직접 조작하던 것을, "상태만 바꾸면 화면은 알아서 따라온다"로 뒤집은 것.

## 이 프로젝트에서

- 버전: **18** (react + react-dom)
- 모든 페이지·데모가 함수형 컴포넌트. 클래스 컴포넌트는 없음.
- 주로 쓰는 훅(hook):
  - `useState` — 화면에 반영되는 값 보관. 예: `app/board/demos.tsx`의 각 데모(버튼 메시지, 카카오톡 데모 단계 전환 등)
  - `useEffect` — 렌더링 후 실행할 부수 작업. 예: `app/stock/page.tsx`에서 페이지 진입 시 백엔드 API 호출
  - `useRef` — 리렌더링과 무관하게 값·DOM 참조 유지. 예: `app/public-data/page.tsx`에서 지도 DOM 참조(`mapRef`)와 초기화 여부 플래그(`mapInited`)
- JSX 문법: HTML처럼 보이는 `<div>...</div>`가 실제로는 자바스크립트 표현식. `{변수}`로 값 삽입.

## 핵심 개념 요약

- **컴포넌트**: 화면 조각을 반환하는 함수. props(파라미터)를 받아 JSX를 리턴.
- **상태(state)**: `const [값, set값] = useState(초기값)`. `set값()`을 호출해야 화면이 갱신된다. 변수 직접 수정은 화면에 반영 안 됨.
- **렌더링 사이클**: 상태 변경 → 컴포넌트 함수 재실행 → 가상 DOM 비교 → 바뀐 부분만 실제 DOM 반영.

## 정식 문서

- 공식 문서: https://react.dev
- 훅 레퍼런스: https://react.dev/reference/react/hooks
- useState: https://react.dev/reference/react/useState
- useEffect: https://react.dev/reference/react/useEffect
- useRef: https://react.dev/reference/react/useRef
