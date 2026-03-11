#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/khumlong/sonhangtravel"
BACKUP_ROOT="$ROOT/backups/vercel-snapshots"
TARGET="${1:-}"

if [ -z "$TARGET" ]; then
  echo "Usage: $0 <backup-name-or-path>"
  echo "Available backups:"
  ls -1 "$BACKUP_ROOT"/*.tar.gz 2>/dev/null | xargs -n1 basename | sort -r
  exit 1
fi

if [[ "$TARGET" = /* ]]; then
  ARCHIVE="$TARGET"
else
  ARCHIVE="$BACKUP_ROOT/$TARGET"
fi

if [ ! -f "$ARCHIVE" ]; then
  echo "Backup not found: $ARCHIVE"
  exit 1
fi

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

tar -xzf "$ARCHIVE" -C "$TMP_DIR"

restore_if_exists() {
  local src="$1"
  local dest="$2"
  if [ -e "$src" ]; then
    mkdir -p "$(dirname "$dest")"
    cp -R "$src" "$dest"
    echo "Restored: $dest"
  fi
}

restore_if_exists "$TMP_DIR/.env" "$ROOT/.env"
restore_if_exists "$TMP_DIR/frontend/.env.local" "$ROOT/frontend/.env.local"
restore_if_exists "$TMP_DIR/admin/.env.local" "$ROOT/admin/.env.local"
restore_if_exists "$TMP_DIR/backend/.env" "$ROOT/backend/.env"
restore_if_exists "$TMP_DIR/telegram-bot/.env" "$ROOT/telegram-bot/.env"
restore_if_exists "$TMP_DIR/zalo-miniapp/.env" "$ROOT/zalo-miniapp/.env"
restore_if_exists "$TMP_DIR/frontend/vercel.json" "$ROOT/frontend/vercel.json"
restore_if_exists "$TMP_DIR/frontend/package.json" "$ROOT/frontend/package.json"
restore_if_exists "$TMP_DIR/frontend/package-lock.json" "$ROOT/frontend/package-lock.json"
restore_if_exists "$TMP_DIR/frontend/next.config.ts" "$ROOT/frontend/next.config.ts"
restore_if_exists "$TMP_DIR/admin/package.json" "$ROOT/admin/package.json"
restore_if_exists "$TMP_DIR/admin/package-lock.json" "$ROOT/admin/package-lock.json"
restore_if_exists "$TMP_DIR/admin/next.config.ts" "$ROOT/admin/next.config.ts"
restore_if_exists "$TMP_DIR/backend/.env.example" "$ROOT/backend/.env.example"
restore_if_exists "$TMP_DIR/DEPLOY-BACKUP.md" "$ROOT/DEPLOY-BACKUP.md"
restore_if_exists "$TMP_DIR/ADMIN-README.md" "$ROOT/ADMIN-README.md"
restore_if_exists "$TMP_DIR/OPENCLAW-GUIDE.md" "$ROOT/OPENCLAW-GUIDE.md"
restore_if_exists "$TMP_DIR/README.md" "$ROOT/README.md"
restore_if_exists "$TMP_DIR/frontend/.vercel/project.json" "$ROOT/frontend/.vercel/project.json"
restore_if_exists "$TMP_DIR/admin/.vercel/project.json" "$ROOT/admin/.vercel/project.json"

echo
echo "Restore done from: $ARCHIVE"
echo "Next steps:"
echo "1) cd $ROOT/frontend && npm install && npm run build"
echo "2) cd $ROOT/admin && npm install && npm run build"
echo "3) relink/deploy Vercel if needed: vercel link && vercel --prod"
