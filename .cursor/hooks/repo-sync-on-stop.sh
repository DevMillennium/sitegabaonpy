#!/usr/bin/env bash
# Após uma paragem do agente, tenta enviar alterações para o remoto (não bloqueia o Cursor).
cat >/dev/null
ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0
cd "$ROOT" || exit 0
bash scripts/repo-sync.sh 2>/tmp/cursor-repo-sync.log || true
exit 0
