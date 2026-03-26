
## [Unreleased]
### Fixed
- Added permanent redirects from legacy site URLs and old sitemap endpoints to the current blog/tour/contact routes so old SEO traffic from the previous site can land on the new structure instead of 404 pages.
- Added more legacy redirect mappings for old category/tag/tour URLs and returned `410 Gone` for irrelevant old junk/search/`wp-content` URLs so Google can drop non-travel pages instead of keeping them as soft leftovers.
- Fixed recent blog detail pages so CTA button blocks render cleanly and content sections/list blocks have looser spacing for easier reading.
- Fixed tours search page to use the Neon DB data layer instead of legacy Strapi fetches, restoring working search/filter results on production.
- Fixed the mobile header contact link to use `/lienhe` consistently.
- Fixed blog detail rendering for new Facebook-derived posts that include `list` content blocks, preventing production 500 errors on those articles.

### Changed
- Added `DEPLOY-BACKUP.md` to document the exact backup/restore items needed so switching to a new Vercel account can be restored quickly without rebuilding setup from scratch.
- Added local backup/restore scripts for deploy-critical files with rotating retention: keep 5 recent days and 2 snapshots per day.
- Added a local admin Backup page with one-click backup, backup picker, and restore actions via `/api/backup` and `/api/backup/restore`.
- Added macOS launchd automation to run deploy backups automatically at 09:00 and 21:00 daily.
- Added a custom styled 404 page and a new `/lienhe` contact landing page with direct hotline, Zalo, email, and fanpage actions.
- Corrected the legacy `/Tour/tour-dong-hung-3-ngay-2-dem` redirect so old SEO traffic lands on the actual Đông Hưng 3N2Đ page instead of the Nam Ninh route.
- Added a static `llms.txt` file so the canonical domain no longer returns 404 for that crawler-facing endpoint.
- Tightened tour/blog/category JSON-LD output by trimming long descriptions, sanitizing FAQ answers, limiting itinerary payloads, and using cleaner provider/offer fields for schema consumers.

## [Unreleased]
### Added
- Add \"Ăn sập Đông Hưng\" menu-style landing page for Đông Hưng food content.

### Changed
- Add month/day departure selector for daily-selling Đông Hưng 1 Ngày tour.
- Reduced homepage hero banner render cost by prioritizing the active slide image, avoiding lazy LCP loading, and cutting stacked off-screen slide images from the initial render path.
- Added safe speculation rules for key internal routes and bfcache-friendly header state resets so repeat navigations/back-forward flows feel faster without aggressive prerendering.
- Normalized new admin image uploads to WebP in the upload API so future tour/blog/settings images are lighter by default.
- Smoothed the homepage tour card slideshow so the first image stays longer and subsequent image changes feel less jumpy.
- Tightened tours hub/category ItemList schema and TravelAgency address markup to resolve the latest Semrush structured-data invalid item warnings.
