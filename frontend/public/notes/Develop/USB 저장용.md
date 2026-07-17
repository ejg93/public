# USB 저장용

*last modified: 2026-05-15T05:32:49.000Z*

*개발 파견시 필요한 앱

변수명 사이트같은거

버전 최신화 생각해서….

1.intellji

2.노트패트++ + 플러그인

Compare

, csv lint

, explorer

, poor man's T-sql formatter

, JS Tool

, XML Tools

, **TextFX Characters**

,SQLinForm 등등의 플러그인

3.반디집

4.everything

**5.snakeTail**

6.fileZilla or WinSCP

9.db - HeidiSQL

10.Q-dir 폴더 4개 분할

11.WinMerge 하드한 비교분석

12.변수명 Eclipse Extension (Codel이나 Variable Name Helper), GoldenDict

13.WINDOW MANAGER 자투리

14.adobe

15.개발용 html (카멜표기법+sql 구문 정리+문법 확인)

16.엑셀 양식 - 개발용

17.HOP -한글 대체제

18.내 싸인

19.eclipse 설정파일

20.레지스트리로 Bing 검색 꺼버리기

Win + R → regedit

→ 엔터 아래 경로로 이동: HKEY_CURRENT_USER\SOFTWARE\Policies\Microsoft\Windows\Explorer Explorer

키 없으면 우클릭으로 새로 만들어. 거기서 새로 만들기

→ DWORD(32비트) 값 → 이름 DisableSearchBoxSuggestions → 값 1

21.msoffice

22.adobe

========굳이?=============

1.Git

2.CurrPorts - 프로그램 port 연결확인

3.epic pen , gink , zoomit 모니터 낙서툴

Tesseract OCR

Rapid Environment Editor - 환경변수 변경용, 중요도 낮음

================================================

안꺼지는 서버 끄기

Netstat -ano | findstr :8080 |

TASKKILL /F /PID [찾은번호]

Window Cmd 명령어 hostname,ping

==============================================================

정규 표현식(RegEx) 템플릿

**이메일 :** 일반적인 이메일 주소 형식 검증

^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$

**휴대전화 :** 010-XXXX-XXXX 형식 검증

^010-?([0-9]{4})-?([0-9]{4})$

**날짜 (YYYYMMDD) :**8자리 날짜 형식 검증

^(\d{4})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$

**숫자만**

^\d+$

양의 정수

\d

**소수점 포함 숫자 :** ^-? (음수 부호 선택적) + . 소수점 선택적.

^-?\d+(\.\d+)?$

**영문/숫자 혼합 :** ID나 암호에 영문 및 숫자만 허용, 다른 특수 문자나 공백은 허용하지 않는다.

^[a-zA-Z0-9]+$

**공백 치환으로 제거용 :** \s**,** [\\s](file://s)

정규표현식 예시

[0-9]{8}

^[0-9]+$

^[0-9]*$

^[^a-zA-Z0-9!@#$%^&*(),.?":{}|<>]*$

^[a-zA-Z가-힣0-9]*$

==============================================================

**HTML 태그 제거**

문자열 내의 모든 HTML 태그를 제거 (치환용)

<[^>]*>

replaceAll("<[^>]*>", "") 형태로 사용하여 XSS 방어 등 필터링 시 사용.

// Java 코드 예시

String htmlInput = "<h1>제목입니다.</h1> <p style=\"color:red;\">내용입니다.</p><script>alert('xss');</script>";

// 정규식: <(.*?)>

String regex = "<(.*?)>";

// 결과: "제목입니다. 내용입니다." (모든 태그가 제거됨)

String cleanText = htmlInput.replaceAll(regex, "");

==============================================================

프로그램 state 상태 종류

1.**LISTEN**

프로세스가 특정 포트에서 **외부 연결을 기다리는 중**

서버(Tomcat, Spring Boot)가 **정상적으로 구동**되어 요청을 받을 준비가 됐는지 확인.

포트 충돌 여부를 1차적으로 확인.

**2.ESTABLISHED**

**활성 연결**이 설정되어 데이터 송수신 중

개발 중인 애플리케이션이 **DB, 외부 API 서버 등**과 통신을 **성공적**으로 맺었는지 확인

3.**TIME_WAIT**

연결 종료 후, **오래된 패킷**이 네트워크에 남아있을 경우를 대비해 **잠시 대기 중**

웹 서버에서 부하가 심할 경우 이 상태가 **과도하게 많아지면** 성능 저하의 원인이 될 수 있음

**4.CLOSE_WAIT**

원격지에서 연결을 종료했지만, 로컬 애플리케이션이 **아직 종료하지 않은 상태**

애플리케이션에서 **리소스 해제(소켓 닫기)** 로직에 버그나 문제가 없는지 확인.

이 상태가 오래되면 **연결 누수(Connection Leak)** 의심.

**5.SYN_SENT**

연결을 시작하기 위해 **SYN 패킷을 보냈고 응답을 기다리는 중**

**방화벽**이나 **네트워크 지연** 때문에 연결이 안 되고 멈춰 있는지 확인.

==============================================================

Lock

:트랜잭션(사용자)이 동시에 동일한 데이터에 접근하여 데이터를 수정할 때,

데이터의 일관성과 무결성을 깨뜨리는 것을 방지하기 위해 사용되는 메커니즘

Granularity 그래널레러티

:락의 범위. 락은 적용되는 범위에 따라 **테이블 전체**에 걸릴 수도 있고,

특정 **페이지/블록**, 특정 Row에만 걸릴 수도 있다

Deadlock 교착상태

쿼리 사용 중 Lock 걸리는 경우

**1.DML 작업 충돌**

2.DeadLock 서로에게 제한

3.테이블/스키마 변경

4.SELECT FOR UPDATE

5.트랜잭션 격리 수준에 따른 락 (읽기 중 충돌)

-- 락 정보 조회

SELECT

L1.SID AS holding_sid, -- 락을 걸고 있는 세션 ID

S1.USERNAME AS holding_user,

L2.SID AS waiting_sid, -- 락을 기다리는 세션 ID

S2.USERNAME AS waiting_user,

O.OBJECT_NAME -- 락이 걸린 테이블/객체 이름

FROM

V$LOCK L1, V$LOCK L2, V$SESSION S1, V$SESSION S2, ALL_OBJECTS O

WHERE

L1.BLOCK = 1 AND L2.REQUEST > 0

AND L1.ID1 = L2.ID1 AND L1.ID2 = L2.ID2

AND L1.SID = S1.SID

AND L2.SID = S2.SID

AND L1.ID1 = O.OBJECT_ID -- 락이 걸린 객체 ID를 테이블 이름과 연결

ORDER BY

L1.SID, L2.SID;

-- 락의 원인이 된 $\text{SQL}$ 조회

SELECT SQL_TEXT

FROM V$SQLTEXT

WHERE SID = [holding_sid 값] -- 락을 걸고 있는 세션 ID 입력

ORDER BY PIECE;

-- 느린 $\text{SQL}$ 찾기

SELECT

A.SQL_ID,

A.EXECUTIONS, -- 실행 횟수

A.ELAPSED_TIME / A.EXECUTIONS AS avg_time_ms, -- 평균 소요 시간 (밀리초)

B.SQL_TEXT

FROM

V$SQL A, V$SQLTEXT B

WHERE

A.SQL_ID = B.SQL_ID

AND A.EXECUTIONS > 0 -- 실행된 쿼리만

ORDER BY

avg_time_ms DESC; -- 평균 시간이 오래 걸리는 쿼리 순서대로 정렬

-- 특정 테이블에 걸려있는 모든 인덱스 목록 및 컬럼 확인

SELECT

T.INDEX_NAME,

I.COLUMN_NAME,

I.COLUMN_POSITION

FROM

ALL_INDEXES T,

ALL_IND_COLUMNS I

WHERE

T.OWNER = '사용자스키마명'

AND T.TABLE_NAME = '테이블명'

AND T.INDEX_NAME = I.INDEX_NAME

ORDER BY

T.INDEX_NAME, I.COLUMN_POSITION;

-- 현재 활성 세션 확인

SELECT

SID,

USERNAME,

STATUS, -- ACTIVE (작업 중)인지 INACTIVE (대기 중)인지

CLIENT_PROGRAM_ID, -- 어떤 프로그램 (DBeaver 등)으로 접속했는지

SQL_ID -- 현재 실행 중인 쿼리의 ID

FROM

V$SESSION

WHERE

USERNAME IS NOT NULL

ORDER BY

LAST_CALL_ET DESC; -- 마지막 작업 이후 경과 시간

--프로시저 정보 조회

SELECT

A.PROCEDURE_NAME, -- 프로시저 이름

A.OWNER, -- 소유자 (스키마)

A.CREATED, -- 생성 날짜

A.LAST_DDL_TIME, -- 마지막 수정 날짜 (DDL 수행 시간)

A.STATUS -- 현재 상태 (VALID, INVALID 등)

FROM

USER_PROCEDURES A

ORDER BY

A.PROCEDURE_NAME;

