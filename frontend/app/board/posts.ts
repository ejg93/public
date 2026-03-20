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
    title: '버튼 하나로 보는 좆같은 UX',
    category: 'UI/UX',
    date: '2026-03-20',
    summary: '클릭하기 두려운 버튼, 어디에나 있는 그 버튼. 뭐가 문제인지 직접 눌러보면서 확인해보자.',
    tags: ['UX', 'UI', '버튼', '설계'],
    blocks: [
      {
        type: 'text',
        content: `UX를 망치는 버튼들은 생각보다 주변에 많다. 색깔이 문제인 경우도 있고, 위치가 문제인 경우도 있고, 텍스트가 문제인 경우도 있다. 아래 예시를 직접 눌러보자.`,
      },
      {
        type: 'demo',
        demoId: 'bad-buttons',
        label: '👎 나쁜 버튼들',
      },
      {
        type: 'text',
        content: `위 버튼들의 공통점이 보이는가? 클릭하기 전에 이미 불안하다. 색이 배경과 비슷하거나, 텍스트가 애매하거나, 위치가 예상 밖이다.\n\n좋은 버튼은 "클릭해도 되겠다"는 확신을 준다.`,
      },
      {
        type: 'demo',
        demoId: 'good-buttons',
        label: '👍 좋은 버튼들',
      },
      {
        type: 'text',
        content: `차이가 느껴지는가? 같은 기능이라도 버튼 하나가 사용자의 행동을 완전히 바꾼다. 이게 UX다.`,
      },
    ],
  },
  {
    id: 'scroll-trap',
    title: '스크롤이 사용자를 가두는 방법',
    category: 'UI/UX',
    date: '2026-03-18',
    summary: '무한 스크롤, 팝업, 중첩 스크롤. 사용자를 가두는 패턴들을 모아봤다.',
    tags: ['스크롤', 'UX', '안티패턴'],
    blocks: [
      {
        type: 'text',
        content: `스크롤 자체는 문제가 없다. 문제는 스크롤이 "함정"이 될 때다. 대표적인 패턴 3가지를 살펴보자.`,
      },
      {
        type: 'text',
        content: `**1. 무한 스크롤의 함정**\n\n끝이 없는 피드. 유튜브, 인스타그램이 쓰는 방식이다. 콘텐츠를 소비하게 만들기엔 좋지만, 사용자가 "여기까지 봤다"는 기준점을 잃는다. 페이지네이션이 오히려 사용자에게 통제감을 준다.`,
      },
      {
        type: 'text',
        content: `**2. 중첩 스크롤**\n\n스크롤 안에 스크롤. 모달 안에 스크롤 가능한 목록이 있을 때, 사용자는 어느 스크롤이 반응하는지 매번 클릭해서 확인해야 한다. 이 프로젝트의 AI 배틀 페이지도 초기에 이 문제가 있었다.`,
      },
      {
        type: 'text',
        content: `**3. 팝업이 닫히지 않는 문제**\n\nX 버튼이 어디있는지 모르거나, ESC로 안 닫히거나, 닫으면 다시 뜨거나. 팝업을 여러 개 띄우는 것 자체가 이미 UX 실패다. 이 포트폴리오의 About Me 페이지에서 팝업 대신 사이드 패널을 선택한 이유가 여기 있다.`,
      },
    ],
  },
  {
    id: 'ai-design-sense',
    title: 'AI 시대에 개발자에게 필요한 설계 감각',
    category: '개발',
    date: '2026-03-15',
    summary: 'AI가 코드를 짜주는 시대. 개발자가 가져야 할 건 타이핑 속도가 아니라 설계 감각이다.',
    tags: ['AI', '설계', '개발자', '생산성'],
    blocks: [
      {
        type: 'text',
        content: `친구한테 이런 말을 들었다.\n\n"개발자냐 아니냐보다, 문제를 고치려는 의지(문제의식)만 있으면 AI로 뭐든 할 수 있는 시대가 왔다."\n\n처음엔 과장이라고 생각했다. 이 포트폴리오를 만들면서 생각이 바뀌었다.`,
      },
      {
        type: 'text',
        content: `**AI는 발산형 도구다**\n\n"버튼 만들어줘"라고 하면 열 가지 버튼을 줄 수 있다. 그 중 어느 게 지금 상황에 맞는지는 AI가 모른다. 현실의 제약 - 사용자가 누구인지, 어떤 흐름에서 보이는지, 브랜드 톤이 뭔지 - 를 아는 건 사람이다.`,
      },
      {
        type: 'text',
        content: `**설계 감각이란**\n\nOptimistic Response를 알고 모르고의 차이다. 이미지 업로드 기능을 만들 때 단순히 \`<input type="file">\`을 달면 기능은 된다. 근데 사용자는 업로드 중에 아무 피드백이 없으면 다시 클릭한다. 중복 업로드가 생긴다. UX가 망가진다.\n\nAI는 이걸 모른다. 물어봐야 안다. 그러려면 먼저 내가 알아야 한다.`,
      },
      {
        type: 'code',
        lang: 'typescript',
        label: 'Optimistic Response 패턴 예시',
        code: `// ❌ 나쁜 예 - 서버 응답 기다리는 동안 아무것도 안 함
async function uploadImage(file: File) {
  const result = await api.upload(file)  // 사용자는 그냥 기다림
  setImage(result.url)
}

// ✅ 좋은 예 - 즉시 미리보기 보여주고 나중에 확정
async function uploadImage(file: File) {
  const preview = URL.createObjectURL(file)
  setImage(preview)  // 즉시 보여줌
  
  try {
    const result = await api.upload(file)
    setImage(result.url)  // 서버 URL로 교체
  } catch {
    setImage(null)  // 실패하면 제거
    showError('업로드 실패')
  }
}`,
      },
      {
        type: 'text',
        content: `코드 한 줄 차이가 UX를 완전히 바꾼다. 이걸 아는 것, 이게 설계 감각이다.`,
      },
    ],
  },
]
