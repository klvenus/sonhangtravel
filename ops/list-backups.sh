#!/usr/bin/env bash
set -euo pipefail

BACKUP_ROOT="/Users/khumlong/sonhangtravel/backups/vercel-snapshots"
shopt -s nullglob
files=("$BACKUP_ROOT"/*.tar.gz)

if [ ${#files[@]} -eq 0 ]; then
  echo "No backups found"
  exit 0
fi

for f in "${files[@]}"; do
  base="$(basename "$f")"
  stamp="${base%.tar.gz}"
  echo "$stamp"
done | sort -r
