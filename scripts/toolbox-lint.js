// toolbox 단일 파일 HTML 의 「절대 규칙」을 기계로 잡는다(frontend/public/toolbox/CLAUDE.md).
//   node scripts/toolbox-lint.js <파일...>    걸리면 exit 1
//
// 잡는 것 둘
//   1  외부에서 받아오는 자원 — script src·link href·img src·css url()·@import·fetch·XHR 의 http(s) 주소.
//      폐쇄망 PC 에서는 로드 자체가 실패해서 도구가 안 뜬다.
//   4  도구 파일 안의 주석 — 변경 이력·설계 메모는 개선사항_메모.md 로 간다.
//
// 왜 토크나이저가 필요하나 — 이 도구들은 주석 기호를 **데이터로** 갖고 있다.
// dev_tools 의 주석 제거기는 ['/*','*/'] 를 표에 담고, sql_snippets 는 힌트 `/*+ ... */` 를
// 문자열로 만들어 낸다. 단순 grep 은 그 전부를 주석으로 세서 못 쓴다.
// 그래서 스크립트 구간은 문자열·템플릿·정규식을 건너뛰며 훑는다.
const fs = require("fs");

const files = process.argv.slice(2);
if (!files.length) { console.error("usage: toolbox-lint.js <file...>"); process.exit(2); }

// <script> 안쪽 구간을 [시작, 끝) 으로 모은다
function scriptRanges(src) {
  const out = [];
  const open = /<script\b[^>]*>/gi;
  let m;
  while ((m = open.exec(src))) {
    const start = m.index + m[0].length;
    const end = src.indexOf("</script>", start);
    if (end < 0) break;
    out.push([start, end]);
    open.lastIndex = end;
  }
  return out;
}

// 문자열·템플릿·정규식을 건너뛰면서 주석 위치만 모은다
function jsComments(src, from, to) {
  const hits = [];
  let i = from;
  // 정규식이 올 수 있는 자리인지 — 직전 의미 있는 글자로 가른다. 나눗셈과 정규식은 같은 글자다
  let prev = "";
  while (i < to) {
    const c = src[i];
    const c2 = src[i + 1];

    if (c === '"' || c === "'" || c === "`") {
      const quote = c;
      i++;
      while (i < to) {
        if (src[i] === "\\") { i += 2; continue; }
        if (src[i] === quote) { i++; break; }
        i++;
      }
      prev = quote;
      continue;
    }

    if (c === "/" && c2 === "/") {
      hits.push({ type: "줄", index: i });
      while (i < to && src[i] !== "\n") i++;
      continue;
    }

    if (c === "/" && c2 === "*") {
      hits.push({ type: "블록", index: i });
      i += 2;
      while (i < to && !(src[i] === "*" && src[i + 1] === "/")) i++;
      i += 2;
      continue;
    }

    if (c === "/" && /[=(,:[!&|?{};+\-*%~^<>]|^$/.test(prev)) {
      // 정규식 리터럴. 안에 // 나 /* 가 들어 있어도 주석이 아니다
      i++;
      let inClass = false;
      while (i < to) {
        if (src[i] === "\\") { i += 2; continue; }
        if (src[i] === "[") inClass = true;
        else if (src[i] === "]") inClass = false;
        else if (src[i] === "/" && !inClass) { i++; break; }
        else if (src[i] === "\n") break;
        i++;
      }
      prev = "/";
      continue;
    }

    if (!/\s/.test(c)) prev = c;
    i++;
  }
  return hits;
}

const lineOf = (src, index) => src.slice(0, index).split(/\r?\n/).length;

const LOADERS = [
  ["script src", /<script[^>]+\bsrc\s*=\s*["']([^"']+)["']/gi],
  ["link href", /<link[^>]+\bhref\s*=\s*["']([^"']+)["']/gi],
  ["img src", /<img[^>]+\bsrc\s*=\s*["']([^"']+)["']/gi],
  ["css url()", /url\(\s*["']?((?:https?:)?\/\/[^)"']+)/gi],
  ["@import", /@import\s+["']?((?:https?:)?\/\/[^"';]+)/gi],
  ["fetch", /fetch\(\s*["'`]((?:https?:)?\/\/[^"'`]+)/gi],
  ["XHR", /\.open\(\s*["'][A-Z]+["']\s*,\s*["']((?:https?:)?\/\/[^"']+)/gi],
];

let fail = 0;
for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  const out = [];

  for (const [kind, re] of LOADERS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src))) {
      if (!/^(https?:)?\/\//.test(m[1])) continue;
      out.push(`${lineOf(src, m.index)}: [외부] ${kind} 가 바깥을 본다 — 폐쇄망에서는 로드가 실패한다: ${m[1].slice(0, 60)}`);
    }
  }

  const ranges = scriptRanges(src);
  const inScript = (i) => ranges.some(([a, b]) => i >= a && i < b);

  // HTML 주석. 스크립트 안의 것은 문자열일 수 있으니 여기서는 바깥만 본다
  const htmlComment = /<!--[\s\S]*?-->/g;
  let h;
  while ((h = htmlComment.exec(src))) {
    if (inScript(h.index)) continue;
    if (/^<!--\s*\[if/.test(h[0])) continue;
    out.push(`${lineOf(src, h.index)}: [주석] 도구 파일에 주석을 안 남긴다 — 개선사항_메모.md 로 옮긴다: ${h[0].slice(0, 40).replace(/\s+/g, " ")}`);
  }

  for (const [a, b] of ranges) {
    for (const c of jsComments(src, a, b)) {
      out.push(`${lineOf(src, c.index)}: [주석] ${c.type}주석을 안 남긴다 — 개선사항_메모.md 로 옮긴다: ${src.slice(c.index, c.index + 40).replace(/\s+/g, " ")}`);
    }
  }

  if (out.length) {
    // 파일을 여러 개 받았을 때만 이름을 찍는다. doc-lint 는 이미 이름을 찍고 부른다
    if (files.length > 1) console.log(file);
    console.log(out.map((l) => "    " + l).join("\n"));
    fail = 1;
  }
}
process.exit(fail);
