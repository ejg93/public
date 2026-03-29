// ── 게시물 데이터 타입 ─────────────────────────────────
export type CodeBlock = {
  type: 'code'
  lang: string
  code: string
  label?: string
}

export type TextBlock = {
  type: 'text'
  content: string
}

export type DemoBlock = {
  type: 'demo'
  demoId: string
  label?: string
}

export type ImageBlock = {
  type: 'image'
  src: string
  caption?: string
}

export type Block = TextBlock | CodeBlock | DemoBlock | ImageBlock

export type Post = {
  id: string
  title: string
  category: string
  date: string
  summary: string
  tags: string[]
  blocks: Block[]
}

// ── 게시물 목록 ────────────────────────────────────────
export const POSTS: Post[] = [
  {
    id: 'bad-ux-button',
    title: '일상에서 겪는 불편함',
    category: 'UI/UX',
    date: '2026-03-20',
    summary: '클릭하기 두려운 버튼, 어디에나 있는 그 버튼. 뭐가 문제인지 직접 눌러보면서 확인해보자.',
    tags: ['UX', 'UI', '버튼', '설계'],
    blocks: [
      {
        type: 'text',
        content: `[최악의 볼륨 UI](yt:https://youtube.com/shorts/Nf_DP1dyJ2E?si=PYFPE4djR1ss8Qj3)
        최근에 최악의 볼륨 UI라는 영상을 보면서 UI에 대한 생각들
        영상을 보면 그냥 웃기려고 만들어서 유쾌하지만
        진짜 열받는 UI들은 이렇게 유쾌하지 않았던 거 같다.
        별로 사용자 입장을 생각하지 못하거나 작동만 되면 되지 정도의 생각으로 만들어지거나
        의도 자체가 불순한 경우들이 많다.`,
      },
      {
        type: 'text',
        content: `**A. 입력 UX — 내가 어디 있는지 모르는 상황들**`,
      },
      {
        type: 'demo',
        demoId: 'capslock-demo',
        label: '🔐 로그인 입력창 비교',
      },
      {
        type: 'text',
        content:
`포커스 표시 없는 입력창, CapsLock 경고 없음, 첫 글자 자동 대문자.
전화번호 4자리 다 채우면 다음 칸으로 자동 이동하는데 수정하려고 이전 칸 누르면 또 넘어가버림.
탭키 안 먹히는 경우엔 마우스로 일일이 클릭해서 넘어가야 함.`,
      },
      {
        type: 'demo',
        demoId: 'button-feedback',
        label: '🖱 버튼 피드백 비교',
      },
      {
        type: 'text',
        content: `버튼을 눌렀는데 아무 반응이 없다가 1.5초 후에 완료 알림만 뜨는 경우. 눌린 건지 아닌 건지 모른다.`,
      },
      {
        type: 'text',
        content: `**B. 강제 유도 설계 — 거절을 강요하는 구조들**`,
      },
      {
        type: 'demo',
        demoId: 'install-checkbox',
        label: '☑ 설치 약관 동의 비교',
      },
      {
        type: 'text',
        content: `전체동의 버튼 하나 눌렀더니 마케팅 수신, 제3자 제공까지 전부 체크된다.`,
      },
      {
        type: 'demo',
        demoId: 'kiosk-demo',
        label: '🍔 키오스크 주문 체험',
      },
      {
        type: 'image',
        src: '/images/mobile-game-ui.png',
        caption: '모바일 게임의 전형적인 다크패턴 — 접속하자마자 구매 팝업, 카운트다운 압박, 화면 가득 찬 상점',
      },
      {
        type: 'text',
        content:
`며칠 내에만 살 수 있다는 카운트다운, 게임 켜자마자 뜨는 구매 팝업.
익숙한 게이머는 그러려니 하지만 처음 보는 사람 입장에서는 뭘 눌러야 할지도 모른다.
그리고 솔직히 저런 야한 자세로 부끄러워하는 캐릭터가 메인 화면에 있는 것도 그냥 싫다.`,
      },
    ],
  },
  {
    id: 'dark-pattern',
    title: '다크 패턴 — 설계가 사용자를 배신할 때',
    category: 'UI/UX',
    date: '2026-03-18',
    summary: '메신저를 넘어 쇼핑몰이 되기!',
    tags: ['다크패턴', 'UX', '카카오톡', '설계'],
    blocks: [
      {
        type: 'text',
        content:
`최근에 카카오톡을 보면서 과학콘서트라는 책이 생각났다.
그 책의 내용 중 하나가 마트 계산대 앞에 배치에는 전략이 있다는 내용이었다.
대기시간이 많은 계산대 앞에, 손이 닿기 좋은 높이에 누구나 좋아할 만한 간식이 많다.
비교적 불쾌감이 없는 매출상승을 위한 영리한 전략이다.`,
      },
      {
        type: 'demo',
        demoId: 'kakao-dark-pattern',
        label: '🎉 카카오톡 폭죽 버튼 체험',
      },
      {
        type: 'text',
        content:`
톡방에 들어가니 폭죽버튼이 바로 뜬다.
톡방내 생일인 사람이 있을 경우, 폭죽 버튼이 뜨고 누르는 순간 폭죽 이펙트가 터진다.
하지만 다들 알고 있듯 나서고 싶지않는 채팅방도 있다.. 
그런데 누군가 생일이라면 버튼이 표출되고 심지어는 선물 버튼도 나온다.`
      },
      {
        type: 'demo',
        demoId: 'kakao-emoji',
        label: '😊 이모티콘 버튼 체험',
      },
      {
        type: 'text',
        content:`
또 다른 불쾌한 케이스는 이모티콘이다.
쓰려고 하면 무료 이모티콘이 새로 나왔다며 먼저 띄우거나 플러스 이모티콘 광고를 띄운다.`
      },
      {
        type: 'image',
        src: '/images/kakao-friends.png',
        caption: '카카오톡 친구탭을 SNS 피드 형태로 개편한 모습. 메신저인지 인스타그램인지 모를 지경이 됐다. 결국 여론 악화로 롤백됐다.',
      },
      {
        type: 'text',
        content:`
카카오톡 친구 탭은 어느 순간 SNS가 됐고, 유튜브처럼 쇼츠가 생겼다.
이젠 이게 메신저인지 SNS인지 모르겠다.`,
      },
      {
        type: 'text',
        content:
`**이런 것을 Dark Pattern이라고 한다.**
사용자의 목적을 가로채거나, 감정을 이용하거나, 의도가 다분한 UI 설계다.
나쁜 UX는 실수지만 다크 패턴은 의도다.
마트는 애초에 목적 자체가 판매하는 것이라지만
'축하'에서 선물로 이으려는 의도가 메신저 치고는 과하다는 생각이 든다.`,
      },
    ],
  },
  {
    id: 'ai-design-sense',
    title: 'AI 시대에 개발자에게 필요한 설계 감각',
    category: '개발',
    date: '2026-03-15',
    summary: 'AI가 코드를 짜주는 시대. 우리에게 필요한 것은 설계 감각',
    tags: ['AI', '설계', '개발자', '생산성'],
    blocks: [
      {
        type: 'text',
        content:
`최근 Ai를 이용한 개발에 대해 영상이나 뉴스로만 접하다가
최근에 친구가 회사에서 사용할 시스템 구축을 위해 시범용 프로젝트를 만들게 됬다는 얘기를 들었다.
직접 만나서 해당 프로젝트 시현을 봤는데 왜 개발자들이 머리를 부여잡았는지 알게 되었다.
몇 년전에는 AI의 수준이 이 정도가 아니었지만 현재 AI의 수준은
회사내의 시스템을 꿰고 있기만 하면 누구라도 시스템을 구축할 수 있다.
이 친구의 말처럼 "문제를 고치려는 의지(혹은 문제의식)"만 있으면 뭐든 할 수 있는 시대가 왔다.`,
      },
      {
        type: 'text',
        content:
`**개발자들은 어떻게 적응해야하는가?**

개발자가 여태 사용해온게 칼과 방패라면 AI는 총이다.
총이 발명된 이상 황혼의 사무라이처럼 시대를 피할 수는 없다.
개발자들은 단축키, 문법, 라이브러리보다
"무엇을 만들지 설계하는 눈"이 더 중요해진 시대가 왔다.
적극적으로 AI 관련 기능을 활용하고 목적에 맞게 분류해서 이용해야한다.`,
      },
      {
        type: 'text',
        content:
`**설계 감각을 위해 배워야 할 것**
AI를 잘 쓴다는 건 결국 두 가지로 귀결된다. 목적과 조건.
목적은 단순하다. 내가 무엇을 만들고 싶은가. 목적성이 없으면 AI는 답안을 늘어놓을 뿐이다.
방향을 정하는 건 사람의 몫이고 조건은 환경에 따라 달라진다.
회사 업무라면 대부분 폐쇄망이다. AI를 자유롭게 쓸 수 없으니 이슈를 파악하는 건 나의 몫이다.
주어진 업무가 무엇인지, 그 안에서 어떤 문제가 생길 수 있는지 등등
AI와 소통하려면 그만큼 내 머릿속에 구조가 잡혀있어야 한다.
반면 이 포트폴리오처럼 오픈된 환경이라면 얘기가 다르다.
AI가 코드를 짜줘도 된다. 대신 이 경우엔 아키텍처를 알아야 한다.
어떤 구조로 만들지, 어디서 병목이 생기는지, 어떤 설계 선택이 나중에 발목을 잡는지.
AI에게 제대로 된 질문을 던지려면 결국 자신에게 질문을 던져야한다.`,
      },
    ],
  },
]
