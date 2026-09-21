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
# public/notes·game·docrules 는 뺀다 — 요청받은 파일만 고치는 구역이라 여기서 규칙을 안 건다. study 는 2026-09-22 부터 든다.
# md 와 study 는 백틱·「」 안을 걷어낸다(인용). 그 밖의 tsx·html 은 문자열이 곧 화면 문구라 안 걷는다.
#
# tsx·html 은 줄바꿈 규칙(7번)도 본다 — scripts/linebreak-lint.js 가 고친 줄만 센다.
set -uo pipefail
cd "$(dirname "$0")/.."

PAT='(습니다|합니다|하세요|입니다)'

in_scope() {
  case "$1" in
    */node_modules/*|*/.next/*|doc/design-standards/*|frontend/public/toolbox/db_docs/*) return 1 ;;
    frontend/public/notes/*|frontend/public/game/*|frontend/public/docrules/*) return 1 ;;
    *.md|frontend/app/*.ts|frontend/app/*.tsx|frontend/components/*.tsx|frontend/public/toolbox/*.html|frontend/public/study/*.html) return 0 ;;
  esac
  return 1
}

# 존댓말 검사만 면제하는 자리. 줄바꿈·경로 검사는 그대로 받는다.
# demos.tsx 는 다크 패턴을 보여 주려고 다른 앱이 뱉는 말을 그대로 옮겨 둔 데이터다 —
# 내가 쓰는 글이 아니라 인용이고, md 에서 백틱으로 감싸 면제하는 것과 같은 성격이다.
quotes_ui() {
  case "$1" in
    frontend/app/board/demos.tsx) return 0 ;;
  esac
  return 1
}

# md 와 학습 노트(study)는 인용을 걷어낸다 — 노트는 강의 제목을 「」로 옮긴 자리가 있다.
# `sed 's/「[^」]*」//'` 는 멀티바이트를 바이트로 갈라서 조용히 안 먹는다 — perl 을 쓴다.
strip() {
  case "$1" in
    *.md|frontend/public/study/*.html) perl -CSD -pe 's/`[^`]*`//g; s/\x{300C}.*?\x{300D}//g' ;;
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
    if quotes_ui "$f"; then hits=""; else hits=$(printf '%s\n' "$lines" | strip "$f" | grep -E "$PAT" || true); fi
    if [ -n "$hits" ]; then
      echo "[존댓말] $f — 고친 줄에 있다. 평서형으로 쓴다(CLAUDE.md 「글 작성 규칙」 4). 남의 말을 옮긴 것이면 md 는 백틱이나 「」로 감싼다:"
      printf '%s\n' "$hits" | sed 's/^/    /'
      fail=1
    fi
    case "$f" in *.tsx|*.html)
      if git ls-files --error-unmatch -- "$f" >/dev/null 2>&1; then
        nums=$(git diff HEAD -U0 -- "$f" 2>/dev/null | awk '/^@@/{split($3,a,","); s=substr(a[1],2)+0; c=(a[2]=="")?1:a[2]+0; for(k=0;k<c;k++) printf "%d,", s+k}' | sed 's/,$//')
      else
        nums=all
      fi
      if [ -n "$nums" ]; then
        lb=$(node scripts/linebreak-lint.js "$f" "$nums" || true)
        if [ -n "$lb" ]; then
          echo "[줄바꿈] $f — 고친 줄이 규칙 7에 걸린다(CLAUDE.md 「글 작성 규칙」 7):"
          printf '%s\n' "$lb" | sed 's/^/    /'
          fail=1
        fi
        hr=$(node scripts/href-lint.js "$f" "$nums" || true)
        if [ -n "$hr" ]; then
          echo "[경로] $f — 고친 줄의 URL 에 인코딩 안 된 글자가 있다. encodeURI 로 감싼다:"
          printf '%s\n' "$hr" | sed 's/^/    /'
          fail=1
        fi
      fi
    ;; esac
    # toolbox 단일 파일은 폐쇄망 반입물이라 외부 로드가 하나만 섞여도 현장에서 안 뜬다.
    # 고친 줄이 아니라 파일 전체를 본다 — 지금 0 건이라 쌓인 빚이 없다.
    case "$f" in frontend/public/toolbox/*.html)
      tb=$(node scripts/toolbox-lint.js "$f" || true)
      if [ -n "$tb" ]; then
        echo "[toolbox] $f — 폐쇄망 규칙에 걸린다(toolbox/CLAUDE.md 「절대 규칙」):"
        printf '%s\n' "$tb" | sed 's/^/    /'
        fail=1
      fi
    ;; esac
  done
  exit $fail
fi

total=0
while IFS= read -r f; do
  in_scope "$f" || continue
  [ -f "$f" ] || continue
  n=$(strip "$f" <"$f" | grep -cE "$PAT" || true)
  case "$f" in *.tsx|*.html) lb=$(node scripts/linebreak-lint.js "$f" all | grep -c . || true) ;; *) lb=0 ;; esac
  if [ "${n:-0}" -gt 0 ] || [ "${lb:-0}" -gt 0 ]; then echo "$f: 존댓말 $n · 줄바꿈 $lb"; total=$((total + n + lb)); fi
done < <( { git ls-files; git ls-files --others --exclude-standard; } | sort -u )
echo "남은 존댓말·줄바꿈: $total — 막지 않는다. hook 은 고친 줄만 막는다"
