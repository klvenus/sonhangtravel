# Hướng dẫn OpenClaw: Quản lý Sơn Hằng Travel qua API

## ⚠️ QUAN TRỌNG: KHÔNG SỬA FILE CODE

Bạn KHÔNG CẦN sửa bất kỳ file code nào (`.tsx`, `.ts`, `.json`...). 
Mọi thao tác quản lý tour, banner, danh mục đều thực hiện qua **API HTTP**.
Admin app chạy trên `http://localhost:3001`.

> Publish flow hiện tại là admin local ghi trực tiếp vào Neon PostgreSQL rồi revalidate frontend. Không cần chạy Strapi cho các thao tác vận hành thường ngày.

---

## 1. Kiểm tra admin đang chạy

```bash
curl -s http://localhost:3001/api/settings | head -c 100
```

Nếu lỗi "Connection refused" → chạy admin trước:
```bash
cd /Users/khumlong/sonhangtravel/admin && npm run dev
```

---

## 2. Upload ảnh lên Cloudinary

```bash
curl -s -X POST http://localhost:3001/api/upload \
  -F "file=@/đường/dẫn/tới/ảnh.jpg"
```

Response:
```json
{"url": "https://res.cloudinary.com/dzxntgoko/image/upload/v.../sonhangtravel/xxx.jpg", "publicId": "...", "width": 1200, "height": 800}
```

**Lưu lại `url` để dùng cho bước tiếp theo.**

---

## 3. Thêm ảnh vào Hero Banner trang chủ

### Bước 1: Lấy settings hiện tại
```bash
curl -s http://localhost:3001/api/settings
```

### Bước 2: Cập nhật bannerSlides

Lấy mảng `bannerSlides` hiện tại, thêm slide mới vào, rồi PUT lại:

```bash
curl -s -X PUT http://localhost:3001/api/settings \
  -H "Content-Type: application/json" \
  -d '{
    "bannerSlides": [
      {
        "image": "URL_ẢNH_CŨ_1",
        "title": "Sơn Hằng Travel",
        "subtitle": "Tour Trung Quốc Uy Tín",
        "linkUrl": "/tours",
        "linkText": "Xem tour"
      },
      {
        "image": "URL_ẢNH_MỚI_VỪA_UPLOAD",
        "title": "Tiêu đề slide mới",
        "subtitle": "Phụ đề",
        "linkUrl": "/tours",
        "linkText": "Xem ngay"
      }
    ]
  }'
```

> **LƯU Ý**: PUT `/api/settings` chỉ cập nhật các field bạn gửi. Các field khác giữ nguyên.  
> Nhưng `bannerSlides` phải gửi **toàn bộ mảng** (cả slide cũ + mới), vì nó thay thế cả mảng.

### Bước 3: Revalidate website (tùy chọn)
```bash
curl -s "https://sonhangtravel.com/api/revalidate?secret=$REVALIDATE_SECRET&path=/"
```

---

## 4. Quản lý Tours

### Xem danh sách tours
```bash
curl -s http://localhost:3001/api/tours
```

### Xem chi tiết 1 tour
```bash
curl -s http://localhost:3001/api/tours/11
```

### Tạo tour mới
```bash
curl -s -X POST http://localhost:3001/api/tours \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tour Đông Hưng 2 ngày 1 đêm",
    "price": 1500000,
    "duration": "2 ngày 1 đêm",
    "destination": "Đông Hưng, Trung Quốc",
    "departure": "Móng Cái",
    "shortDescription": "Mô tả ngắn...",
    "thumbnail": "URL_ẢNH",
    "gallery": ["URL_1", "URL_2"],
    "itinerary": [
      {"time": "07:00", "title": "Tập trung", "description": "Tập trung tại..."},
      {"time": "09:00", "title": "Qua cửa khẩu", "description": "Làm thủ tục..."}
    ],
    "includes": ["Xe du lịch", "Bữa ăn", "HDV"],
    "excludes": ["Chi phí cá nhân"],
    "notes": ["Mang CCCD còn hạn"],
    "categoryId": 1,
    "featured": true,
    "published": true
  }'
```

### Cập nhật tour
```bash
curl -s -X PUT http://localhost:3001/api/tours/11 \
  -H "Content-Type: application/json" \
  -d '{"title": "Tiêu đề mới", "price": 2000000}'
```

### Xóa tour
```bash
curl -s -X DELETE http://localhost:3001/api/tours/11
```

---

## 5. Quản lý Danh mục

### Xem danh sách
```bash
curl -s http://localhost:3001/api/categories
```

### Tạo danh mục
```bash
curl -s -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Tour Đông Hưng", "icon": "🏯", "description": "Các tour Đông Hưng"}'
```

---

## 6. Cập nhật cài đặt website

```bash
curl -s -X PUT http://localhost:3001/api/settings \
  -H "Content-Type: application/json" \
  -d '{
    "siteName": "Sơn Hằng Travel",
    "phoneNumber": "0338239888",
    "zaloNumber": "0388091993",
    "email": "Lienhe@sonhangtravel.com",
    "address": "Khu 5 - Phường Móng Cái - Quảng Ninh"
  }'
```

---

## 7. Revalidate website production

Sau khi thay đổi dữ liệu, website tự động cập nhật. Nếu cần revalidate thủ công:

```bash
# Trang chủ
curl -s "https://sonhangtravel.com/api/revalidate?secret=$REVALIDATE_SECRET&path=/"

# Trang tours
curl -s "https://sonhangtravel.com/api/revalidate?secret=$REVALIDATE_SECRET&path=/tours"

# Tour cụ thể
curl -s "https://sonhangtravel.com/api/revalidate?secret=$REVALIDATE_SECRET&path=/tour/slug-cua-tour"
```

---

## Tóm tắt quy trình thêm banner

1. `curl POST /api/upload -F file=@ảnh.jpg` → Lấy URL
2. `curl GET /api/settings` → Lấy bannerSlides hiện tại
3. Thêm slide mới vào mảng bannerSlides
4. `curl PUT /api/settings -d '{"bannerSlides": [...]}'` → Lưu
5. `curl GET .../api/revalidate?...&path=/` → Cập nhật website

**KHÔNG SỬA FILE CODE. CHỈ GỌI API.**
