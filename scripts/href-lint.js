// 경로 문자열에 인코딩 안 된 비ASCII 가 들어갔는지 tsx·ts 에서 잡는다.
//   node scripts/href-lint.js <파일> [all | 1,2,3]   검사할 줄 번호. 없거나 all 이면 전체
//
// 왜 있나 — 2026-09-12 에 /toolbox 샘플 링크가 `/toolbox/논리명_변환기_sample/...` 로 나갔다.
// 브라우저는 주소창에 넣을 때 알아서 인코딩해 클릭은 됐지만, 그 href 를 복사해 요청하면 404 다.
// 타입체크·lint·build 가 전부 통과시킨 자리라 기계로 따로 센다.
//
// 규칙은 하나다 — `/` 로 시작하는 문자열 리터럴에 비ASCII 가 있으면 **그 자리에서** encodeURI 로 감싼다.
// 상수에 날것으로 담아 두고 쓰는 쪽에서 감싸는 방식은 감싸는 것을 빠뜨리기 쉬워서 막는다.
// 안 보는 것: 주석, 비ASCII 가 없는 경로, 같은 줄에서 이미 encodeURI 로 감싼 자리.
const fs = require("fs");
const [file, spec] = process.argv.slice(2);
if (!file) { console.error("usage: href-lint.js <file> [all|1,2,3]"); process.exit(2); }
const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
const only = !spec || spec === "all" ? null : new Set(spec.split(",").map(Number));

const nonAscii = /[^\x00-\x7F]/;
const isComment = (t) => /^\s*(\/\/|\/\*|\*|\{\/\*)/.test(t);
const pathLiteral = /['"`](\/[^'"`\n]*)['"`]/g;

const out = [];
lines.forEach((raw, i) => {
  const n = i + 1;
  if (only && !only.has(n)) return;
  if (isComment(raw) || !nonAscii.test(raw)) return;
  if (/encodeURI(Component)?\s*\(/.test(raw)) return;

  let m;
  pathLiteral.lastIndex = 0;
  while ((m = pathLiteral.exec(raw))) {
    if (!nonAscii.test(m[1])) continue;
    out.push(`${n}: 경로에 인코딩 안 된 글자가 있다 — encodeURI 로 감싼다: ${m[1].slice(0, 48)}`);
  }
});
if (out.length) { console.log(out.join("\n")); process.exit(1); }
