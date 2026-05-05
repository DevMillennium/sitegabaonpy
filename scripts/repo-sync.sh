#!/usr/bin/env bash
# Adiciona, faz commit (se houver mudanças) e push para origin na branch atual.
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0
cd "$ROOT"

CURRENT="$(git branch --show-current 2>/dev/null)" || true
if [[ -z "${CURRENT:-}" ]]; then exit 0; fi

git add -A
if git diff --cached --quiet && git diff --quiet; then
  exit 0
fi

TS="$(date -u +"%Y-%m-%dT%H:%MZ")"
git commit -m "chore: sync automático $TS" || true

if ! git push origin "$CURRENT"; then
  echo "repo-sync: push falhou (rede, auth ou branch protegido)." >&2
  exit 1
fi
