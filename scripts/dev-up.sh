#!/usr/bin/env bash
# e2e 의 backend.spec 은 백엔드가 8080 에 떠 있을 때만 돈다. 없으면 조용히 건너뛰어서
# 「안 돌아서 통과」가 「돌아서 통과」처럼 보인다. 그 상태를 없애려고 여기서 띄우고 기다린다.
#
#   bash scripts/dev-up.sh            백엔드만 띄운다
#   bash scripts/dev-up.sh --front    프론트 빌드본도 3100 에 같이 띄운다
#   bash scripts/dev-up.sh --down     띄운 것을 내린다
#
# 로그는 .git/ 아래에 남긴다. 커밋 대상이 아니다.
set -uo pipefail
cd "$(dirname "$0")/.."

JDK17="C:/Program Files/Java/jdk-17.0.19"
BACK_LOG=.git/dev-up-backend.log
FRONT_LOG=.git/dev-up-frontend.log

port_pid() {
  case "$(uname -s)" in
    MINGW*|MSYS*|CYGWIN*) netstat -ano | grep ":$1 .*LISTENING" | awk '{print $5}' | head -1 ;;
    *) lsof -ti ":$1" 2>/dev/null | head -1 ;;
  esac
}

kill_port() {
  pid=$(port_pid "$1")
  [ -z "$pid" ] && { echo "   $1 포트는 비어 있다"; return; }
  case "$(uname -s)" in
    MINGW*|MSYS*|CYGWIN*) taskkill //PID "$pid" //F >/dev/null 2>&1 ;;
    *) kill -9 "$pid" 2>/dev/null ;;
  esac
  echo "   $1 포트의 $pid 를 내렸다"
}

wait_for() { # url, 초, 이름
  for _ in $(seq 1 "$2"); do
    curl -sf -m 2 "$1" >/dev/null 2>&1 && { echo "   $3 준비됨"; return 0; }
    sleep 1
  done
  echo "   $3 이 $2 초 안에 안 떴다"
  return 1
}

if [ "${1:-}" = "--down" ]; then
  echo "== 내린다"
  kill_port 8080
  kill_port 3100
  exit 0
fi

echo "== backend 8080"
if curl -sf -m 2 http://localhost:8080/api/jobs >/dev/null 2>&1; then
  echo "   이미 떠 있다"
else
  case "$(uname -s)" in MINGW*|MSYS*|CYGWIN*) export JAVA_HOME="$JDK17" ;; esac
  (cd backend && ./mvnw -B -q spring-boot:run) >"$BACK_LOG" 2>&1 &
  wait_for http://localhost:8080/api/jobs 90 "backend" || { tail -20 "$BACK_LOG"; exit 1; }
fi

if [ "${1:-}" = "--front" ]; then
  echo "== frontend 3100 (빌드본)"
  if curl -sf -m 2 http://localhost:3100 >/dev/null 2>&1; then
    echo "   이미 떠 있다 — 낡은 빌드일 수 있으니 필요하면 --down 뒤 다시 띄운다"
  else
    (cd frontend && NEXT_DIST_DIR=.next-e2e npm run build && NEXT_DIST_DIR=.next-e2e npm run start -- -p 3100) >"$FRONT_LOG" 2>&1 &
    wait_for http://localhost:3100 180 "frontend" || { tail -20 "$FRONT_LOG"; exit 1; }
  fi
  echo
  echo "e2e 를 이 서버로 돌리려면: cd frontend && E2E_REUSE=1 npm run e2e"
else
  echo
  echo "이제 bash scripts/verify.sh 를 돌리면 backend.spec 까지 같이 돈다."
fi
