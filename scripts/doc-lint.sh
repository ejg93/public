#!/usr/bin/env bash
# 존댓말 금지(루트 CLAUDE.md 「글 작성 규칙」 4)를 기계로 잡는다.
# 일곱 조항 중 금지어가 문자열로 정해진 유일한 조항이라 grep 으로 100% 잡힌다.
#
#   bash scripts/doc-lint.sh <파일...>   그 파일들의 「고친 줄」만 본다(HEAD 대비 추가된 줄. 미추적이면 전체).
#                                        hook 이 부른다(.claude/settings.json). 걸리면 exit 1.
#   bash scripts/doc-lint.sh             대상 전체를 훑어 파일별로 센다. 청소용이고 막지 않는다.
#
# 고친 줄만 보는 이유: board 글·youtube 화면처럼 남의 말을 옮긴 자리에 이미 40여 건이 있다.
# 파일 전체를 막으면 그 파일을 아예 못 고친다.
#
# 대상: md(CLAUDE·README·doc), frontend/app·components 의 ts·tsx(화면 문구), toolbox 의 html·md.
# public/notes·game·study·docrules 는 뺀다 — 요청받은 파일만 고치는 구역이라 여기서 규칙을 안 건다.
# md 는 백틱·「」 안을 걷어낸다(인용). tsx·html 은 문자열이 곧 화면 문구라 안 걷는다.
set -uo pipefail
cd "$(dirname "$0")/.."

PAT='(습니다|합니다|하세요|입니다)'

in_scope() {
  case "$1" in
    */node_modules/*|*/.next/*|doc/design-standards/*|frontend/public/toolbox/db_docs/*) return 1 ;;
    frontend/public/notes/*|frontend/public/game/*|frontend/public/study/*|frontend/public/docrules/*) return 1 ;;
    *.md|frontend/app/*.ts|frontend/app/*.tsx|frontend/components/*.tsx|frontend/public/toolbox/*.html) return 0 ;;
  esac
  return 1
}

# md 만 인용을 걷어낸다. `sed 's/「[^」]*」//'` 는 멀티바이트를 바이트로 갈라서 조용히 안 먹는다 — perl 을 쓴다.
strip() {
  case "$1" in
    *.md) perl -CSD -pe 's/`[^`]*`//g; s/\x{300C}.*?\x{300D}//g' ;;
    *) cat ;;
  esac
}

# hook 이 주는 경로는 Windows 절대경로다. 저장소 상대경로로 바꾼다.
rel() {
  local f=$1
  f=$(cygpath -u "$f" 2>/dev/null || printf '%s' "$f")
  f=${f#"$PWD/"}
  printf '%s' "$f"
}

fail=0
if [ $# -gt 0 ]; then
  for raw in "$@"; do
    f=$(rel "$raw")
    in_scope "$f" || continue
    [ -f "$f" ] || continue
    if git ls-files --error-unmatch -- "$f" >/dev/null 2>&1; then
      lines=$(git diff HEAD -U0 -- "$f" 2>/dev/null | grep -E '^\+[^+]' | sed 's/^+//')
    else
      lines=$(cat "$f")
    fi
    hits=$(printf '%s\n' "$lines" | strip "$f" | grep -E "$PAT" || true)
    if [ -n "$hits" ]; then
      echo "[존댓말] $f — 고친 줄에 있다. 평서형으로 쓴다(CLAUDE.md 「글 작성 규칙」 4). 남의 말을 옮긴 것이면 md 는 백틱이나 「」로 감싼다:"
      printf '%s\n' "$hits" | sed 's/^/    /'
      fail=1
    fi
  done
  exit $fail
fi

total=0
while IFS= read -r f; do
  in_scope "$f" || continue
  [ -f "$f" ] || continue
  n=$(strip "$f" <"$f" | grep -cE "$PAT" || true)
  if [ "${n:-0}" -gt 0 ]; then echo "$f: $n"; total=$((total + n)); fi
done < <( { git ls-files; git ls-files --others --exclude-standard; } | sort -u )
echo "남은 존댓말 줄: $total — 막지 않는다. hook 은 고친 줄만 막는다"
