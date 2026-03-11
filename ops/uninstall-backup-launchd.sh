#!/usr/bin/env bash
set -euo pipefail

PLIST_DEST="$HOME/Library/LaunchAgents/com.sonhang.backup.plist"
launchctl unload "$PLIST_DEST" >/dev/null 2>&1 || true
rm -f "$PLIST_DEST"
echo "Removed launch agent: $PLIST_DEST"
