# 🚀 SETUP DỰ ÁN TỪ ĐẦU - ENVIRONMENT VARIABLES

## 📋 Tổng quan

Project: **Sơn Hằng Travel**
- Frontend: Vercel (Next.js)
- Backend: Railway Singapore (Strapi)
- Database: Railway PostgreSQL
- Media: Cloudinary

---

## 1️⃣ VERCEL ENVIRONMENT VARIABLES (Frontend)

**Vercel Dashboard → Project Settings → Environment Variables**

```bash
# ============================================
# Backend API URL (Railway Singapore)
# ============================================
NEXT_PUBLIC_STRAPI_URL=https://sonhangtravel-production.up.railway.app

# ============================================
# API Authentication (từ Railway backend)
# ============================================
STRAPI_API_TOKEN=<lấy-từ-railway-admin-sau-khi-tạo>

# ============================================
# Revalidation Secret (dùng chung với Railway)
# ============================================
REVALIDATE_SECRET=<tạo-random-string-32-chars>

# ============================================
# Preview Mode Secret
# ============================================
PREVIEW_SECRET=<tạo-random-string-32-chars>

# ============================================
# Google Verification (Optional)
# ============================================
NEXT_PUBLIC_GOOGLE_VERIFICATION=<your-google-verification-code>
```

### 📝 Notes:

**Environments:**
- ✅ Production
- ✅ Preview
- ✅ Development

**Generate Random Secrets:**
```bash
# Mac/Linux Terminal:
openssl rand -base64 32

# Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Online: https://randomkeygen.com/
```

---

## 2️⃣ RAILWAY ENVIRONMENT VARIABLES (Backend)

**Railway Dashboard → sonhangtravel service → Variables → Raw Editor**

```bash
# ============================================
# Node Environment
# ============================================
NODE_ENV=production
HOST=0.0.0.0

# ============================================
# Database (Railway PostgreSQL - Auto-injected)
# ============================================
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_SSL=false

# ============================================
# Strapi App Secrets (GENERATE MỚI!)
# ============================================
ADMIN_JWT_SECRET=<generate-random-32-chars>
API_TOKEN_SALT=<generate-random-32-chars>
APP_KEYS=<generate-random-64-chars>
JWT_SECRET=<generate-random-32-chars>
TRANSFER_TOKEN_SALT=<generate-random-32-chars>
ENCRYPTION_KEY=<generate-random-32-chars>

# ============================================
# Cloudinary (Media Storage)
# ============================================
CLOUDINARY_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_KEY=<your-cloudinary-api-key>
CLOUDINARY_SECRET=<your-cloudinary-api-secret>

# ============================================
# Frontend URL
# ============================================
CLIENT_URL=https://sonhangtravel.vercel.app

# ============================================
# Revalidation Secret (CÙNG secret với Vercel)
# ============================================
REVALIDATE_SECRET=<same-as-vercel-secret>
```

---

## 3️⃣ GENERATE SECRETS - Script tiện lợi

Chạy script này trên Mac/PC để generate tất cả secrets một lần:

**File: `generate-all-secrets.sh`**

```bash
#!/bin/bash

echo "🔐 RAILWAY BACKEND SECRETS"
echo "=========================="
echo ""
echo "ADMIN_JWT_SECRET=$(openssl rand -base64 32)"
echo "API_TOKEN_SALT=$(openssl rand -base64 32)"
echo "APP_KEYS=$(openssl rand -base64 64)"
echo "JWT_SECRET=$(openssl rand -base64 32)"
echo "TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)"
echo "ENCRYPTION_KEY=$(openssl rand -base64 32)"
echo ""
echo "🔐 SHARED SECRETS (dùng cho cả Vercel + Railway)"
echo "=========================="
echo ""
echo "REVALIDATE_SECRET=$(openssl rand -base64 32)"
echo "PREVIEW_SECRET=$(openssl rand -base64 32)"
echo ""
echo "✅ Copy các secrets trên paste vào Railway Variables!"
```

**Chạy:**
```bash
chmod +x generate-all-secrets.sh
./generate-all-secrets.sh
```

---

## 4️⃣ CLOUDINARY SETUP

### Lấy Cloudinary credentials:

1. **Login:** https://cloudinary.com
2. **Dashboard** → Settings → **API Keys**
3. Copy 3 giá trị:
   ```
   Cloud Name: dzxntgoko (hoặc tên của bạn)
   API Key: 316995586271977
   API Secret: 9YuonKfWHcfu-OBlcUC8-nCXG3o
   ```

**Hoặc giữ nguyên credentials hiện tại** (nếu Cloudinary account vẫn hoạt động).

---

## 5️⃣ STRAPI API TOKEN (Generate sau khi deploy Railway)

**QUAN TRỌNG:** Token này phải generate TRONG Railway admin!

### Bước 1: Deploy Railway trước

1. Railway với env vars (KHÔNG có `STRAPI_API_TOKEN`)
2. Đợi deploy xong
3. Vào admin: `https://sonhangtravel-production.up.railway.app/admin`
4. Tạo admin user đầu tiên

### Bước 2: Generate API Token

Railway Admin:

1. **Settings** → **API Tokens**
2. **Create new API Token**
3. **Name:** `Vercel Frontend`
4. **Token type:** `Full Access` hoặc `Custom`
5. **Permissions:** ✅ Read cho Tour, Category, Site Settings
6. **Click Create**
7. **Copy token** (chỉ hiện 1 lần!)

### Bước 3: Add vào Vercel

Vercel → Environment Variables:
```
STRAPI_API_TOKEN=<token-vừa-copy>
```

Redeploy Vercel!

---

## 6️⃣ SETUP CHECKLIST - Theo thứ tự

### ✅ Phase 1: Railway Backend

- [ ] Railway project created (Singapore region)
- [ ] PostgreSQL database added
- [ ] Environment variables configured (14 biến - KHÔNG có STRAPI_API_TOKEN)
- [ ] Deploy thành công
- [ ] Admin URL accessible
- [ ] Tạo admin user đầu tiên
- [ ] Upload media test (check Cloudinary)

### ✅ Phase 2: Generate API Token

- [ ] Railway admin → Settings → API Tokens
- [ ] Create token với Full Access
- [ ] Copy token (lưu tạm vào Notes)

### ✅ Phase 3: Vercel Frontend

- [ ] Environment variables configured (5 biến)
- [ ] `NEXT_PUBLIC_STRAPI_URL` = Railway URL
- [ ] `STRAPI_API_TOKEN` = Token từ Railway
- [ ] `REVALIDATE_SECRET` = CÙNG secret với Railway
- [ ] Deploy (UNCHECK cache)
- [ ] Test homepage load

### ✅ Phase 4: Content Setup

- [ ] Railway admin → Content-Type Builder OK
- [ ] Tạo 2-3 categories
- [ ] Tạo 5-6 tours
- [ ] Mark 3 tours as "Featured"
- [ ] Publish tất cả
- [ ] Test frontend hiển thị data

### ✅ Phase 5: Cache & Performance

- [ ] Test manual revalidate API
- [ ] Tạo tour mới → Check auto-revalidate
- [ ] Clear browser cache
- [ ] Test speed từ VN

---

## 7️⃣ COMMON ISSUES & FIXES

### Issue 1: Frontend hiển thị demo data

**Nguyên nhân:**
- `NEXT_PUBLIC_STRAPI_URL` sai hoặc thiếu
- Railway backend chưa có tours
- Tours chưa mark "Featured"

**Fix:**
```bash
# Check Vercel env var
NEXT_PUBLIC_STRAPI_URL=https://sonhangtravel-production.up.railway.app

# Redeploy Vercel (UNCHECK cache)
# Railway admin → Mark tours as Featured
```

### Issue 2: "Invalid token" khi revalidate

**Nguyên nhân:**
- `REVALIDATE_SECRET` khác nhau giữa Vercel & Railway

**Fix:**
```bash
# Vercel & Railway PHẢI CÙNG secret:
REVALIDATE_SECRET=your_same_secret_123
```

### Issue 3: "500 Error" khi tạo tour

**Nguyên nhân:**
- PostgreSQL integer parsing error

**Fix:**
- Code đã fix trong `tour/services/tour.ts`
- Railway phải deploy branch `claude/project-review-audit-JmxiI`

### Issue 4: Cache không clear

**Nguyên nhân:**
- `REVALIDATE_SECRET` chưa setup
- Lifecycle hooks chưa deploy

**Fix:**
```bash
# Railway cần deploy code mới nhất với:
# - backend/src/api/tour/content-types/tour/lifecycles.ts
# - backend/src/api/category/content-types/category/lifecycles.ts

# Manual clear:
https://sonhangtravel.vercel.app/api/revalidate?secret=YOUR_SECRET&path=/
```

---

## 8️⃣ DEPLOYMENT COMMANDS

### Railway Deploy

Railway auto-deploy khi push code lên GitHub:

```bash
# Ensure Railway watches correct branch:
# Settings → Source → Branch: claude/project-review-audit-JmxiI

# Or create 'main' branch:
git checkout -b main
git push -u origin main
# Update Railway → Branch: main
```

### Vercel Deploy

Vercel auto-deploy khi push lên GitHub (branch `main` hoặc `master`).

**Manual redeploy:**
- Vercel Dashboard → Deployments → Redeploy

**Clear cache:**
- Redeploy → ❌ UNCHECK "Use existing Build Cache"

---

## 9️⃣ VERIFICATION TESTS

### Test 1: Backend Health

```bash
# Railway admin accessible
https://sonhangtravel-production.up.railway.app/admin

# API responsive
https://sonhangtravel-production.up.railway.app/api/tours
```

### Test 2: Frontend Connection

```bash
# Homepage loads
https://sonhangtravel.vercel.app

# Console check (F12):
fetch('https://sonhangtravel.vercel.app/api/keep-alive')
  .then(r => r.json())
  .then(console.log)
# Should show Railway URL
```

### Test 3: Revalidation

```bash
# Manual revalidate
https://sonhangtravel.vercel.app/api/revalidate?secret=YOUR_SECRET&path=/

# Should return:
{
  "revalidated": true,
  "message": "Cache cleared successfully"
}
```

### Test 4: Auto-revalidation

```
1. Tạo tour mới trong Railway admin
2. Save + Publish
3. Check Railway logs → Phải thấy "Revalidated: /"
4. Refresh frontend → Tour mới hiện trong 5 phút
```

---

## 🔟 FINAL ENV VARS SUMMARY

### Vercel (5 biến):
```
NEXT_PUBLIC_STRAPI_URL
STRAPI_API_TOKEN
REVALIDATE_SECRET
PREVIEW_SECRET
NEXT_PUBLIC_GOOGLE_VERIFICATION (optional)
```

### Railway (15 biến):
```
NODE_ENV
HOST
DATABASE_CLIENT
DATABASE_URL
DATABASE_SSL
ADMIN_JWT_SECRET
API_TOKEN_SALT
APP_KEYS
JWT_SECRET
TRANSFER_TOKEN_SALT
ENCRYPTION_KEY
CLOUDINARY_NAME
CLOUDINARY_KEY
CLOUDINARY_SECRET
CLIENT_URL
REVALIDATE_SECRET
```

**PORT** → KHÔNG thêm vào Variables (Railway tự inject)

---

## 📞 Support

**Nếu vẫn lỗi:**
1. Check Railway logs: Deployments → View Logs
2. Check Vercel logs: Deployments → Function Logs
3. Check browser console: F12 → Console tab

**Common commands:**
```bash
# Clear Vercel cache
Redeploy → Uncheck "Use existing Build Cache"

# Clear browser cache
Cmd/Ctrl + Shift + R (hard refresh)

# Manual revalidate
/api/revalidate?secret=XXX&path=/
```

---

✅ **Setup xong → Test → Enjoy!** 🚀
