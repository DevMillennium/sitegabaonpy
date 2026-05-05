#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [[ ! -f .vercel/project.json ]]; then
  echo "Erro: execute primeiro na raiz do projeto: vercel link --yes --project sitegabaonpy" >&2
  exit 1
fi
PID="$(node -e "console.log(JSON.parse(require('fs').readFileSync('.vercel/project.json','utf8')).projectId)")"
exec vercel api "/v1/projects/${PID}/unpause" --method POST
