#!/usr/bin/env bash
# PostToolUse hook 입구(.claude/settings.json). stdin 의 JSON 에서 고친 파일을 꺼내 doc-lint.sh 에 넘긴다.
#   file  Edit·Write — tool_input.file_path 하나
#   cmd   Bash·PowerShell — 파일을 쓰는 명령이면 HEAD 대비 바뀐 파일 전부
# 걸리면 exit 2 로 stderr 를 세션에 돌려준다. 그 밖엔 조용히 0.
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/..}" || exit 0
mode=${1:-file}
v=$(node -e 'let d="";process.stdin.on("data",x=>d+=x).on("end",()=>{try{const i=JSON.parse(d).tool_input||{};process.stdout.write(String(i.file_path||i.command||""))}catch(e){}})' 2>/dev/null)
[ -z "$v" ] && exit 0
if [ "$mode" = file ]; then
  files=$v
else
  printf '%s\n' "$v" | grep -qE 'sed -i|tee |>|node |Set-Content|Out-File|Add-Content|cp |mv ' || exit 0
  case "$v" in *doc-lint*|*verify.sh*) exit 0 ;; esac
  files=$( { git diff HEAD --name-only 2>/dev/null; git ls-files --others --exclude-standard; } | sort -u )
fi
[ -z "$files" ] && exit 0
out=$(printf '%s\n' "$files" | xargs -d '\n' bash scripts/doc-lint.sh 2>&1) || { printf '%s\n' "$out" >&2; exit 2; }
exit 0
