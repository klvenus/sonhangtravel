#!/usr/bin/env bash
set -euo pipefail

PLIST_SRC="/Users/khumlong/sonhangtravel/ops/com.sonhang.backup.plist"
PLIST_DEST="$HOME/Library/LaunchAgents/com.sonhang.backup.plist"

mkdir -p "$HOME/Library/LaunchAgents"
cp "$PLIST_SRC" "$PLIST_DEST"
launchctl unload "$PLIST_DEST" >/dev/null 2>&1 || true
launchctl load "$PLIST_DEST"
launchctl enable "gui/$(id -u)/com.sonhang.backup" >/dev/null 2>&1 || true

echo "Installed launch agent: $PLIST_DEST"
launchctl list | grep com.sonhang.backup || true
