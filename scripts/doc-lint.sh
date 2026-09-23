#!/usr/bin/env bash
# 존댓말 금지(루트 CLAUDE.md 「글 작성 규칙」 4)를 기계로 잡는다.
# 여섯 조항 중 금지어가 문자열로 정해진 유일한 조항이라 grep 으로 100% 잡힌다.
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
# app/board·app/youtube 도 뺀다(2026-09-24) — 둘 다 남의 말이 화면을 채우는 구역이다.
# 게시판은 다크 패턴을 재현하느라 다른 앱이 뱉는 문구를 옮겨 두었고, 유튜브 화면은 남의 댓글을 그대로 띄운다.
# 내 글과 옮긴 말이 한 파일에 섞여서 줄 단위로는 못 가른다. 줄바꿈·경로 검사도 같이 빠진다.
# about/qa-data.ts 도 뺀다 — 면접 질문에 답하는 자리라 읽는 쪽이 사람이고, 그 자리의 존댓말은
# 규칙이 막으려던 문어체 늘어짐이 아니다. 같은 폴더의 page.tsx·layout.tsx 는 그대로 받는다.
# md 와 study 는 백틱·「」 안을 걷어낸다(인용). 그 밖의 tsx·html 은 문자열이 곧 화면 문구라 안 걷는다.
#
# tsx·html 은 줄바꿈 규칙(7번)도 본다 — scripts/linebreak-lint.js 가 고친 줄만 센다.
set -uo pipefail
cd "$(dirname "$0")/.."

# 존댓말은 두 갈래로 잡는다. 어느 쪽인지에 따라 종결 위치를 보는지가 갈린다.
#  하십시오체(습니다·입니다…) 는 어느 명사에도 안 들어가서 줄 어디에 있든 잡아도 된다.
#  해요체(어요·아요·죠…) 는 명사와 부딪힌다 — 「좋아요」「중요」「필요」「개요」.
#  그래서 해요체만 문장부호 앞으로 묶는다. 이 저장소의 존댓말 15건 중 마침표가 없는 것은
#  「좋아요」 하나뿐이었고 그것이 유일한 오탐이라, 묶으면 오탐만 빠지고 위반은 다 남는다.
PAT_HON='(습니다|읍니다|합니다|입니다|하세요)'
PAT_YO='(어요|아요|에요|예요|세요|셔요|지요|네요|군요|거든요|는데요|까요|나요|죠)[.!?…]'
PAT="$PAT_HON|$PAT_YO"

in_scope() {
  case "$1" in
    */node_modules/*|*/.next/*|doc/design-standards/*|frontend/public/toolbox/db_docs/*) return 1 ;;
    frontend/public/notes/*|frontend/public/game/*|frontend/public/docrules/*) return 1 ;;
    frontend/app/board/*|frontend/app/youtube/*) return 1 ;;
    frontend/app/about/qa-data.ts) return 1 ;;
    *.md|frontend/app/*.ts|frontend/app/*.tsx|frontend/components/*.tsx|frontend/public/toolbox/*.html|frontend/public/study/*.html) return 0 ;;
  esac
  return 1
}


# md 와 학습 노트(study)는 인용을 걷어낸다 — 노트는 강의 제목을 「」로, 면접 질문을 &quot; 로 옮긴 자리가 있다.
# `sed 's/「[^」]*」//'` 는 멀티바이트를 바이트로 갈라서 조용히 안 먹는다 — perl 을 쓴다.
strip() {
  case "$1" in
    *.md|frontend/public/study/*.html) perl -CSD -pe 's/`[^`]*`//g; s/\x{300C}.*?\x{300D}//g; s/&quot;.*?&quot;//g; s/\x{201C}.*?\x{201D}//g' ;;
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
    case "$f" in *.tsx|*.html)
      if git ls-files --error-unmatch -- "$f" >/dev/null 2>&1; then
        nums=$(git diff HEAD -U0 -- "$f" 2>/dev/null | awk '/^@@/{split($3,a,","); s=substr(a[1],2)+0; c=(a[2]=="")?1:a[2]+0; for(k=0;k<c;k++) printf "%d,", s+k}' | sed 's/,$//')
      else
        nums=all
      fi
      if [ -n "$nums" ]; then
        lb=$(node scripts/linebreak-lint.js "$f" "$nums" || true)
        if [ -n "$lb" ]; then
          echo "[줄바꿈] $f — 고친 줄이 규칙 6에 걸린다(CLAUDE.md 「글 작성 규칙」 6):"
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
