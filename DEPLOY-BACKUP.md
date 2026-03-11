# DEPLOY-BACKUP.md

## Mục tiêu
Giữ toàn bộ cấu hình quan trọng để nếu đổi tài khoản Vercel mới thì chỉ cần import repo + khai báo env + link project là chạy lại, không phải viết lại từ đầu.

## Những gì đã có sẵn trong repo
- `frontend/vercel.json`: cron `/api/warm-cache`
- `frontend/package.json`: scripts build/dev/start
- `admin/package.json`: scripts build/dev
- `backend/.env.example`: mẫu env backend
- Toàn bộ source code frontend/admin/backend đã nằm trong git

## Những gì PHẢI backup ngoài git

### 1) Environment variables
Không commit secret thật vào git. Giữ 1 bản backup private ở 1Password/Apple Notes/Bear/Obsidian private.

#### Frontend (`frontend/.env.local`)
Cần các key sau:
- `NEXT_PUBLIC_STRAPI_URL`
- `STRAPI_API_TOKEN`
- `DATABASE_URL`
- `ADMIN_PASSWORD`

#### Admin (`admin/.env.local`)
Cần các key sau:
- `DATABASE_URL`
- `CLOUDINARY_NAME`
- `CLOUDINARY_KEY`
- `CLOUDINARY_SECRET`
- `VERCEL_SITE_URL`
- `REVALIDATE_SECRET`

#### Root / service khác
- `/.env`
- `backend/.env`
- `telegram-bot/.env`
- `zalo-miniapp/.env`

### 2) Vercel project settings
Trong tài khoản Vercel cũ cần note lại:
- Project name
- Root directory (`frontend` nếu deploy site public)
- Framework preset (Next.js)
- Production branch
- Domain đang gắn
- Cron jobs
- Environment Variables của từng môi trường
- Node version nếu có pin riêng

### 3) Domain / DNS
Nếu đổi account Vercel mà vẫn dùng domain cũ:
- backup DNS records hiện tại
- note domain nào đang gắn project nào
- sau khi transfer / add domain sang account mới thì verify lại DNS

### 4) Database / media
- Neon project connection string
- Cloudinary cloud name + API key/secret
- Nếu dùng Strapi cũ thì backup URL + token

## Cách khôi phục khi đổi sang account Vercel mới

### Phương án nhanh nhất
1. Tạo account/team Vercel mới
2. Import GitHub repo hiện tại
3. Chọn đúng root deploy là `frontend`
4. Add toàn bộ env của frontend vào Vercel project
5. Nếu admin cũng cần deploy riêng thì tạo thêm 1 project root `admin`
6. Add domain cũ vào project mới
7. Verify build + cron + revalidate route

### Nếu dùng Vercel CLI local
```bash
cd /Users/khumlong/sonhangtravel/frontend
vercel link
vercel env add
vercel --prod
```

## Checklist sau khi khôi phục
- Site public lên bình thường
- Trang tour render đúng dữ liệu Neon
- Ảnh Cloudinary load OK
- Revalidate hoạt động
- Cron `/api/warm-cache` vẫn chạy
- Admin local `npm run dev` chạy được
- Nếu có admin deploy riêng: build OK

## Backup xoay vòng tự động
Thiết kế hiện tại:
- giữ **5 ngày gần nhất**
- mỗi ngày giữ **2 bản mới nhất**
- backup gồm env + config deploy quan trọng để migrate Vercel account nhanh

### Tạo backup thủ công
```bash
/Users/khumlong/sonhangtravel/ops/backup-sonhang.sh
```

### Xem danh sách backup
```bash
/Users/khumlong/sonhangtravel/ops/list-backups.sh
```

### Restore từ 1 bản backup
```bash
/Users/khumlong/sonhangtravel/ops/restore-sonhang.sh 2026-03-11_09-50-57.tar.gz
```

### Auto backup trên macOS bằng launchd
Đã có sẵn launcher chạy tự động lúc **09:00** và **21:00** mỗi ngày.

Cài / bật:
```bash
/Users/khumlong/sonhangtravel/ops/install-backup-launchd.sh
```

Gỡ:
```bash
/Users/khumlong/sonhangtravel/ops/uninstall-backup-launchd.sh
```

## Khuyến nghị để khỏi quên
- Giữ secret trong 1Password, không giữ mỗi ở `.env.local`
- Mỗi lần thêm biến môi trường mới: cập nhật ngay vào file backup secret riêng
- Nếu thay domain / project name / cron: cập nhật file này luôn
- Có thể gắn `backup-sonhang.sh` vào cron/local scheduler để tự chạy 2 lần/ngày

## Lệnh local hay dùng
### Frontend
```bash
cd /Users/khumlong/sonhangtravel/frontend
npm run dev
npm run build
```

### Admin
```bash
cd /Users/khumlong/sonhangtravel/admin
npm run dev
npm run build
```

### Revalidate site
```bash
python3 ~/.openclaw/workspaces/sonhang-travel/skills/sonhang-travel/sonhang.py revalidate
```
