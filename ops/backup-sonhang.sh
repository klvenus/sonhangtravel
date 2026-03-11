#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/khumlong/sonhangtravel"
BACKUP_ROOT="$ROOT/backups/vercel-snapshots"
STAMP="$(TZ=Asia/Ho_Chi_Minh date +%Y-%m-%d_%H-%M-%S)"
DEST="$BACKUP_ROOT/$STAMP"
TMP="$DEST/tmp"
KEEP_DAYS=5
KEEP_PER_DAY=2

mkdir -p "$TMP"

copy_if_exists() {
  local src="$1"
  local dest="$2"
  if [ -e "$src" ]; then
    mkdir -p "$(dirname "$dest")"
    cp -R "$src" "$dest"
  fi
}

# Metadata
cat > "$DEST.meta.json" <<JSON
{
  "createdAt": "$(TZ=Asia/Ho_Chi_Minh date +%Y-%m-%dT%H:%M:%S%z)",
  "timezone": "Asia/Ho_Chi_Minh",
  "root": "$ROOT",
  "kind": "vercel-account-restore-snapshot"
}
JSON

# Copy critical files only
copy_if_exists "$ROOT/frontend/.env.local" "$TMP/frontend/.env.local"
copy_if_exists "$ROOT/admin/.env.local" "$TMP/admin/.env.local"
copy_if_exists "$ROOT/backend/.env" "$TMP/backend/.env"
copy_if_exists "$ROOT/telegram-bot/.env" "$TMP/telegram-bot/.env"
copy_if_exists "$ROOT/zalo-miniapp/.env" "$TMP/zalo-miniapp/.env"
copy_if_exists "$ROOT/.env" "$TMP/.env"
copy_if_exists "$ROOT/frontend/vercel.json" "$TMP/frontend/vercel.json"
copy_if_exists "$ROOT/frontend/package.json" "$TMP/frontend/package.json"
copy_if_exists "$ROOT/frontend/package-lock.json" "$TMP/frontend/package-lock.json"
copy_if_exists "$ROOT/frontend/next.config.ts" "$TMP/frontend/next.config.ts"
copy_if_exists "$ROOT/admin/package.json" "$TMP/admin/package.json"
copy_if_exists "$ROOT/admin/package-lock.json" "$TMP/admin/package-lock.json"
copy_if_exists "$ROOT/admin/next.config.ts" "$TMP/admin/next.config.ts"
copy_if_exists "$ROOT/backend/.env.example" "$TMP/backend/.env.example"
copy_if_exists "$ROOT/DEPLOY-BACKUP.md" "$TMP/DEPLOY-BACKUP.md"
copy_if_exists "$ROOT/ADMIN-README.md" "$TMP/ADMIN-README.md"
copy_if_exists "$ROOT/OPENCLAW-GUIDE.md" "$TMP/OPENCLAW-GUIDE.md"
copy_if_exists "$ROOT/README.md" "$TMP/README.md"

# Optional local Vercel linkage if present
copy_if_exists "$ROOT/frontend/.vercel/project.json" "$TMP/frontend/.vercel/project.json"
copy_if_exists "$ROOT/admin/.vercel/project.json" "$TMP/admin/.vercel/project.json"

(
  cd "$TMP"
  tar -czf "$DEST.tar.gz" .
)
rm -rf "$TMP"

# Prune: keep only newest 2 backups per day, for last 5 days
python3 - <<'PY'
from pathlib import Path
from collections import defaultdict
from datetime import datetime
import os
import re

backup_root = Path('/Users/khumlong/sonhangtravel/backups/vercel-snapshots')
keep_days = 5
keep_per_day = 2
pattern = re.compile(r'^(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})$')
entries = []
for tar in backup_root.glob('*.tar.gz'):
    name = tar.name[:-7]
    m = pattern.match(name)
    if not m:
        continue
    dt = datetime.strptime(name, '%Y-%m-%d_%H-%M-%S')
    entries.append((dt, name, tar))

entries.sort(reverse=True)
days = []
by_day = defaultdict(list)
for dt, name, tar in entries:
    day = dt.strftime('%Y-%m-%d')
    if day not in days:
        days.append(day)
    by_day[day].append((dt, name, tar))

keep = set()
for day in days[:keep_days]:
    for dt, name, tar in by_day[day][:keep_per_day]:
        keep.add(tar)
        meta = backup_root / f'{name}.meta.json'
        if meta.exists():
            keep.add(meta)

for path in backup_root.iterdir():
    if path in keep:
        continue
    if path.is_file():
        path.unlink()
PY

echo "Backup created: $DEST.tar.gz"
ls -1 "$BACKUP_ROOT" | sort -r | head -20
