# Local Admin Setup - Kết nối Production Database 🚀

## Vấn đề

Render free tier **rất lag** khi vào admin → Khó sử dụng để quản lý content.

## Giải pháp

**Run Strapi admin LOCAL** nhưng kết nối đến **production database** trên Render.

➡️ Admin chạy nhanh trên máy local, data được sync real-time với production!

---

## 🎯 Cách Setup

### Option 1: Local Admin → Production PostgreSQL (RECOMMENDED)

#### **Bước 1: Lấy Database URL từ Render**

1. Vào Render Dashboard → Backend service
2. Environment → Copy `DATABASE_URL`
3. Format: `postgresql://user:password@host:5432/dbname`

#### **Bước 2: Setup Local Backend**

```bash
cd backend
```

Tạo file `.env.local`:

```bash
# .env.local

# Database - Connect to production Postgres
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://your_production_db_url_here

# Local admin settings
HOST=0.0.0.0
PORT=1337
NODE_ENV=development

# Copy these from production (Render env vars)
APP_KEYS=your_production_app_keys_here
API_TOKEN_SALT=your_production_token_salt
ADMIN_JWT_SECRET=your_production_admin_jwt
TRANSFER_TOKEN_SALT=your_production_transfer_salt
JWT_SECRET=your_production_jwt_secret

# Cloudinary (copy from production)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
```

#### **Bước 3: Install pg driver nếu chưa có**

```bash
npm install pg
```

#### **Bước 4: Run Local Admin**

```bash
npm run develop
```

Admin sẽ chạy tại: **http://localhost:1337/admin**

✅ **Kết quả**: Admin nhanh như local, nhưng data là production!

---

### Option 2: Local Admin → Backup Database (An toàn hơn)

Nếu sợ làm ảnh hưởng production, có thể:

1. **Export production database**
2. **Import vào local PostgreSQL**
3. **Test changes locally trước**
4. **Sync lại khi cần**

#### **Setup Local PostgreSQL**

```bash
# Install PostgreSQL (macOS)
brew install postgresql@16
brew services start postgresql@16

# Create database
createdb sonhangtravel_local

# Update .env.local
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://localhost:5432/sonhangtravel_local
```

#### **Export/Import từ Production**

```bash
# Export from Render (get connection string first)
pg_dump $PRODUCTION_DATABASE_URL > backup.sql

# Import to local
psql sonhangtravel_local < backup.sql
```

---

## ⚠️ Lưu ý Quan trọng

### Khi dùng Local Admin → Production Database:

1. **✅ Ưu điểm**:
   - Admin cực nhanh (không lag)
   - Real-time sync với production
   - Không cần export/import

2. **⚠️ Nhược điểm**:
   - Thay đổi ảnh hưởng TRỰC TIẾP production
   - Phải cẩn thận khi xóa/sửa
   - Cần VPN/firewall nếu DB có IP whitelist

3. **🔒 Bảo mật**:
   - **KHÔNG** commit `.env.local` lên Git
   - Chỉ dùng trên máy trusted
   - Đảm bảo strong password cho DB

---

## 🎯 Workflow Khuyến nghị

### Development Flow:

```
1. Run local admin: npm run develop
2. Chỉnh sửa content trong admin
3. Changes → save vào production DB
4. Frontend (Vercel) tự động revalidate
5. Users thấy content mới
```

### Backup Flow:

```bash
# Weekly backup
pg_dump $DATABASE_URL > backups/backup_$(date +%Y%m%d).sql

# Nếu có lỗi, restore:
psql $DATABASE_URL < backups/backup_20260109.sql
```

---

## 🚀 Alternative: Upgrade Render Plan

Nếu không muốn setup local:

| Plan | Price | Performance |
|------|-------|-------------|
| Free | $0/mo | Slow, sleeps after 15min |
| Starter | $7/mo | Fast, always on |
| Standard | $25/mo | Faster, more resources |

**$7/month Starter plan** → Admin sẽ nhanh hơn nhiều!

---

## 🐛 Troubleshooting

### Lỗi: "Connection refused"

```bash
# Check if DB URL đúng
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

### Lỗi: "SSL required"

Thêm vào `.env.local`:
```bash
DATABASE_SSL=true
```

Hoặc trong code (database.ts):
```typescript
ssl: { rejectUnauthorized: false }
```

### Lỗi: "Too many connections"

Production DB có connection limit. Giảm pool size:
```bash
DATABASE_POOL_MIN=1
DATABASE_POOL_MAX=2
```

### Admin chạy nhưng không thấy data

- Check `DATABASE_URL` có đúng không
- Verify admin credentials (phải dùng account production)
- Check network/firewall

---

## 📊 So sánh Options

| Feature | Render Admin | Local → Prod DB | Local → Backup DB |
|---------|--------------|-----------------|-------------------|
| Tốc độ | ❌ Rất chậm | ✅ Cực nhanh | ✅ Cực nhanh |
| Setup | ✅ Không cần | ⚠️ Cần setup | ⚠️ Cần setup + sync |
| Real-time sync | ✅ Luôn sync | ✅ Luôn sync | ❌ Cần sync thủ công |
| An toàn | ✅ Isolated | ⚠️ Trực tiếp prod | ✅ Test local trước |
| Cost | Free | Free | Free |

**→ Khuyến nghị: Local → Prod DB** nếu bạn cẩn thận với changes!

---

## 💡 Tips

1. **Tạo Admin User riêng cho local**:
   ```bash
   # Trong Strapi admin
   Settings > Administration Panel > Users
   Create user: local-admin
   ```

2. **Backup trước khi thay đổi lớn**:
   ```bash
   pg_dump $DATABASE_URL > backup_before_changes.sql
   ```

3. **Sử dụng Draft Mode**:
   - Tạo content trong Draft
   - Review kỹ
   - Publish khi ready

4. **Monitor changes**:
   - Check Vercel deployment logs
   - Verify frontend hiển thị đúng
   - Test trên production URL

---

## ✅ Checklist

- [ ] Lấy `DATABASE_URL` từ Render
- [ ] Copy tất cả secrets từ production env vars
- [ ] Tạo `.env.local` với config đúng
- [ ] Install `pg` driver
- [ ] Run `npm run develop`
- [ ] Login vào admin tại http://localhost:1337/admin
- [ ] Test tạo/sửa content
- [ ] Verify changes trên production frontend
- [ ] Setup weekly backup script

---

**Status**: ✅ Bây giờ bạn có thể quản lý content nhanh như local, không còn lag! 🚀
