# 🚀 Deploy Strapi Admin lên Railway.app (Singapore)

## 🎯 Mục tiêu
Deploy Strapi backend từ Render (US - lag) sang Railway (Singapore - nhanh) để admin load nhanh hơn từ VN.

---

## Bước 1: Chuẩn bị Backend

### 1.1: Tạo Railway configuration file

Railway tự động detect Node.js app, nhưng cần specify start command.

**Tạo file `railway.json` trong thư mục `backend/`:**

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm run start",
    "healthcheckPath": "/_health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 1.2: Verify start script

Check `backend/package.json` có đúng scripts:

```json
{
  "scripts": {
    "develop": "strapi develop",
    "start": "strapi start",
    "build": "strapi build",
    "strapi": "strapi"
  }
}
```

✅ **Đã có sẵn - OK!**

---

## Bước 2: Deploy lên Railway

### 2.1: Create New Project

1. **Login Railway.app** → Dashboard
2. **New Project** → **Deploy from GitHub repo**
3. **Connect GitHub** (nếu chưa)
4. **Select repo**: `klvenus/sonhangtravel`
5. **Select root directory**: Click "Settings" → Change root to `/backend`

### 2.2: Chọn Singapore Region ⚠️ QUAN TRỌNG

```
Settings → Environment → Region → Singapore (sin)
```

**LƯU Ý:**
- Free tier chỉ cho phép 1 region
- Chọn Singapore = gần VN nhất (~20-50ms)
- Không thể đổi region sau khi deploy

### 2.3: Add PostgreSQL Database

1. **New** → **Database** → **Add PostgreSQL**
2. Railway tự động tạo database
3. Database cũng ở Singapore region
4. **QUAN TRỌNG**: Railway sẽ tự động tạo env var `DATABASE_URL`

---

## Bước 3: Configure Environment Variables

### 3.1: Railway tự động tạo

Railway auto-inject các biến này:

```bash
DATABASE_URL=postgresql://user:pass@host:port/db
PORT=3000  # Railway tự assign
```

### 3.2: Thêm các env vars khác

Vào **Variables** tab, add từng biến:

```bash
# App Config
NODE_ENV=production
HOST=0.0.0.0
PORT=${{PORT}}  # Dùng Railway's dynamic port

# Admin
ADMIN_JWT_SECRET=<random-string-32-chars>
API_TOKEN_SALT=<random-string-32-chars>
APP_KEYS=<random-string-64-chars>
JWT_SECRET=<random-string-32-chars>
TRANSFER_TOKEN_SALT=<random-string-32-chars>

# Database - Railway auto-injects
DATABASE_CLIENT=postgres
DATABASE_URL=${{DATABASE_URL}}

# Cloudinary (copy từ Render)
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# CORS - Allow frontend
CLIENT_URL=https://sonhangtravel.vercel.app

# Optional: Email, etc
EMAIL_PROVIDER=sendgrid
EMAIL_PROVIDER_API_KEY=<your-sendgrid-key>
```

**Tạo random secrets:**

```bash
# Chạy trên local terminal
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# Copy output → paste vào Railway env vars
```

### 3.3: Parse DATABASE_URL

Railway cung cấp `DATABASE_URL` format:
```
postgresql://user:pass@host:port/db
```

Cần update `backend/config/database.ts` để parse URL:

**File: `backend/config/database.ts`**

```typescript
import path from 'path';

export default ({ env }) => {
  // Parse DATABASE_URL if exists (Railway, Heroku format)
  const databaseUrl = env('DATABASE_URL');

  if (databaseUrl) {
    const url = new URL(databaseUrl);
    return {
      connection: {
        client: 'postgres',
        connection: {
          host: url.hostname,
          port: parseInt(url.port),
          database: url.pathname.substring(1), // Remove leading '/'
          user: url.username,
          password: url.password,
          ssl: env.bool('DATABASE_SSL', false) ? {
            rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false)
          } : false,
        },
        debug: false,
        pool: {
          min: 0,
          max: 10,
          acquireTimeoutMillis: 60000,
          createTimeoutMillis: 60000,
          destroyTimeoutMillis: 5000,
          idleTimeoutMillis: 30000,
          reapIntervalMillis: 1000,
          createRetryIntervalMillis: 200,
        },
      },
    };
  }

  // Fallback to SQLite for development
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };
};
```

---

## Bước 4: Deploy & Verify

### 4.1: Trigger Deploy

Railway tự động deploy khi:
- ✅ Push code lên GitHub
- ✅ Click "Deploy" trong Railway dashboard

**First deploy:**
1. Click **Deploy** button
2. Watch logs: **View Logs**
3. Đợi build xong (~3-5 phút)

### 4.2: Check Deployment

**Logs cần thấy:**

```
✓ Building application...
✓ Installing dependencies...
✓ Building Strapi...
✓ Starting server on 0.0.0.0:3000...
✓ Server started
```

**Nếu lỗi:**
- Check logs tab
- Verify env vars đúng
- Check database connection

### 4.3: Get Railway URL

Railway tự tạo URL:
```
https://<project-name>-production.up.railway.app
```

**Copy URL này** để update frontend.

---

## Bước 5: Update Frontend (Vercel)

### 5.1: Update Environment Variables

Vào **Vercel Dashboard** → Project Settings → Environment Variables:

```bash
# Thay đổi từ Render URL sang Railway URL
NEXT_PUBLIC_STRAPI_URL=https://<your-app>-production.up.railway.app

# Các biến khác giữ nguyên
STRAPI_API_TOKEN=<keep-same>
REVALIDATE_SECRET=<keep-same>
PREVIEW_SECRET=<keep-same>
```

### 5.2: Redeploy Frontend

```bash
# Trigger redeploy để apply env vars mới
# Vercel Dashboard → Deployments → Redeploy
```

---

## Bước 6: Migrate Data từ Render → Railway

### Option 1: Export/Import qua Admin UI

**Từ Render:**
```
1. Login admin cũ: https://sonhangtravel.onrender.com/admin
2. Content-Type Builder → Export tất cả content types
3. Content Manager → Export data (JSON)
```

**Lên Railway:**
```
1. Login admin mới: https://<railway-url>/admin
2. Tạo admin user đầu tiên
3. Import content types
4. Import data
```

### Option 2: Database Dump (Recommended for large data)

**Export từ Render:**

```bash
# Get Render database credentials
# Render Dashboard → Database → Connection Details

# Local terminal
pg_dump -h <render-host> \
  -U <render-user> \
  -d <render-db> \
  -f render_backup.sql

# Compress
gzip render_backup.sql
```

**Import lên Railway:**

```bash
# Get Railway database credentials
# Railway Dashboard → PostgreSQL → Connect → Connection Details

# Restore
gunzip render_backup.sql.gz
psql -h <railway-host> \
  -U <railway-user> \
  -d <railway-db> \
  -f render_backup.sql
```

### Option 3: Fresh Start (Simplest)

Nếu data ít:
1. Deploy Railway mới
2. Tạo admin user
3. Manually re-add content types
4. Manually re-add tours/categories (hoặc import JSON)

---

## Bước 7: Setup Custom Domain (Optional)

### 7.1: Add Domain

Railway Dashboard → Settings → Domains:
```
admin.sonhangtravel.com
```

### 7.2: Update DNS

Thêm CNAME record:
```
Type: CNAME
Name: admin
Value: <your-app>-production.up.railway.app
```

### 7.3: Update Frontend

```bash
NEXT_PUBLIC_STRAPI_URL=https://admin.sonhangtravel.com
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. **Railway Free Tier Limits**

```
Free Credits: $5/month
≈ 500 hours execution time
≈ Đủ cho 1 app nhỏ chạy 24/7

Nếu vượt $5:
- App tự động sleep
- Hoặc upgrade plan ($5-$10/month)
```

**Monitor usage:**
- Railway Dashboard → Usage
- Set up billing alerts

### 2. **Database Backup**

Railway không có auto-backup trên free tier!

**Setup manual backup:**

```bash
# Tạo cron job backup hàng tuần
# File: backup-railway-db.sh

#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="railway_backup_$DATE.sql"

# Get Railway DB URL from env
pg_dump $DATABASE_URL -f $BACKUP_FILE
gzip $BACKUP_FILE

# Upload to cloud storage (Dropbox, Google Drive, etc)
# Or commit to private GitHub repo
```

### 3. **Environment Isolation**

```
Production (Railway):
  - DATABASE_URL → Railway PostgreSQL
  - NODE_ENV=production

Development (Local):
  - SQLite database
  - NODE_ENV=development
```

### 4. **CORS Configuration**

Update `backend/config/middlewares.ts`:

```typescript
export default [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'res.cloudinary.com', // Cloudinary
            'sonhangtravel.vercel.app', // Frontend
          ],
          'media-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'https://sonhangtravel.vercel.app',
        'http://localhost:3000',
        'http://localhost:1337',
      ],
      credentials: true,
    },
  },
  // ... other middlewares
];
```

### 5. **Health Check Endpoint**

Railway dùng health check để verify app running.

**Already exists:** `backend/src/api/_health/routes/_health.ts`

Verify URL works:
```bash
curl https://<railway-url>/_health
# Should return: {"status":"ok"}
```

---

## 🎯 Checklist Hoàn Thành

- [ ] Railway project created với Singapore region
- [ ] PostgreSQL database added
- [ ] Environment variables configured đầy đủ
- [ ] `backend/config/database.ts` parse DATABASE_URL
- [ ] Deploy thành công, logs không có error
- [ ] Admin URL accessible: `https://<app>.up.railway.app/admin`
- [ ] Tạo admin user đầu tiên
- [ ] Migrate data từ Render (nếu có)
- [ ] Frontend Vercel updated với Railway URL mới
- [ ] Frontend redeploy và test
- [ ] CORS working: frontend có thể fetch data
- [ ] Admin load nhanh từ VN (~20-50ms ping)

---

## 🐛 Troubleshooting

### Lỗi: "Application failed to respond"

**Nguyên nhân:** PORT binding sai

**Fix:**
```bash
# Railway Variables
PORT=${{PORT}}  # Must use Railway's dynamic port
HOST=0.0.0.0    # Must bind to 0.0.0.0
```

### Lỗi: "Database connection refused"

**Nguyên nhân:** DATABASE_URL parsing sai

**Fix:**
- Check `backend/config/database.ts` parse URL đúng
- Verify Railway PostgreSQL running (Services tab)
- Check env var `DATABASE_URL` exists

### Lỗi: "Build failed - out of memory"

**Nguyên nhân:** Free tier RAM limit

**Fix:**
```json
// railway.json - reduce build memory
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "NODE_OPTIONS='--max-old-space-size=2048' npm install && npm run build"
  }
}
```

### Admin lag vẫn chậm?

**Check:**
1. Railway region = Singapore? (Settings → Region)
2. Ping test từ VN:
   ```bash
   ping <your-app>-production.up.railway.app
   # Should be ~20-50ms
   ```
3. Cloudinary images loading chậm? → Preload images
4. Check Railway usage không exceed limit

---

## 📊 So sánh Render vs Railway

| Metric | Render (Oregon, US) | Railway (Singapore) |
|--------|---------------------|---------------------|
| **Ping từ VN** | ~200-300ms | ~20-50ms |
| **Admin load time** | 3-5s | 0.5-1s |
| **Free tier** | 750h/month | $5 credit/month |
| **Cold start** | 15 min → 30-60s | No cold start (always on) |
| **Database** | PostgreSQL ✅ | PostgreSQL ✅ |
| **Region** | US West | Asia (Singapore) |

**Kết luận:** Railway Singapore **NHANH HẠO HƠN 5-10 LẦN** so với Render US!

---

## 🚀 Next Steps

1. **Deploy ngay:**
   - Follow guide trên
   - Estimate: 15-30 phút setup

2. **Test admin speed:**
   - Login Railway admin
   - So sánh với Render
   - Measure load time

3. **Keep Render as backup** (optional):
   - Không xóa Render ngay
   - Dùng làm failover nếu Railway có vấn đề
   - Sau 1 tuần ổn định → xóa Render

4. **Monitor usage:**
   - Railway Dashboard → Usage
   - Set alert khi gần $5
   - Optimize nếu cần

---

**Good luck! Railway Singapore sẽ cải thiện admin experience CỰC NHIỀU! 🚀**
