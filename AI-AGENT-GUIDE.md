# Sơn Hằng Travel — AI Agent Developer Guide

> Tài liệu dành cho AI coding agent (OpenClaw, Cursor, Copilot...) làm việc với codebase này.
> ĐỌC KỸ TRƯỚC KHI SỬA BẤT KỲ FILE NÀO.

---

## ⚠️ NGUYÊN TẮC VÀNG — TRÁNH LOOP

1. **Đọc toàn bộ file trước khi sửa** — Nhiều file rất dài (500-800 dòng). PHẢI đọc hết file trước khi edit, đừng đoán.
2. **Sửa ít, test ngay** — Sửa 1 chỗ → build kiểm tra → ok → tiếp. KHÔNG sửa nhiều file cùng lúc.
3. **Dùng API nếu chỉ cần thay đổi DATA** — Upload ảnh, thêm banner, thêm tour → dùng curl gọi API, KHÔNG sửa code.
4. **Không tái cấu trúc (refactor)** — Giữ nguyên code style hiện tại. Thêm code mới vào vị trí hợp lý, đừng viết lại cả file.
5. **Build command**: `cd admin && npx next build` hoặc `cd frontend && npx next build`

---

## Kiến trúc tổng quan

```
sonhangtravel/
├── admin/          ← Next.js 16 local admin (port 3001)
│   └── src/
│       ├── app/    ← Pages + API routes
│       └── lib/    ← DB, schema, revalidate
├── frontend/       ← Next.js 16 trên Vercel (sonhangtravel.vercel.app)
│   └── src/
│       ├── app/    ← Pages (ISR)
│       ├── components/ ← UI components
│       └── lib/    ← DB, strapi helpers
├── telegram-bot/   ← Telegram bot (standalone Node.js)
│   └── src/        ← bot.ts, db.ts, schema.ts
```

**Database**: Neon PostgreSQL — shared giữa admin, frontend, telegram-bot  
**Images**: Cloudinary (cloud: dzxntgoko, folder: sonhangtravel)  
**Revalidate**: Sau khi admin sửa data → auto revalidate Vercel ISR

---

## FILE MAP — Admin (`admin/src/`)

### Shared (lib)
| File | Dòng | Vai trò |
|------|------|---------|
| `lib/schema.ts` | ~98 | Drizzle ORM schema — bảng `categories`, `tours`, `blogPosts`, `siteSettings` |
| `lib/db.ts` | ~7 | Neon DB connection |
| `lib/revalidate.ts` | ~18 | Gọi revalidate Vercel ISR sau khi data thay đổi |

### Pages (UI)
| File | Dòng | Vai trò | Lưu ý |
|------|------|---------|-------|
| `app/layout.tsx` | ~52 | Sidebar navigation | Thêm menu mới → thêm `<NavLink>` ở đây |
| `app/page.tsx` | ~77 | Dashboard trang chủ admin | |
| `app/settings/page.tsx` | ~160 | Cài đặt website + Banner slides | Thêm field settings → thêm vào interface Settings + JSX |
| `app/tours/page.tsx` | ~103 | Danh sách tours (table) | |
| `app/tours/TourForm.tsx` | **~551** | Form tạo/sửa tour (5 tabs) | ⚠️ FILE DÀI — đọc kỹ trước khi sửa |
| `app/tours/new/page.tsx` | ~10 | Wrapper cho TourForm (create mode) | |
| `app/tours/[id]/page.tsx` | ~10 | Wrapper cho TourForm (edit mode) | |
| `app/categories/page.tsx` | ~310 | CRUD danh mục (inline form + table) | |
| `app/blog/page.tsx` | ? | Danh sách blog posts | |
| `app/upload/page.tsx` | ? | Upload ảnh lên Cloudinary | |
| `app/revalidate/page.tsx` | ? | Revalidate thủ công | |
| `app/seed/page.tsx` | ? | Seed dữ liệu mẫu | |

### API Routes
| File | Method | Endpoint | Vai trò |
|------|--------|----------|---------|
| `app/api/tours/route.ts` | GET, POST | `/api/tours` | List + Create tours |
| `app/api/tours/[id]/route.ts` | GET, PUT, DELETE | `/api/tours/:id` | Read + Update + Delete tour |
| `app/api/categories/route.ts` | GET, POST | `/api/categories` | List + Create categories |
| `app/api/categories/[id]/route.ts` | PUT, DELETE | `/api/categories/:id` | Update + Delete category |
| `app/api/settings/route.ts` | GET, PUT | `/api/settings` | Read + Update site settings |
| `app/api/upload/route.ts` | POST | `/api/upload` | Upload ảnh → Cloudinary |
| `app/api/blog/route.ts` | GET, POST | `/api/blog` | List + Create blog posts |
| `app/api/blog/[id]/route.ts` | GET, PUT, DELETE | `/api/blog/:id` | Blog CRUD |
| `app/api/revalidate/route.ts` | POST | `/api/revalidate` | Trigger revalidate |
| `app/api/images/route.ts` | GET | `/api/images` | List Cloudinary images |

---

## FILE MAP — Frontend (`frontend/src/`)

### Pages
| File | Dòng | Vai trò | Lưu ý |
|------|------|---------|-------|
| `app/layout.tsx` | ? | Root layout (Header + Footer + BottomNav) | |
| `app/page.tsx` | **~322** | Homepage — fetch tours, categories, settings → pass to components | ISR revalidate=3600 |
| `app/tours/page.tsx` | ? | Tours listing page | ISR |
| `app/tours/ToursPageClient.tsx` | ~121 | Client-side tour filtering | |
| `app/tour/[slug]/page.tsx` | ? | Tour detail — fetch single tour | |
| `app/tour/[slug]/TourDetailClient.tsx` | **~831** | Tour detail UI | ⚠️ FILE RẤT DÀI |
| `app/blog/page.tsx` | ? | Blog listing | |
| `app/blog/[slug]/page.tsx` | ? | Blog detail | |
| `app/sitemap.ts` | ? | Sitemap XML | |
| `app/robots.ts` | ? | Robots.txt | |

### Components
| File | Dòng | Vai trò |
|------|------|---------|
| `components/Header.tsx` | **~422** | Top navigation bar — ⚠️ DÀI |
| `components/Footer.tsx` | ~185 | Footer |
| `components/BottomNav.tsx` | ? | Mobile bottom navigation |
| `components/HeroSection.tsx` | ~117 | Banner carousel trang chủ — nhận prop `bannerSlides` |
| `components/CategorySection.tsx` | ? | Hiển thị danh mục |
| `components/FeaturedTours.tsx` | ? | Tours nổi bật trang chủ |
| `components/CategoryToursSection.tsx` | ? | Tours theo danh mục |
| `components/TourCard.tsx` | ? | Card hiển thị 1 tour |
| `components/WhyChooseUs.tsx` | ? | Section "Tại sao chọn chúng tôi" |
| `components/ZaloButtons.tsx` | ? | Nút Zalo floating |
| `components/ZaloProvider.tsx` | ? | Zalo chat widget |
| `components/SaleCountdown.tsx` | ? | Đếm ngược khuyến mãi |
| `components/SaleActions.tsx` | ? | CTA khuyến mãi |
| `components/StatsBooster.tsx` | ? | Boost số liệu hiển thị |
| `components/BlogGalleryLightbox.tsx` | ? | Lightbox gallery blog |
| `components/BlogSalePageEnhancer.tsx` | ? | Tăng cường trang sale blog |

### Lib
| File | Dòng | Vai trò |
|------|------|---------|
| `lib/strapi.ts` | **~451** | API client — fetch tours, categories, settings từ DB. ⚠️ DÀI |
| `lib/schema.ts` | ? | Drizzle schema (shared) |
| `lib/db.ts` | ? | Neon DB connection |
| `lib/blog.ts` | ? | Blog fetch helpers |
| `lib/data.ts` | ? | Static data helpers |

---

## Database Schema (Drizzle ORM)

### Bảng `tours`
```
id, title, slug, short_description, content, price, original_price,
duration, departure, destination, transportation, group_size,
thumbnail, gallery(jsonb), itinerary(jsonb), includes(jsonb),
excludes(jsonb), notes(jsonb), policy, category_id(FK),
featured, published, rating, review_count, booking_count,
departure_dates(jsonb), created_at, updated_at
```

### Bảng `categories`
```
id, name, slug, description, icon, image, order, created_at, updated_at
```

### Bảng `blog_posts`
```
id, title, slug, description, excerpt, content(jsonb), category,
keywords(jsonb), thumbnail, gallery(jsonb), published, published_at,
updated_at, created_at
```

### Bảng `site_settings` (1 row)
```
id, site_name, logo, logo_dark, favicon, banner_slides(jsonb),
phone_number, zalo_number, email, address,
facebook_url, youtube_url, tiktok_url, updated_at
```

**Khi thêm field mới vào DB**: Sửa `admin/src/lib/schema.ts` + `frontend/src/lib/schema.ts` (giống nhau)

---

## Hướng dẫn theo task phổ biến

### Thay đổi DATA (banner, tour, settings) → DÙNG API, KHÔNG SỬA CODE

```bash
# Upload ảnh
curl -X POST http://localhost:3001/api/upload -F "file=@/path/to/image.jpg"

# Lấy settings hiện tại
curl http://localhost:3001/api/settings

# Cập nhật banner slides
curl -X PUT http://localhost:3001/api/settings \
  -H "Content-Type: application/json" \
  -d '{"bannerSlides": [{"image":"URL","title":"..."}]}'

# Tạo tour
curl -X POST http://localhost:3001/api/tours \
  -H "Content-Type: application/json" \
  -d '{"title":"...","price":1500000,...}'

# Revalidate website
curl "https://sonhangtravel.vercel.app/api/revalidate?secret=sonhang-revalidate-2026&path=/"
```

### Thêm field mới vào Settings
1. `admin/src/lib/schema.ts` → Thêm column vào bảng `siteSettings`
2. `admin/src/app/settings/page.tsx` → Thêm vào interface `Settings` + defaultSettings + JSX form
3. `admin/src/app/api/settings/route.ts` → Thêm field vào mảng `fields` trong hàm PUT
4. Nếu frontend cần dùng → sửa `frontend/src/lib/strapi.ts` hàm `getSiteSettings()`

### Thêm field mới vào Tour
1. `admin/src/lib/schema.ts` → Thêm column vào bảng `tours`
2. `admin/src/app/tours/TourForm.tsx` → Thêm vào interface `TourData` + defaultData + JSX (chọn đúng tab)
3. `admin/src/app/api/tours/route.ts` → Thêm field vào POST body mapping
4. `admin/src/app/api/tours/[id]/route.ts` → Thêm field vào PUT body mapping
5. Nếu frontend cần hiển thị → sửa component tương ứng

### Thêm trang admin mới
1. Tạo `admin/src/app/[name]/page.tsx`
2. Tạo `admin/src/app/api/[name]/route.ts` (nếu cần API)
3. `admin/src/app/layout.tsx` → Thêm `<NavLink>` vào sidebar

### Thêm component frontend mới
1. Tạo `frontend/src/components/NewComponent.tsx`
2. Import vào page cần dùng (thường là `app/page.tsx` cho homepage)

### Sửa giao diện tour detail
→ Sửa `frontend/src/app/tour/[slug]/TourDetailClient.tsx` (831 dòng, CẨN THẬN)

### Sửa header/footer
→ `frontend/src/components/Header.tsx` (422 dòng) hoặc `Footer.tsx` (185 dòng)

---

## Environment Variables

### Admin `.env`
```
DATABASE_URL=postgresql://neondb_owner:npg_wYe3gIcx5hua@ep-little-lake-a1rinsa3-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
CLOUDINARY_NAME=dzxntgoko
CLOUDINARY_KEY=316995586271977
CLOUDINARY_SECRET=9YuonKfWHcfu-OBlcUC8-nCXG3o
REVALIDATE_SECRET=sonhang-revalidate-2026
VERCEL_SITE_URL=https://sonhangtravel.vercel.app
```

### Frontend `.env.local`
```
DATABASE_URL=postgresql://neondb_owner:npg_wYe3gIcx5hua@ep-little-lake-a1rinsa3-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
REVALIDATE_SECRET=sonhang-revalidate-2026
```

---

## Tech Stack
- **Next.js 16.1.1** (cả admin + frontend)
- **TailwindCSS 4** — dùng `bg-linear-*` thay vì `bg-gradient-*`
- **Drizzle ORM** + **Neon PostgreSQL**
- **Cloudinary** cho ảnh
- **TypeScript strict**
- Admin chạy `localhost:3001`, Frontend trên Vercel

## Build & Test
```bash
# Build admin
cd admin && npx next build

# Build frontend
cd frontend && npx next build

# Chạy admin dev
cd admin && npm run dev

# Chạy frontend dev
cd frontend && npm run dev
```
