#!/usr/bin/env bash
# Child-MBTI 배포 스크립트
# Draft 배포 후 Production 자동 승격 (netlify deploy --prod Forbidden 우회)
set -euo pipefail

SITE_ID="192cb87e-cde9-42a1-8a19-3c246110c454"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 1. 로그인 확인
if ! netlify status >/dev/null 2>&1; then
  echo "✗ Netlify 로그인이 필요합니다. 먼저 실행하세요:"
  echo "    netlify login"
  exit 1
fi

# 2. Draft 배포
echo "▶ Draft 배포 시작..."
DEPLOY_JSON=$(netlify deploy --dir="$SCRIPT_DIR" --json)

DEPLOY_ID=$(printf '%s' "$DEPLOY_JSON" | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    print(d.get('deploy_id') or d.get('id') or '')
except Exception:
    print('')
")

if [ -z "$DEPLOY_ID" ]; then
  echo "✗ Deploy ID 추출 실패. 원본 출력:"
  printf '%s\n' "$DEPLOY_JSON"
  exit 1
fi

DRAFT_URL=$(printf '%s' "$DEPLOY_JSON" | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    print(d.get('deploy_url') or d.get('url') or '')
except Exception:
    print('')
")

echo "✓ Draft 완료"
echo "  ID:  $DEPLOY_ID"
[ -n "$DRAFT_URL" ] && echo "  URL: $DRAFT_URL"
echo ""

# 3. Production 승격
echo "▶ Production 승격 중..."
netlify api restoreSiteDeploy \
  --data "{\"site_id\":\"$SITE_ID\",\"deploy_id\":\"$DEPLOY_ID\"}" \
  | python3 -c "
import json, sys
d = json.load(sys.stdin)
state = d.get('state', '?')
url   = d.get('ssl_url') or d.get('url', '?')
print(f'✓ Production 승격 완료 (state: {state})')
print()
print(f'🚀 Live: {url}')
"
