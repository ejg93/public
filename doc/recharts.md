# Recharts 3.8

## 개요

React 전용 차트 라이브러리. `<LineChart>`, `<XAxis>` 같은 컴포넌트를 JSX로 조립하면 SVG 차트가 그려진다. 데이터 배열만 넘기면 축, 눈금, 툴팁을 알아서 처리해준다. D3처럼 저수준 그리기를 직접 하지 않아도 되는 게 장점.

## 이 프로젝트에서

- 버전: **3.8.1**
- 사용처: `app/stock/page.tsx` — 주가 라인 차트 하나가 유일한 사용처
- 사용 컴포넌트:
  - `ResponsiveContainer` — 부모 크기에 맞춰 차트 크기 자동 조절
  - `LineChart` + `Line` — 종가(close) 라인. 시작가 대비 상승이면 초록, 하락이면 빨강으로 stroke 색 동적 지정
  - `XAxis` / `YAxis` / `CartesianGrid` — 축과 격자
  - `Tooltip` — 마우스 오버 시 값 표시. `content={<ChartTooltip />}`로 커스텀 컴포넌트 주입
  - `ReferenceLine` — 기준선(차트 시작 시점 종가)을 점선으로 표시

## 핵심 개념 요약

- 데이터는 객체 배열(`[{ date, close }, ...]`)로 넘기고, `dataKey="close"`로 어느 필드를 그릴지 지정.
- 차트를 이루는 요소 하나하나(축, 선, 툴팁)가 전부 React 컴포넌트라 조합·커스터마이징이 자유롭다.

## 정식 문서

- 공식 사이트: https://recharts.org
- API 레퍼런스: https://recharts.org/en-US/api
- LineChart: https://recharts.org/en-US/api/LineChart
- 예제 모음: https://recharts.org/en-US/examples
