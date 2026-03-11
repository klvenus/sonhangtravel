
## [Unreleased]
### Fixed
- Fixed tours search page to use the Neon DB data layer instead of legacy Strapi fetches, restoring working search/filter results on production.
- Fixed the mobile header contact link to use `/lienhe` consistently.

### Changed
- Added `DEPLOY-BACKUP.md` to document the exact backup/restore items needed so switching to a new Vercel account can be restored quickly without rebuilding setup from scratch.
- Added local backup/restore scripts for deploy-critical files with rotating retention: keep 5 recent days and 2 snapshots per day.
- Added a local admin Backup page with one-click backup, backup picker, and restore actions via `/api/backup` and `/api/backup/restore`.
- Added macOS launchd automation to run deploy backups automatically at 09:00 and 21:00 daily.
- Added a custom styled 404 page and a new `/lienhe` contact landing page with direct hotline, Zalo, email, and fanpage actions.
