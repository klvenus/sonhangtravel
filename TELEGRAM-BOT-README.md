# Hướng dẫn cho OpenClaw: Chạy Telegram Bot quản lý Sơn Hằng Travel

## Mục tiêu
Chạy Telegram Bot đã có sẵn tại `/Users/khumlong/sonhangtravel/telegram-bot` để quản lý tours du lịch qua Telegram. Bot kết nối trực tiếp vào database Neon PostgreSQL, upload ảnh lên Cloudinary, và tự động cập nhật website production.

---

## Bước 1: Chạy bot

```bash
cd /Users/khumlong/sonhangtravel/telegram-bot
npm start
```

Bot sẽ hiện: `🤖 Sơn Hằng Travel Bot đang chạy...`

> Nếu lỗi thiếu module, chạy `npm install` trước.

---

## Bước 2: Test bot trên Telegram

Mở Telegram, tìm bot bằng token: `7434463749:AAGCPru0hv_9ahOPq3xPARGE6UBNRtGTNXc`

Hoặc tìm theo username bot (nếu đã set username trên BotFather).

Gửi `/start` để xem menu lệnh.

---

## Danh sách lệnh bot

### Quản lý Tours
| Lệnh | Mô tả |
|---|---|
| `/tours` | Xem danh sách tất cả tours |
| `/tour_info [id]` | Xem chi tiết 1 tour (VD: `/tour_info 11`) |
| `/new_tour` | Tạo tour mới **từng bước** (6 bước) |
| `/quick_tour` | Tạo tour nhanh bằng **1 tin nhắn** |
| `/delete_tour [id]` | Xóa tour (VD: `/delete_tour 11`) |
| `/toggle_featured [id]` | Bật/tắt nổi bật (hiện trang chủ) |
| `/toggle_published [id]` | Bật/tắt công khai (ẩn/hiện tour) |

### Danh mục
| Lệnh | Mô tả |
|---|---|
| `/categories` | Xem danh sách danh mục |
| `/new_category [tên]` | Tạo danh mục mới (VD: `/new_category Tour Đông Hưng`) |

### Khác
| Lệnh | Mô tả |
|---|---|
| `/stats` | Thống kê tours, danh mục |
| `/revalidate` | Cập nhật lại cache website production |
| `/cancel` | Hủy thao tác đang thực hiện |
| `/help` | Hướng dẫn sử dụng |

### Upload ảnh
Gửi **ảnh** kèm caption `/upload` → Bot upload lên Cloudinary và trả về URL.

---

## Cách tạo tour nhanh (`/quick_tour`)

1. Gửi `/quick_tour`
2. Gửi tin nhắn với format:

```
Tiêu đề: Tour Đông Hưng 2 ngày 1 đêm
Giá: 1500000
Giá gốc: 2000000
Thời gian: 2 ngày 1 đêm
Điểm đến: Đông Hưng, Trung Quốc
Khởi hành: Móng Cái
Phương tiện: Xe du lịch
Số người: 15-25 người
Mô tả: Khám phá thành phố Đông Hưng với nhiều trải nghiệm thú vị
```

**Bắt buộc**: `Tiêu đề` và `Giá`. Các trường khác tùy chọn.

Tour tạo xong sẽ tự động:
- `featured = true` (hiện trang chủ)
- `published = true` (công khai)
- Slug tự sinh từ tiêu đề
- Revalidate website production

---

## Cách tạo tour từng bước (`/new_tour`)

1. Gửi `/new_tour`
2. **Bước 1**: Nhập tiêu đề → VD: `Tour Đông Hưng 2 ngày 1 đêm`
3. **Bước 2**: Nhập giá (VNĐ) → VD: `1500000`
4. **Bước 3**: Nhập chi tiết (hoặc `skip`):
   ```
   Thời gian: 2 ngày 1 đêm
   Điểm đến: Đông Hưng, Trung Quốc
   Khởi hành: Móng Cái
   Phương tiện: Xe du lịch
   Số người: 15-25
   ```
5. **Bước 4**: Nhập mô tả ngắn (hoặc `skip`)
6. **Bước 5**: Gửi ảnh (từng ảnh) → Ảnh đầu = thumbnail. Gõ `xong` khi đủ (hoặc `skip`)
7. **Bước 6**: Nhập lịch trình (hoặc `skip`):
   ```
   07:00 | Tập trung tại cửa khẩu | Xe đón đoàn
   09:00 | Qua cửa khẩu Bắc Luân | Làm thủ tục xuất nhập cảnh
   12:00 | Ăn trưa | Nhà hàng đặc sản Đông Hưng
   14:00 | Mua sắm | Chợ Đông Hưng
   17:00 | Về khách sạn | Nghỉ ngơi
   ```
   Format: `thời gian | tiêu đề | mô tả` (dùng dấu `|` ngăn cách)

Tour tự động lưu sau bước 6.

---

## Thông tin kỹ thuật

### Cấu trúc thư mục
```
/Users/khumlong/sonhangtravel/telegram-bot/
├── .env                  # Biến môi trường (token, DB, Cloudinary)
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── src/
    ├── bot.ts            # Logic chính (725 dòng)
    ├── db.ts             # Kết nối Neon PostgreSQL
    ├── schema.ts         # Schema DB (tours, categories, site_settings)
    ├── cloudinary.ts     # Upload ảnh lên Cloudinary
    └── revalidate.ts     # Revalidate ISR cache Vercel
```

### Biến môi trường (`.env`)
```
TELEGRAM_BOT_TOKEN=7434463749:AAGCPru0hv_9ahOPq3xPARGE6UBNRtGTNXc
DATABASE_URL=postgresql://neondb_owner:npg_wYe3gIcx5hua@ep-little-lake-a1rinsa3-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
CLOUDINARY_NAME=dzxntgoko
CLOUDINARY_KEY=316995586271977
CLOUDINARY_SECRET=9YuonKfWHcfu-OBlcUC8-nCXG3o
VERCEL_SITE_URL=https://sonhangtravel.vercel.app
REVALIDATE_SECRET=sonhang-revalidate-2026
```

### Tech stack
- **Runtime**: Node.js + tsx (TypeScript executor)
- **Telegram**: `node-telegram-bot-api` (polling mode)
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Image**: Cloudinary (folder: `sonhangtravel`)
- **Commands**: `npm start` (chạy) / `npm run dev` (chạy + auto-reload khi sửa code)

### Website production
- URL: https://sonhangtravel.vercel.app
- Tour detail: `https://sonhangtravel.vercel.app/tour/[slug]`
- Revalidation tự động sau mỗi thao tác CRUD

---

## Lưu ý

1. Bot chạy ở chế độ **polling** — cần giữ terminal mở liên tục.
2. Mỗi khi tạo/sửa/xóa tour, bot tự động revalidate website. Không cần làm gì thêm.
3. Giá nhập dạng **số nguyên VNĐ**: `1500000` = 1.500.000đ.
4. Ảnh gửi qua Telegram tự upload lên Cloudinary, trả về URL dùng cho tour.
5. Bot **không có xác thực** — bất kỳ ai chat với bot đều có thể thao tác. Chỉ chia sẻ bot cho người tin cậy.
6. Nếu muốn dừng bot: `Ctrl+C` trong terminal.

---

## Troubleshooting

| Vấn đề | Giải pháp |
|---|---|
| `TELEGRAM_BOT_TOKEN is required` | Kiểm tra file `.env` có token đúng |
| `polling_error` | Bot khác đang chạy cùng token, hoặc token sai |
| Tour tạo nhưng web chưa cập nhật | Chờ vài giây hoặc gửi `/revalidate` |
| Upload ảnh thất bại | Kiểm tra Cloudinary credentials trong `.env` |
| Lỗi kết nối DB | Kiểm tra `DATABASE_URL` trong `.env` |
