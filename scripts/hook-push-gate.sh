#!/usr/bin/env bash
# PreToolUse hook 입구(.claude/settings.json). 원격에 올리기 직전 검증 도장을 확인한다.
# 도장은 verify.sh 가 초록일 때 .git/verify-stamp 에 적는 작업트리 tree 해시다.
# 지금 트리와 도장이 다르면 exit 2 로 막는다 — 검사를 여기서 돌리지는 않는다.
# 빌드는 30초가 넘어 매번 멈추면 쓰기 싫어지고, 안 쓰이는 게이트는 없는 게이트다.
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/..}" || exit 0

# heredoc 본문은 빼고 본다. 커밋 메시지에 그 명령 이름을 적으면 글자에 걸린다 — 2026-09-12 에 실제로 걸렸다.
cmd=$(node -e 'let d="";process.stdin.on("data",x=>d+=x).on("end",()=>{try{const c=String((JSON.parse(d).tool_input||{}).command||"");const L=c.split("\n");const out=[];let end=null;for(const l of L){if(end!==null){if(l.trim()===end)end=null;continue}const m=l.match(/<<-?\s*["\x27]?([A-Za-z_][A-Za-z0-9_]*)["\x27]?/);out.push(l);if(m)end=m[1]}process.stdout.write(out.join("\n"))}catch(e){}})' 2>/dev/null)

printf '%s' "$cmd" | grep -qE '(^|[;&|[:space:]])git[[:space:]]+push([[:space:]]|$)' || exit 0

stamp=$(cat .git/verify-stamp 2>/dev/null || true)

# 작업트리(커밋 안 된 것 포함)의 tree 해시. 임시 인덱스라 진짜 인덱스를 안 건드린다.
tmp=$(mktemp); trap 'rm -f "$tmp"' EXIT
GIT_INDEX_FILE="$tmp" git read-tree HEAD 2>/dev/null
GIT_INDEX_FILE="$tmp" git add -A . 2>/dev/null
tree=$(GIT_INDEX_FILE="$tmp" git write-tree 2>/dev/null)

[ -n "$tree" ] || exit 0
[ "$stamp" = "$tree" ] && exit 0

if [ -z "$stamp" ]; then
  echo "검증 도장이 없다 — 원격에 올리기 앞엔 bash scripts/verify.sh 가 초록이어야 한다(루트 CLAUDE.md 「검증」)." >&2
else
  echo "검증 도장이 지금 트리와 다르다 — 도장을 찍은 뒤 파일이 바뀌었다. bash scripts/verify.sh 를 다시 돌린다." >&2
fi
exit 2
