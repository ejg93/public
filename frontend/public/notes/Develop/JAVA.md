# JAVA

*last modified: 2026-01-05T02:10:00.000Z*

JAVA

1. IRP 계좌만들기

2. 연금저축계좌로 600만원

IRP 계좌 300만원

3.나머지는 ISA 계좌

4.현대 신용카드

- 폰비, 가스비,전기세, 보험비, 교통비, 유튭,intelji,히트싱크

interface SqlSession

@Slf4j Simple Logging Facade for Java

로그에 대한 추상 레이어를 제공하는 인터페이스의 모음

@RequiredArgsConstructor

Lombok으로 스프링에서 DI(의존성 주입)의 방법 중에 생성자 주입을

임의의 코드없이 자동으로 설정해주는 어노테이션

@Controller 이 클래스가 컨트롤러임을 선언한다

@RequestMapping("/api") localhost:8080/api

일단 둘 다 클래스 위에 적힘

@GetMapping("/admNotice")

@RequestMapping(method = RequestMethod.GET, path = "/admNotice")

GET 요청 방식의 API , HTTP GET 요청이 왔을때 동작을 한다.

path 값을 URL에 매핑한다. (위에서는 localhost:8080/api/admNotice와 매핑됨)

GET 통신에서는 @RequestParam을 사용하여 명칭을 적용

ex) public String checkId(@RequestParam("id") String id, @RequestParam("pwd") String pwd, Model model) {

localhost:8080/api/checkId?id=123&pwd=456 이와 같이 적으며 값을 넘김

@PostMapping(""/admNotice.json")

@RequestMapping(method=RequestMethod.POST, path = "/admNotice.json")

POST 요청 방식의 API

POST 통신에서는 @RequestBody를 이용하여 HTTP Body에 담긴 데이터를 매핑하여 가지고 온다

받은 데이터를 그대로 return하여 응답을 보낸다.

내부적으로 Jackson라이브러리에 의해 알아서 JSON 포맷으로 변환된다

일반적인 GET/POST의 요청 파라미터라면 @RequestBody를 사용할 일이 없음

xml이나 json 기반의 메시지를 사용하는 요청의 경우에 이 방법이 유용"

상위 객체(부모)의 특징(메소드, 변수 등)을

'새롭게 구현'하는가, '그대로 사용'하는가에 따라서

상속의 형태가 갈리게 된다

Extends (단일 상속만 가능)

부모에서 선언/정의를 모두 하며 자식은 오버라이딩 할 필요 없이

부모의 메소드/변수를 그대로 사용할 수 있다.

implements (interface 구현) (다중 상속 가능)

부모 객체는 선언만 하며, 정의는 반드시 자식이 오버라이딩해서 사용한다.

abstract

extends와 interface의 혼합이다.

extends를 사용하지만, 몇 개는 추상 메소드로 구현되어 있다.

upcasting

*List list = new ArrayList();

-> 도형 list = new 정사각형();

Sync

Override and commit

Maven-

Checkout

update,

install

Checkout : 프로젝트 받아오기

Vaildating : 프로젝트의 구조나 파일 내부의 오류를 검사하는 작업

Clean : 빌드 시 생성된 파일들을 제거하고, 프로젝트를 초기화

Build : 소스 코드를 컴파일하여 바이너리 파일(클래스 파일 등)을 생성

@AuthenticationPrincipal UserDTO usrDTO

로그인을 위한 객체

UserDetailsService로 구현된 객체 확인하면 됨

전자정부 프레임워크:

정부 기관의 전자정부 시스템을 구축하고 운영하기 위한 솔루션 제공

사용 방법: 전자정부 프레임워크는 공공 서비스를 제공하기 위한 다양한 기능과 보안 요구 사항을 포함

정부 기관의 업무 효율성과 시민 서비스 품질을 향상시키기 위해 사용

전자정부 시스템의 구축, 관리, 통합, 보안 등 다양한 측면을 지원

스프링 프레임워크:

목적: 자바 기반 엔터프라이즈 애플리케이션 개발을 위한 프레임워크 제공

사용 방법: 스프링 프레임워크는 자바 기반의 엔터프라이즈 애플리케이션을

개발하기 위한 프레임워크

주요 기능:의존성 주입(Dependency Injection), 제어 역전(Inversion of Control), 관점 지향 프로그래밍(Aspect-Oriented Programming) . 스프링 프레임워크는 모듈화가 잘 되어 있어 필요한 기능을 선택적으로 사용 가능

List<DTO> dtoList= new List<DTO>();

For(DTO dto : dtoList)

for (String key : hashMap.keySet())는

"key들의 목록"을 가져와 처리

for (Map.Entry<Integer, String> entry : treeMap.entrySet())는

"key와 value값의 목록" 가져오기

iterator : hasNext(), next(), remove()

해시 함수 : 임의 길이의 입력값을 받아 고정된 길이의 출력값을 내는 함수

List 유연한 배열

ArrayList

LinkedList 주소

Set 셋트메뉴 중복불가

HashSet 해시 함수

TreeSet 값 기준 트리형태로 정렬

Map 키, 값

HashMap, 해시 함수

TreeMap 키 기준 트리형태로 정렬

Comparable 또는 Comparator

**. try-catch (직접 처리) &#128736;️**

- **역할:** try 블록 내에서 발생할 수 있는 **예외를**
**메서드 내부에서 직접 잡아(Catch) 처리**.

- **목표:** 예외가 발생해도 프로그램이 갑자기 종료되는 것을 막고
사용자에게 알림을 주거나 자원을 정리(e.g., finally 블록)하는 등

정상적인 흐름을 유지

**Checked Exception (확인 예외)**

**특징: 컴파일러가 확인(Check)하는 예외**

**예시:** IOException, SQLException, FileNotFoundException

**처리 강제:** 이 예외들은 **코드 작성 시점에 반드시** try-catch로 잡거나

throws를 선언해서 **책임을 위임**해야만 컴파일 가능 (안하면 **컴파일 에러)**

**결론:** main 메서드에 throws Exception을 붙이는 건,

Checked Exception들을 try-catch로 잡기 싫으니 **JVM으로 최종 책임을 위임**하겠다는 뜻

**평소에는 위임 상태가 아니라 컴파일러가 처리를 강제**한다

**B. Unchecked Exception (비확인 예외)**

**특징: 컴파일러가 확인하지 않는 예외**로 주로 프로그래머의 실수(논리 오류)로 발생해.

**예시:** NullPointerException, ArrayIndexOutOfBoundsException, ArithmeticException

**처리 자유:** 이 예외들은 try-catch나 throws를 **선언하지 않아도 컴파일 가능**

**결론:** throws Exception이 없는데도 main 메서드에서 **오류가 뜨고 프로그램이 강제 종료**되는 것은

대부분 **Unchecked Exception**이 발생했기 때문임.

이 경우, 예외 처리를 명시적으로 하지 않았기 때문에

JVM의 기본 예외 핸들러로 자동 위임되어 강제 종료된다

Spring 환경에서의 예외 처리 흐름

DAO의 함수들에 throw exception 처리 -> Service 로 예외처리 책임 위임

| **구분** | **원시 타입 (Primitive Type)** | **래퍼 클래스 (Wrapper Class)** |
| --- | --- | --- |
| **대표 예시** | **int**, char, boolean, double | **Integer**, Character, Boolean, Double |
| **저장 위치** | **스택(Stack) 메모리** | **힙(Heap) 메모리** (객체) |
| **데이터 형태** | **실제 값** 자체를 저장 | 실제 값(primitive)을 감싸는 **객체**를 저장 (값은 객체 내부에) |
| **메모리/성능** | **효율적**, 연산 속도 **빠름** | 객체 헤더 등 오버헤드로 메모리 **더 사용**, 연산 속도 **느림** |
| **null 값** | **가질 수 없음** (기본값: 0, false 등) | **가질 수 있음** |
| **추가 기능** | 없음 | 문자열 변환, 범위 확인 등 **다양한 메서드** 제공 |

Stack Memory : 자동 관리됨, Last in First Out

heap Memory : 동적 메모리(개발자 관리),

| **구분** | **스택 영역 (Stack)** | **힙 영역 (Heap)** | **메서드 영역 (Method Area)** |
| --- | --- | --- | --- |
| **저장 대상** | **원시 타입 값** (int, double 등) 및  **참조 변수** (객체의 주소) | new로 생성된  **모든 객체** 및 **배열** | **클래스 메타데이터**,  **Static 변수**, **상수 풀** |
| **관리 주체** | **JVM 스레드**  (메서드 호출에 따라 자동 관리) | **Garbage Collector (GC)** | JVM |
| **공유 여부** | **스레드별 독립적** (가장 사적인 공간) | **모든 스레드 공유** | **모든 스레드 공유** |
| **데이터 구조** | **LIFO (Last In, First Out)** | 임의 접근 가능 | 고정된 구조  (프로그램 종료 시까지 유지) |
| **수명 주기** | **매우 짧음**  메서드 호출 시 생성  종료 시 소멸 | **비교적 김**  (GC가 수거할 때까지 존재) | **가장 김**  (JVM 프로세스 종료 시까지 유지) |
| **속도/효율** | **가장 빠름** (주소 계산 불필요) | 느림 (GC 오버헤드, 참조를 따라가야 함) | 보통 |
| **주요 에러** | **StackOverflowError**  (재귀 호출 등으로 스택 초과 시) | **OutOfMemoryError**  (객체가 너무 많아  메모리 부족 시) | OutOfMemoryError  (메타데이터 공간 부족 시) |

힙 메모리와 스택 메모리는 별개의 분리된 공간에 존재

@Transactional(rollbackFor = { Exception.class })

특정 메서드나 클래스의 트랜잭션 동작을 정의

어노테이션 annotation

@Deprecated 더 이상 사용되지 않는.

