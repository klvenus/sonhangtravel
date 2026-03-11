
## [2026-03-10] Task: Fix website search not returning results
- [x] Trace search UI + data flow
- [x] Fix root cause in frontend/backend
- [x] Verify search works

## [2026-03-10] Task: Fix live search on /tours after browser-level repro
- [x] Trace runtime state updates in ToursPageClient
- [x] Implement a verifiable browser-working fix
- [x] Build, push, and re-test in Hidemium

## 2026-03-11 Task: Vercel backup + admin local audit
- [x] Check local admin/frontend deploy-related files
- [x] Identify what must be backed up outside git
- [x] Add restore doc for moving to a new Vercel account

- [x] Add rotating backup scripts (keep 5 recent days, 2 snapshots/day)
- [x] Create backup reminder cron jobs at 09:00 and 21:00 Asia/Saigon

- [x] Add admin Backup page + API routes for one-click backup/restore
- [x] Build admin to verify backup UI works

- [x] Install real local auto-backup via macOS launchd at 09:00 and 21:00
