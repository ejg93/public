// 첫 화면 CAREER 절의 데이터. 행 하나가 프로젝트 하나다.
// 문장 안 줄바꿈은 \n 으로 적고 white-space: pre-line 으로 그린다.
// 이력서에 그대로 옮기는 글이라 문장은 명사형으로 끝낸다.

export type Career = {
  period: string
  months: string
  name: string
  company: string   // 소속사
  client: string    // 고객사
  stack: string
  team: string      // 역할·기여도 — 팀 규모와 그 안에서의 자리
  tasks: string[]   // 담당 업무와 결과
  proof: string     // 업무 증빙
}

export const CAREERS: Career[] = [
  {
    period: '2025.10 ~ 재직중',
    months: '10개월',
    name: '디지털돌봄시스템 기능개선',
    company: '휴앤시스',
    client: '한국사회보장정보원',
    stack: 'Java · JSP · eGovFrame · Tibero · ClipReport 4.0',
    team: '소속사 투입 7명 중 디지털돌봄 담당은 PL 1명과 함께 업무 수행\n요구사항은 정보원 측 선임',
    tasks: [
      '불명확한 요구사항 5건을 담당자에게 확인해 12건으로 상세화·재정의 \n—요구 기간 3개월 안에 화면 12장 + 팝업 3개 개발과 산출물 문서 완료',
      '레거시 코드 분석으로 설계 복원 후 신규 화면 연동',
      '통계 화면 개발 — 다중 쿼리 결과 조합 및 통계값 표시',
      '예비대상자 관리 화면 개발',
      '응급발생처리 사후관리 테이블 신규 설계·개발\n—컬럼 18개, 응급발생처리 테이블에 FK(ON DELETE RESTRICT), 소프트 삭제·감사 컬럼 포함',
      '다른 요구사항 건으로 테이블 2개 추가 설계',
      '요구 기간 뒤 운영 단계 — 추가 요구 건 개발과 산출물 문서 작성',
    ],
    proof: 'DDL·테이블정의서·화면정의서\n이 사이트의 toolbox·docrules 는 운영 단계에서 산출물 작성용으로 만들어 Erd 작성이 필요한 다른 팀도 사용함',
  },
  {
    period: '2024.06 ~ 2024.08',
    months: '2개월',
    name: '경기도 단체사업 지원신청 웹페이지 개발',
    company: '엠에스링크앤솔루션',
    client: '경기도시장상권진흥원',
    stack: 'Java · JSP · Spring · AngularJS · Redis · Oracle',
    team: '팀 5명. 투입 기간에 다른 팀원은 제안서 작성 중으로 구현을 담당\nAOP 캐시 방식은 지시 사항, 적용 지점 선정과 구현은 본인 수행',
    tasks: [
      '단체사업 계약신청 테이블 관련 조회에 AOP 로 Redis 캐시를 적용해 동일 쿼리 재조회 제거 —\n전: 매 조회마다 10초 이상 / 후: 첫 조회 뒤 같은 조건은 1초 미만',
      'AOP 로 로깅·트랜잭션 공통 처리 분리',
    ],
    proof: '',
  },
  {
    period: '2023.03 ~ 2023.10',
    months: '8개월',
    name: 'KB라이프 보험 시스템 개발',
    company: '블루컴',
    client: 'KB라이프',
    stack: 'Java · JSP · Spring · eXBuilder6 · Fortran · Oracle · MySQL',
    team: '퍼블리셔 없이 치과 보험 화면 4개 이상을 화면 설계부터 개발까지 단독 수행',
    tasks: [
      'eXBuilder6 기반 보험 화면 단독 개발 — 화면 설계부터 구현까지',
      '프론트엔드 개발 지원 및 화면 공통 처리 정리',
      'PM 업무 보조 — API 연동 요청 문서·산출물 작성.\n의학 용어 기반 변수명 정의로 현업·개발 간 용어 통일',
      'Oracle → MySQL 이식 — 쿼리 30본 이상의 Oracle 조인을 ANSI 조인으로 변환,\nNVL·LIMIT 류 함수 치환. 조회 조건을 바꿔 가며 변환 전후 건수를 반복 대조',
      '고도화 대상 Fortran 계산 로직을 Java 로 변환',
    ],
    proof: '',
  },
  {
    period: '2021.04 ~ 2021.12',
    months: '9개월',
    name: 'KT-GIGA ENERGY',
    company: '에스투피테크',
    client: 'KT-MEG',
    stack: 'Java · JSP · Spring · MariaDB',
    team: '',
    tasks: [
      '공장 등 전력 다소비 사업장 담당자용 요금 현황 대시보드 3개 개발\n—피크 수요(Demand) 추이를 보여 요율 구간을 넘기는 시점을 미리 알린다',
      'DR(수요반응) 데이터 모니터링 — 외부 API 연동 값 검증 및 유지보수',
    ],
    proof: '',
  },
  {
    period: '2021.02 ~ 2021.03',
    months: '2개월',
    name: '온나라 2.0 (군 그룹웨어)',
    company: '에스투피테크',
    client: '3707부대',
    stack: 'Java · JSP · eGovFrame · Oracle',
    team: '',
    tasks: ['문서 시스템 오류 등 그룹웨어 장애 1차 접수·처리, 사용자 문의 대응'],
    proof: '',
  },
  {
    period: '2020.09 ~ 2021.01',
    months: '5개월',
    name: '글로벌 통합계정관리',
    company: '에스투피테크',
    client: '현대오토에버',
    stack: 'Java · JSP · Struts · DB2',
    team: '',
    tasks: [
      '통합계정(그룹웨어) 기능 유지보수',
      'NoSQL·RDBMS 간 계정 동기화 장애 처리\n—한쪽만 삭제된 계정 20건을 양쪽 DB 대조 후 삭제 로직에 맞춰 정리',
    ],
    proof: '',
  },
  {
    period: '2020.01 ~ 2020.08',
    months: '8개월',
    name: 'N-STEP SM 요금분야',
    company: '에스투피테크',
    client: 'KT-MEG',
    stack: 'Java · JSP · Spring · Oracle',
    team: '',
    tasks: [
      'KT 기업 고객 요금 배치 운영·모니터링 \n—월 마감 시 천만 건 단위 데이터를 다음 달로 이월하며 이력 기록\n—실패 건 원인 분석과 재처리',
      '데이터 정합성 점검 및 유지보수, 산출물 문서 작성',
    ],
    proof: '',
  },
  {
    period: '2019.01 ~ 2019.12',
    months: '11개월',
    name: '새올행정시스템 상하수도 분야',
    company: '해오름인포텍',
    client: '한국지역정보개발원',
    stack: 'Delphi · Oracle',
    team: '',
    tasks: [
      '지자체 상하수도 요금 업무 1선 문의 대응\n—요금 계산 오류, 요율 변경, 고지서 출력, 감면 적용',
      'Delphi 화면과 SQL 수정으로 유지보수. 시도별로 다른 업무 처리 방식 확인 후 반영',
    ],
    proof: '',
  },
]
