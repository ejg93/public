#!/usr/bin/env bash
# 건드린 구역이 무엇을 돌릴지 정한다. HEAD 대비 바뀐 파일(미추적 포함)을 보고
# frontend/ 코드가 바뀌었으면 typecheck·build(lint 포함), backend/ 가 바뀌었으면 mvnw compile 을 돌린다.
# 출력은 실패했을 때만 보여 준다 — 통과한 빌드 로그는 읽을 것이 없다.
#
#   bash scripts/verify.sh          바뀐 구역만
#   bash scripts/verify.sh --all    둘 다
#
# public/ 아래 정적 HTML 은 안 본다. 그 구역 CLAUDE.md 「검증」이 든다.
set -uo pipefail
cd "$(dirname "$0")/.."

changed=$( { git diff HEAD --name-only 2>/dev/null; git ls-files --others --exclude-standard; } | sort -u )
hit() { [ "${1:-}" = "--all" ] || printf '%s\n' "$changed" | grep -qE "$2"; }
fe=0; be=0
hit "${1:-}" '^frontend/(app|components|lib)/|^frontend/(package\.json|package-lock\.json|next\.config\.js|tsconfig\.json|tailwind\.config\.js|\.eslintrc\.json)$' && fe=1
hit "${1:-}" '^backend/(src/|pom\.xml$)' && be=1

# 초록일 때 작업트리 tree 해시를 도장으로 남긴다. push hook 이 이것만 보고 판단한다(hook-push-gate.sh).
stamp() {
  tmp=$(mktemp)
  GIT_INDEX_FILE="$tmp" git read-tree HEAD 2>/dev/null
  GIT_INDEX_FILE="$tmp" git add -A . 2>/dev/null
  GIT_INDEX_FILE="$tmp" git write-tree 2>/dev/null > .git/verify-stamp
  rm -f "$tmp"
}

log=$(mktemp); trap 'rm -f "$log"' EXIT
ok=1
if [ $fe = 1 ]; then
  echo "== frontend 바뀜 → npm run typecheck · npm run build(lint 포함)"
  (cd frontend && npm run typecheck && npm run build) >"$log" 2>&1 || { tail -40 "$log"; ok=0; }
fi
if [ $be = 1 ]; then
  echo "== backend 바뀜 → ./mvnw compile (JDK 17)"
  # 시스템 JAVA_HOME 은 JDK 11 이라 못 쓴다(backend/CLAUDE.md 「검증」). 리눅스 러너는 그대로.
  case "$(uname -s)" in MINGW*|MSYS*|CYGWIN*) export JAVA_HOME="C:/Program Files/Java/jdk-17.0.19" ;; esac
  (cd backend && ./mvnw -B -q compile) >"$log" 2>&1 || { grep -E 'ERROR|error:' "$log" | head -30; ok=0; }
fi
if [ $fe = 0 ] && [ $be = 0 ]; then
  echo "frontend·backend 코드가 안 바뀌었다 — 돌릴 것이 없다. public/ 정적 파일은 그 구역 CLAUDE.md 「검증」."
  stamp
  exit 0
fi
[ $ok = 1 ] && { stamp; echo "초록"; } || { echo "빨갛다"; exit 1; }
