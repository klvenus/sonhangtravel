## 2026-03-12 Task: Fix blog 500 on newly published Facebook-derived post
- [x] Add list block support to frontend blog types/renderer
- [x] Verify production/blog route no longer 500
- [x] Update changelog

## 2026-03-15 Task: Tidy recent blog layout CTA + spacing
- [x] Fix bottom blog CTA/button layout on recent posts
- [x] Increase spacing for blog outline/content blocks so paragraphs/lists breathe more
- [x] Verify recent blog pages render cleanly
- [x] Update changelog

## 2026-03-15 Task: Redirect legacy URLs from old site to new structure
- [x] Add permanent redirects for legacy travel URLs with current SEO signals
- [x] Redirect old sitemap/contact/category/tour patterns to current routes
- [x] Verify key legacy URLs return 301/308 to the intended new destinations
- [x] Clean up low-value legacy URLs with 410 when no relevant replacement exists
- [x] Update changelog

## 2026-03-22 Task: Add Ăn sập Đông Hưng landing page
- [ ] Inspect current frontend structure and existing blog routes
- [ ] Build landing page UI in menu-book style
- [ ] Verify with frontend build

## 2026-03-23 Task: Add monthly departure picker for Dong Hung 1 Day
- [x] Inspect tour detail departure UI and current data flow
- [x] Add 2-month month/day selector for daily-selling Dong Hung 1 Day
- [x] Build frontend and push

## 2026-03-23 Task: SEO cleanup from audit
- [x] Verify legacy /Tour redirects and /faqs handling
- [x] Fix wrong redirect mapping for Đông Hưng 3N2Đ legacy URL
- [x] Build frontend and push

## 2026-03-23 Task: Fix broken misc SEO endpoints
- [x] Confirm `llms.txt` 404 and `www` hostname DNS failure
- [x] Add static `frontend/public/llms.txt`
- [x] Build frontend and push

## 2026-03-23 Task: Tighten schema output for tour/blog/category pages
- [x] Audit current JSON-LD output on live pages
- [x] Sanitize long/dirty answer text for FAQ schema
- [x] Tighten tour/blog/category schema descriptions and itinerary fields
- [ ] Build frontend and push

## 2026-03-25 Task: Improve homepage banner LCP safely
- [x] Stop lazy-loading the LCP banner image
- [x] Reduce banner slide/image work on initial render
- [x] Build frontend and push

## 2026-03-25 Task: Add safe navigation performance hints
- [x] Add lightweight speculationrules for key internal routes
- [x] Add bfcache-friendly UI reset handling for header overlays/menus
- [x] Build frontend and verify

## 2026-03-26 Task: Auto-convert admin uploads to WebP
- [x] Update admin upload API to normalize image uploads to WebP
- [x] Update admin upload UI copy so behavior is clear
- [x] Build admin and verify

## 2026-03-26 Task: Smooth homepage tour card slideshow
- [x] Make the first tour card image stay longer before sliding
- [x] Smooth the follow-up card image transitions
- [x] Build frontend and verify

## 2026-03-26 Task: Fix Semrush structured data invalid items
- [x] Fix ItemList/ListItem schema on tours hub/category pages to avoid invalid carousel item URL fields
- [x] Strengthen TravelAgency/LocalBusiness address schema so Semrush no longer flags address on tour pages
- [x] Replace nested tour-page agency objects with a shared organization reference to avoid repeated LocalBusiness address warnings
- [x] Build frontend and push

## 2026-03-26 Task: Stop blog gallery image cropping
- [x] Show blog gallery preview images without cropping on mobile/desktop
- [x] Keep lightbox/full-view behavior intact
- [x] Build frontend and push

## 2026-03-26 Task: Render departure dates in blog as schedule cards
- [x] Detect paragraphs containing grouped departure dates
- [x] Restyle departure schedule block into a cleaner sale-style table with price emphasis
- [x] Build frontend and push

## 2026-03-26 Task: Remove broken speculationrules injection
- [ ] Remove speculationrules injection causing browser ignore + hydration mismatch
- [ ] Keep bfcache-safe UI reset without the broken script path
- [ ] Build frontend and push

## 2026-03-27 Task: Add GA4 tag to frontend
- [x] Wire GA4 measurement ID G-DDSZFXVZM3 into root layout
- [x] Build frontend and push

## 2026-03-27 Task: Increase crawl exposure for not-indexed URLs
- [x] Pull recent published blog links into shared footer
- [x] Keep key tour/category links exposed in footer for crawl paths
- [x] Build frontend and push

## 2026-03-27 Task: Fix departure calendar over-showing selectable dates
- [x] Restrict daily calendar fallback to the true daily Đông Hưng routes only
- [x] Generate only matching weekly dates for tours with weekly departure text like Thứ 6/Thứ 7 hàng tuần
- [x] Build frontend and push

## 2026-03-27 Task: Make selected departure date visible in calendar
- [x] Strengthen selected-day styling so the chosen date stays visible with a clear green state
- [x] Build frontend and push

## 2026-04-08 Task: Hide tours with only one image from listings
- [x] Require at least 2 unique tour images on home/tours/category listings
- [x] Build frontend and push
