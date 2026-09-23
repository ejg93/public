// 줄바꿈 규칙(루트 CLAUDE.md 「글 작성 규칙」 6)을 tsx·html 에서 기계로 잡는다.
//   node scripts/linebreak-lint.js <파일> [all | 1,2,3]   검사할 줄 번호. 없거나 all 이면 전체
// 한글·CJK 는 2폭, 나머지 1폭. 태그·JSX 식·주석은 폭에서 뺀다.
//
// 잡는 것 셋
//   A  조각(<br> 또는 \n 사이)의 폭이 95 를 넘는다
//   B  줄이 문장 끝(.)으로 끝나는데 다음 소스 줄이 본문으로 이어진다 — 브라우저가 한 줄로 붙인다
//   C  한 줄에 문장이 둘 이상인데 합쳐서 80폭을 넘는다
// 안 잡는 것: title= 속성, 주석. 인라인 힌트처럼 규칙이 「안 끊는다」로 둔 자리는 사람이 본다.
const fs = require("fs");
const [file, spec] = process.argv.slice(2);
if (!file) { console.error("usage: linebreak-lint.js <file> [all|1,2,3]"); process.exit(2); }
const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
const only = !spec || spec === "all" ? null : new Set(spec.split(",").map(Number));

const hangul = /[가-힣ㄱ-ㆎ一-鿿]/;
const width = (t) => [...t].reduce((w, ch) => w + (hangul.test(ch) ? 2 : 1), 0);
// 객체 리터럴 줄(`{ file: 'x', desc: '한글…' },`)은 첫 한글 앞의 마지막 `key: '` 까지가 코드다. 그 앞을 버린다.
const dropCodeHead = (t) => {
  const first = t.search(hangul);
  if (first < 0) return t;
  const head = t.slice(0, first);
  const m = [...head.matchAll(/[a-zA-Z_]+:\s*['"`]/g)].pop();
  return m ? t.slice(m.index + m[0].length) : t;
};
const strip = (t) => dropCodeHead(t)
  .replace(/\{\/\*.*?\*\/\}/g, "")
  .replace(/<[^>]*>/g, "")
  .replace(/\{[^{}]*\}/g, "")
  .replace(/&[a-z]+;/g, "\"")
  .replace(/['"`]\s*[,;]?\s*\}?,?\s*$/, "")   // 문자열 리터럴 꼬리
  .trim();
const isComment = (raw) => /^\s*(\/\/|\/\*|\*|<!--|\{\/\*)/.test(raw);
const startsProse = (raw) => /^\s*(&[a-z]+;)?[가-힣]/.test(raw);

// 한글이 든 문자열 리터럴만 뽑는다. 객체 리터럴 줄(`{ name: '이민수', text: '답장좀' }`)은 값마다 따로 잰다.
const literals = (t) => {
  const r = []; const re = /'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g; let m;
  while ((m = re.exec(t))) { const v = m[1] ?? m[2] ?? m[3]; if (hangul.test(v)) r.push(v); }
  return r;
};

// 규칙이 「안 끊는다」로 둔 자리 중 기계가 알아볼 수 있는 것: 줄 전체가 <span>…</span> 하나면 컨트롤 옆 인라인 힌트로 본다.
const isInlineHint = (raw) => /^\s*<span[\s>][^]*<\/span>\s*$/.test(raw) && (raw.match(/<span[\s>]/g) || []).length === 1;

const out = [];
// html 의 <script>·<style> 안은 코드, <!-- --> 안은 주석이다. 규칙 6 이 코드 블록을 빼므로 안 잰다.
// 둘을 따로 세는 이유: JS 안의 `i-->0` 같은 `-->` 가 주석 닫힘으로 읽히면 스크립트 상태가 풀린다.
// script 와 style 도 따로다: JS 문자열 안의 `'<style>…</style>'`(srcdoc) 이 script 상태를 풀면 안 된다.
// <svg> 안의 <text> 는 <br> 이 안 먹는 자리라 규칙 6 의 대상이 아니다. 도해 글자는 좌표로 놓는다.
// <pre> 안은 여러 줄짜리 코드·도해라 첫 줄만이 아니라 닫힐 때까지 뺀다.
let inScript = false, inStyle = false, inComment = false, inSvg = false, inPre = false;
lines.forEach((rawLine, i) => {
  const n = i + 1;
  if (!inStyle && /<script[\s>]/i.test(rawLine)) inScript = true;
  if (!inScript && /<style[\s>]/i.test(rawLine)) inStyle = true;
  if (!inScript && !inStyle && /<!--/.test(rawLine)) inComment = true;
  if (!inScript && !inStyle && /<svg[\s>]/i.test(rawLine)) inSvg = true;
  if (!inScript && !inStyle && /<pre[\s>]/i.test(rawLine)) inPre = true;
  const wasCode = inScript || inStyle || inComment || inSvg || inPre;
  if (inScript && /<\/script>/i.test(rawLine)) inScript = false;
  if (inStyle && /<\/style>/i.test(rawLine)) inStyle = false;
  if (!inScript && !inStyle && /-->/.test(rawLine)) inComment = false;
  if (inSvg && /<\/svg>/i.test(rawLine)) inSvg = false;
  if (inPre && /<\/pre>/i.test(rawLine)) inPre = false;
  if (only && !only.has(n)) return;
  const raw = rawLine.replace(/\son\w+=("[^"]*"|'[^']*')/g, "");   // onclick="…" 안은 코드다
  if (wasCode || !hangul.test(raw) || isComment(raw) || isInlineHint(raw) || /title=/.test(raw) || /<(pre|code)[\s>]/.test(raw)) return;

  const lits = literals(raw);
  const frags = lits.length
    ? lits.flatMap((v) => v.split(/\\n|<br\s*\/?>/)).map((v) => v.replace(/<[^>]*>/g, "").trim()).filter(Boolean)
    : raw.split(/<br\s*\/?>|\\n/).map(strip).filter(Boolean);
  if (!frags.length) return;

  for (const f of frags) {
    const w = width(f);
    if (w > 95) out.push(`${n}: A 조각 ${w}폭 > 95 — 의미 단위에서 <br /> 또는 \\n 으로 끊는다: ${f.slice(0, 40)}…`);
  }

  const trimmed = raw.replace(/\s+$/, "");
  const endsSentence = !lits.length && /[.!?](<\/[a-z]+>)?$/.test(trimmed);
  const endsBr = /<br\s*\/?>$/.test(trimmed);
  if (endsSentence && !endsBr) {
    let j = i + 1;
    while (j < lines.length && !lines[j].trim()) j++;
    if (j < lines.length && startsProse(lines[j]) && !isComment(lines[j])) {
      out.push(`${n}: B 문장이 끝났는데 ${j + 1}번 줄이 본문으로 이어진다 — 소스 개행은 화면에서 사라진다. 짧으면 한 줄로 합치고, 길면 <br /> 로 끊는다`);
    }
  }

  for (const f of frags) {
    const boundaries = (f.match(/[.!?]\s+(?=[가-힣A-Za-z(<"“])/g) || []).length;
    if (boundaries >= 1 && width(f) > 80) {
      out.push(`${n}: C 한 줄에 문장 ${boundaries + 1}개, ${width(f)}폭 > 80 — 문장 경계마다 <br /> 또는 \\n: ${f.slice(0, 40)}…`);
    }
  }
});
if (out.length) { console.log(out.join("\n")); process.exit(1); }
