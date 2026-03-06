# Sơn Hằng Travel — Admin Panel Guide

> Tài liệu hướng dẫn sử dụng Admin Panel để quản lý nội dung cho website [sonhangtravel.vercel.app](https://sonhangtravel.vercel.app).
> Dành cho AI agent (OpenClaw) hoặc người vận hành.

---

## Mục lục

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Khởi chạy Admin](#2-khởi-chạy-admin)
3. [Quản lý Tours](#3-quản-lý-tours)
4. [Quản lý Danh mục](#4-quản-lý-danh-mục)
5. [Cài đặt Website](#5-cài-đặt-website)
6. [Upload ảnh](#6-upload-ảnh)
7. [Revalidate Cache](#7-revalidate-cache)
8. [API Endpoints](#8-api-endpoints)
9. [Database Schema](#9-database-schema)
10. [Lưu ý quan trọng](#10-lưu-ý-quan-trọng)

---

## 1. Tổng quan hệ thống

| Thành phần | Công nghệ | URL |
|---|---|---|
| **Frontend** (production) | Next.js 16.1.1 | https://sonhangtravel.vercel.app |
| **Admin** (local only) | Next.js 16.1.1 | http://localhost:3001 |
| **Database** | PostgreSQL (Neon) | Neon serverless |
| **Ảnh** | Cloudinary | Cloud: `dzxntgoko` |

**Luồng hoạt động:**
1. Admin (localhost:3001) → Ghi dữ liệu vào Neon PostgreSQL
2. Sau khi lưu → Tự động revalidate ISR cache trên Vercel
3. Frontend (Vercel) → Đọc dữ liệu từ Neon PostgreSQL → Hiển thị cho người dùng
4. Ảnh upload → Cloudinary → URL ảnh lưu trong DB

---

## 2. Khởi chạy Admin

```bash
cd admin
npm install   # Lần đầu hoặc khi có thay đổi dependencies
npm run dev   # Chạy trên port 3001
```

Mở trình duyệt: **http://localhost:3001**

### Sidebar Navigation

| Menu | Đường dẫn | Chức năng |
|---|---|---|
| 📊 Dashboard | `/` | Trang chủ admin |
| 🗺️ Tours | `/tours` | Danh sách tours |
| ➕ Thêm tour | `/tours/new` | Tạo tour mới |
| 📁 Danh mục | `/categories` | Quản lý danh mục |
| ⚙️ Cài đặt | `/settings` | Cài đặt website |
| 🖼️ Upload ảnh | `/upload` | Upload ảnh lên Cloudinary |
| 🌱 Seed data | `/seed` | Tạo dữ liệu mẫu |
| 🔄 Revalidate | `/revalidate` | Xóa cache thủ công |

---

## 3. Quản lý Tours

### 3.1 Tạo tour mới

Vào **➕ Thêm tour** (`/tours/new`). Form có 5 tab:

#### Tab 1: 📝 Cơ bản (Basic)

| Trường | Bắt buộc | Mô tả | Ví dụ |
|---|---|---|---|
| **Tiêu đề** | ✅ | Tên tour | `Tour Đông Hưng 2 ngày 1 đêm` |
| **Slug** | Tự tạo | Tự sinh từ tiêu đề, có thể sửa | `tour-dong-hung-2-ngay-1-dem` |
| **Mô tả ngắn** | ❌ | Tóm tắt ngắn về tour | `Khám phá Đông Hưng với lịch trình...` |
| **Giá (VNĐ)** | ✅ | Giá tour (số nguyên, đơn vị VNĐ) | `1500000` (= 1.500.000đ) |
| **Giá gốc** | ❌ | Giá trước giảm (để trống nếu không giảm) | `2000000` |
| **Danh mục** | ❌ | Chọn từ dropdown | `Tour Đông Hưng` |
| **Công khai** | ✅ default | Checkbox — tour hiển thị trên website | ✅ (mặc định bật) |
| **⭐ Nổi bật** | ✅ default | Checkbox — hiển thị trên trang chủ | ✅ (mặc định bật) |

> ⚠️ **QUAN TRỌNG**: `Nổi bật` (featured) phải được **bật** để tour hiển thị trên trang chủ. `Công khai` (published) phải bật để tour hiển thị trên website.

#### Tab 2: 📋 Chi tiết (Detail)

| Trường | Mô tả | Ví dụ |
|---|---|---|
| **Thời gian** | Thời lượng tour | `2 ngày 1 đêm` |
| **Khởi hành** | Điểm khởi hành (mặc định: Móng Cái) | `Móng Cái` |
| **Điểm đến** | Điểm đến | `Đông Hưng, Trung Quốc` |
| **Phương tiện** | Phương tiện di chuyển | `Xe du lịch + Đi bộ` |
| **Số người** | Quy mô nhóm | `15-25 người` |
| **Nội dung chi tiết** | Nội dung HTML dài (mô tả tour) | HTML hoặc text thuần |
| **Chính sách** | Chính sách hủy/đổi | Text |

#### Tab 3: 🖼️ Ảnh (Media)

| Trường | Mô tả |
|---|---|
| **Ảnh thumbnail** | Ảnh đại diện chính của tour. Upload file hoặc dán URL Cloudinary |
| **Gallery** | Nhiều ảnh album. Upload nhiều file cùng lúc. Click ✕ để xóa ảnh |

**Cách upload ảnh:**
1. Click nút chọn file → Chọn ảnh từ máy
2. Ảnh tự động upload lên Cloudinary (folder: `sonhangtravel`)
3. URL Cloudinary tự động điền vào form
4. Hoặc: Dán trực tiếp URL Cloudinary vào ô input

#### Tab 4: 🗓️ Lịch trình (Itinerary)

Danh sách các hoạt động theo thứ tự:

| Trường | Mô tả | Ví dụ |
|---|---|---|
| **Thời gian** | Mốc thời gian | `07:00`, `Sáng`, `Ngày 1` |
| **Tiêu đề** | Tên hoạt động | `Tập trung tại cửa khẩu Móng Cái` |
| **Mô tả** | Chi tiết hoạt động | `Xe đón đoàn tại...` |

- Click **"+ Thêm mục"** để thêm hoạt động mới
- Click **"Xóa"** để xóa hoạt động
- Sắp xếp theo thứ tự từ trên xuống

#### Tab 5: 📦 Thêm (Extra)

| Mục | Mô tả | Ví dụ |
|---|---|---|
| **✅ Bao gồm** | Danh sách những gì tour bao gồm | `Xe du lịch đời mới`, `Bữa ăn theo chương trình` |
| **❌ Không bao gồm** | Những gì không bao gồm | `Chi phí cá nhân`, `Tip cho HDV` |
| **📌 Lưu ý** | Ghi chú quan trọng | `Mang theo hộ chiếu còn hạn` |
| **Đánh giá** | Rating (0-5) | `4.8` (mặc định: `5.0`) |
| **Lượt đánh giá** | Số review | `120` |
| **Lượt đặt** | Số booking | `500` |

### 3.2 Lưu tour

Nhấn nút **"💾 Lưu"** ở góc trên bên phải.

**Sau khi lưu thành công:**
1. Tour được ghi vào database Neon PostgreSQL
2. Tự động revalidate cache trên Vercel (trang chủ `/`, trang `/tours`, trang `/tour/[slug]`)
3. Website production cập nhật trong vài giây
4. Chuyển về trang danh sách tours

### 3.3 Sửa tour

1. Vào **🗺️ Tours** (`/tours`)
2. Click nút **"✏️ Sửa"** ở tour cần sửa
3. Sửa nội dung → Nhấn **"💾 Lưu"**

### 3.4 Xóa tour

1. Vào **🗺️ Tours** (`/tours`)
2. Click nút **"🗑️ Xóa"** → Xác nhận
3. Tour bị xóa khỏi DB và website cập nhật tự động

### 3.5 Toggle nhanh

Trong danh sách tours, có thể click nhanh để toggle:
- **Công khai / Ẩn** — Bật/tắt hiển thị trên website
- **⭐ Nổi bật / Thường** — Bật/tắt hiển thị trên trang chủ

---

## 4. Quản lý Danh mục

Vào **📁 Danh mục** (`/categories`).

### Tạo danh mục mới

| Trường | Bắt buộc | Mô tả | Ví dụ |
|---|---|---|---|
| **Tên** | ✅ | Tên danh mục | `Tour Đông Hưng` |
| **Slug** | Tự tạo | Tự sinh từ tên | `tour-dong-hung` |
| **Mô tả** | ❌ | Mô tả ngắn | `Các tour du lịch Đông Hưng...` |
| **Icon** | ❌ | Emoji biểu tượng (mặc định: 🌏) | `🏯`, `🌊`, `⛰️` |
| **Thứ tự** | ❌ | Số thứ tự hiển thị (nhỏ = lên trước) | `1`, `2`, `3` |

### Sửa / Xóa danh mục
- Click **"Sửa"** → Form đổi thành chế độ sửa → Sửa xong nhấn "Lưu"
- Click **"Xóa"** → Xác nhận → Xóa (lưu ý: nên gỡ các tours khỏi danh mục trước)

---

## 5. Cài đặt Website

Vào **⚙️ Cài đặt** (`/settings`).

| Trường | Mô tả | Giá trị hiện tại |
|---|---|---|
| **Tên website** | Tên hiển thị | `Sơn Hằng Travel` |
| **Logo** | URL logo sáng | Cloudinary URL |
| **Logo tối** | URL logo nền tối | Cloudinary URL |
| **Favicon** | URL favicon | — |
| **Số điện thoại** | SĐT liên hệ | `0338239888` |
| **Zalo** | Số Zalo | `0388091993` |
| **Email** | Email liên hệ | `Lienhe@sonhangtravel.com` |
| **Địa chỉ** | Địa chỉ công ty | `Khu 5 - Phường Móng Cái - Quảng Ninh` |
| **Facebook URL** | Link Facebook | — |
| **YouTube URL** | Link YouTube | — |
| **TikTok URL** | Link TikTok | — |
| **Banner Slides** | Danh sách ảnh banner trang chủ | JSON array |

Nhấn **"Lưu"** sau khi sửa.

---

## 6. Upload ảnh

Vào **🖼️ Upload ảnh** (`/upload`) để upload ảnh riêng lẻ lên Cloudinary.

**Hoặc** upload trực tiếp trong form tour (Tab Ảnh) — ảnh tự động upload lên Cloudinary.

Tất cả ảnh được lưu tại Cloudinary folder: **`sonhangtravel`**

Format URL: `https://res.cloudinary.com/dzxntgoko/image/upload/v.../sonhangtravel/filename.jpg`

---

## 7. Revalidate Cache

Khi tour được tạo/sửa/xóa, hệ thống **tự động revalidate** các trang:
- `/` (trang chủ)
- `/tours` (danh sách tours)  
- `/tour/[slug]` (trang chi tiết tour)

**Nếu cần revalidate thủ công:**
- Vào **🔄 Revalidate** (`/revalidate`) trong admin
- Hoặc gọi API trực tiếp:
  ```
  GET https://sonhangtravel.vercel.app/api/revalidate?secret=sonhang-revalidate-2026&path=/
  GET https://sonhangtravel.vercel.app/api/revalidate?secret=sonhang-revalidate-2026&path=/tours
  GET https://sonhangtravel.vercel.app/api/revalidate?secret=sonhang-revalidate-2026&path=/tour/[slug]
  ```

---

## 8. API Endpoints

Admin chạy trên `http://localhost:3001`. Các API route:

### Tours

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/tours` | Lấy danh sách tất cả tours |
| `POST` | `/api/tours` | Tạo tour mới |
| `GET` | `/api/tours/[id]` | Lấy chi tiết 1 tour |
| `PUT` | `/api/tours/[id]` | Cập nhật tour |
| `DELETE` | `/api/tours/[id]` | Xóa tour |

### Categories

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/categories` | Lấy danh sách danh mục (kèm tourCount) |
| `POST` | `/api/categories` | Tạo danh mục mới |
| `PUT` | `/api/categories/[id]` | Cập nhật danh mục |
| `DELETE` | `/api/categories/[id]` | Xóa danh mục |

### Settings

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/settings` | Lấy cài đặt website |
| `PUT` | `/api/settings` | Cập nhật cài đặt |

### Upload

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/upload` | Upload ảnh lên Cloudinary (multipart/form-data, field: `file`) |

### Revalidate (Production)

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/revalidate` | Trigger revalidate thủ công |

**Ví dụ tạo tour bằng API:**

```bash
curl -X POST http://localhost:3001/api/tours \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tour Đông Hưng 2 ngày 1 đêm",
    "price": 1500000,
    "duration": "2 ngày 1 đêm",
    "destination": "Đông Hưng, Trung Quốc",
    "departure": "Móng Cái",
    "shortDescription": "Khám phá Đông Hưng...",
    "thumbnail": "https://res.cloudinary.com/dzxntgoko/image/upload/v.../sonhangtravel/anh.jpg",
    "gallery": ["url1", "url2"],
    "itinerary": [
      {"time": "07:00", "title": "Tập trung", "description": "Tập trung tại cửa khẩu..."},
      {"time": "09:00", "title": "Qua cửa khẩu", "description": "Làm thủ tục..."}
    ],
    "includes": ["Xe du lịch", "Bữa ăn theo chương trình", "HDV tiếng Việt"],
    "excludes": ["Chi phí cá nhân", "Tip"],
    "notes": ["Mang hộ chiếu còn hạn 6 tháng"],
    "categoryId": 1,
    "featured": true,
    "published": true,
    "rating": "4.8",
    "reviewCount": 120,
    "bookingCount": 500
  }'
```

**Ví dụ upload ảnh bằng API:**

```bash
curl -X POST http://localhost:3001/api/upload \
  -F "file=@/path/to/image.jpg"
# Response: { "url": "https://res.cloudinary.com/...", "publicId": "...", "width": 1200, "height": 800 }
```

---

## 9. Database Schema

Database: **Neon PostgreSQL** (shared giữa admin và frontend)

### Bảng `tours`

| Column | Type | Mô tả |
|---|---|---|
| `id` | serial PK | ID tự tăng |
| `title` | text NOT NULL | Tiêu đề |
| `slug` | text UNIQUE | URL slug |
| `short_description` | text | Mô tả ngắn |
| `content` | text | Nội dung HTML |
| `price` | integer NOT NULL | Giá (VNĐ) |
| `original_price` | integer | Giá gốc |
| `duration` | text NOT NULL | Thời gian |
| `departure` | text | Điểm khởi hành |
| `destination` | text NOT NULL | Điểm đến |
| `transportation` | text | Phương tiện |
| `group_size` | text | Số người |
| `thumbnail` | text | URL ảnh thumbnail |
| `gallery` | jsonb (string[]) | Mảng URL ảnh gallery |
| `itinerary` | jsonb (object[]) | Lịch trình `[{time, title, description, image}]` |
| `includes` | jsonb (string[]) | Bao gồm |
| `excludes` | jsonb (string[]) | Không bao gồm |
| `notes` | jsonb (string[]) | Lưu ý |
| `policy` | text | Chính sách |
| `category_id` | integer FK | ID danh mục |
| `featured` | boolean | Nổi bật (trang chủ) |
| `published` | boolean | Công khai |
| `rating` | decimal(2,1) | Đánh giá (0-5) |
| `review_count` | integer | Lượt đánh giá |
| `booking_count` | integer | Lượt đặt |
| `departure_dates` | jsonb | Ngày khởi hành `[{date, price, availableSlots, status}]` |
| `created_at` | timestamp | Ngày tạo |
| `updated_at` | timestamp | Ngày cập nhật |

### Bảng `categories`

| Column | Type | Mô tả |
|---|---|---|
| `id` | serial PK | ID |
| `name` | text NOT NULL | Tên danh mục |
| `slug` | text UNIQUE | URL slug |
| `description` | text | Mô tả |
| `icon` | text | Emoji icon |
| `image` | text | URL ảnh |
| `order` | integer | Thứ tự |

### Bảng `site_settings`

| Column | Type | Mô tả |
|---|---|---|
| `id` | serial PK | ID |
| `site_name` | text | Tên website |
| `logo` / `logo_dark` / `favicon` | text | URLs |
| `banner_slides` | jsonb | Banner trang chủ |
| `phone_number` / `zalo_number` | text | SĐT |
| `email` / `address` | text | Liên hệ |
| `facebook_url` / `youtube_url` / `tiktok_url` | text | Mạng xã hội |

---

## 10. Lưu ý quan trọng

### ⚠️ Bắt buộc

1. **Admin chỉ chạy local** — Không deploy admin lên production. Luôn chạy `cd admin && npm run dev`.
2. **featured = true** — Tour phải bật "Nổi bật" để hiển thị trên **trang chủ**.
3. **published = true** — Tour phải bật "Công khai" để hiển thị trên **website**.
4. **Giá là số nguyên VNĐ** — Nhập `1500000` (không phải `1,500,000` hay `1.5tr`).
5. **Slug tự động** — Không cần nhập slug, hệ thống tự tạo từ tiêu đề. Nhưng có thể sửa tay nếu muốn.
6. **Revalidate tự động** — Không cần làm gì thêm sau khi lưu, website production sẽ tự cập nhật.

### 🔑 Thông tin kết nối

- **Production URL**: https://sonhangtravel.vercel.app
- **Admin URL**: http://localhost:3001
- **Cloudinary Cloud**: `dzxntgoko`
- **Revalidate Secret**: `sonhang-revalidate-2026`
- **GitHub**: `klvenus/sonhangtravel` (branch: `main`)

### 📋 Checklist tạo tour mới

- [ ] Nhập **Tiêu đề** (bắt buộc)
- [ ] Nhập **Giá** (bắt buộc, số nguyên VNĐ)
- [ ] Chọn **Danh mục** (nếu có)
- [ ] ✅ **Công khai** bật
- [ ] ⭐ **Nổi bật** bật (nếu muốn hiện trang chủ)
- [ ] Nhập **Thời gian**, **Điểm đến**, **Khởi hành**
- [ ] Upload **Ảnh thumbnail** + **Gallery**
- [ ] Thêm **Lịch trình** (từng mục: thời gian → tiêu đề → mô tả)
- [ ] Thêm **Bao gồm** / **Không bao gồm** / **Lưu ý**
- [ ] Nhấn **💾 Lưu**
- [ ] Kiểm tra trên website: `https://sonhangtravel.vercel.app/tour/[slug]`

### 🚀 Quy trình cho AI agent

Nếu bạn là AI agent quản lý nội dung:

1. **Khởi động admin**: `cd admin && npm run dev`
2. **Tạo tour**: Dùng API `POST /api/tours` với JSON body (xem ví dụ ở mục 8)
3. **Upload ảnh trước**: Dùng API `POST /api/upload` để upload ảnh → Lấy URL → Dùng URL cho tour
4. **Kiểm tra**: `GET /api/tours` để xem danh sách tour đã tạo
5. **Sửa nếu cần**: `PUT /api/tours/[id]` với JSON body
6. **Website tự cập nhật** sau khi lưu (revalidate tự động)

Hoặc dùng giao diện web admin tại http://localhost:3001 nếu muốn thao tác thủ công qua browser.
