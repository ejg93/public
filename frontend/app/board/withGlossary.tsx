'use client'
import { GLOSSARY } from './glossary'
import GlossaryTerm from './GlossaryTerm'

// 용어 사전의 키를 긴 것부터 찾는다. 짧은 키가 긴 키의 앞부분을 가로채는 것을 막는다
const TERM_RE = new RegExp(
  '(' + Object.keys(GLOSSARY)
    .sort((a, b) => b.length - a.length)
    .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|') + ')',
  'g',
)

// 평문에서 용어를 찾아 뜻을 달아 준다.
// shown 에 이미 있는 낱말은 그냥 글자로 둔다 — 같은 말에 밑줄이 여러 번 그이면 지저분하다
export function glossaryNodes(text: string, shown: Set<string>) {
  return text.split(TERM_RE).map((piece, n) => {
    if (!GLOSSARY[piece] || shown.has(piece)) return <span key={n}>{piece}</span>
    shown.add(piece)
    return <GlossaryTerm key={n} term={piece} desc={GLOSSARY[piece]} />
  })
}
