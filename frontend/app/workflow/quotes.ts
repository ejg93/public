// 강제 지점이 실제로 막을 때 찍히는 메시지. 전부 원문 그대로다 — 다듬으면 증거가 아니게 된다.
// 화면에서는 <pre> 로 그린다. 원문이 한 줄이면 한 줄로 둔다(줄바꿈 규칙 7의 대상이 아니다).

export const QUOTE_STOP =
  '커밋 안 된 작업물이 있다 — 청크 하나 = 커밋 하나, 미완이면 WIP 커밋을 남긴다(CLAUDE.md 「청크 규칙」). 버릴 것이면 git stash 로 치운다.'

export const QUOTE_PUSH =
  'full 도장이 없다: backend — push 앞엔 bash scripts/verify.sh --full (느린 레인·next build) 이 HEAD 에서 초록이어야 한다(2z-2).'

export const QUOTE_PR_BASE =
  'PR 의 base 는 언제나 main 이다(2g-1). 쌓아 올리면 아래가 머지될 때 GitHub 이 base 없는 PR 을 닫고, 닫힌 PR 은 reopen 도 base 변경도 안 된다.'

export const QUOTE_PR_SERIAL =
  '열린 작업 PR 이 1 개 있다. 직렬로 간다(2g-1) — 앞 PR 을 머지하고 다음 묶음을 연다.'

export const QUOTE_DOC_DATE =
  '[제목에 날짜] doc/reference/money-rules.md — 기준 문서는 「지금 무엇이 맞나」만 답한다. 이력은 PROGRESS.md 로(doc/README.md):'

export const QUOTE_DOC_STYLE =
  '[존댓말] CLAUDE.md — 개발자가 읽는 글은 평서형이다(CLAUDE.md 「글 작성 규칙」 4번):'

export const QUOTE_REQ =
  '테스트가 언급하지 않는 요건: 14/40 — R2 R10 R12 R13 R23 R26 R27 R29 R30 R31 R33 R35 R38 R39'

export const QUOTE_LINEBREAK =
  '[줄바꿈] frontend/app/projectshop/page.tsx — 고친 줄이 규칙 7에 걸린다(CLAUDE.md 「글 작성 규칙」 7):\n40: A 조각 109폭 > 95 — 의미 단위에서 <br /> 또는 \n 으로 끊는다'
