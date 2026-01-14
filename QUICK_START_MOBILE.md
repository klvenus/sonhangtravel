# 📱 QUICK START - Setup từ đầu trên iPhone

## 🎯 Overview

Setup lại dự án từ đầu khi gặp cache issues hoặc muốn fresh start.

**Time:** ~30 phút
**Tools:** Safari (iPhone)

---

## 1️⃣ GENERATE SECRETS (Cần Mac/PC)

**Nếu KHÔNG có Mac/PC:**

Dùng online tool: https://randomkeygen.com

**Click "Generate Keys"** → Copy các keys:

1. **504 Bit WPA Key** (cho APP_KEYS) - 64 chars
2. **256 Bit WEP Keys** (cho các secrets khác) - 32 chars mỗi cái

**Tạo list:**
```
ADMIN_JWT_SECRET=<256-bit-key-1>
API_TOKEN_SALT=<256-bit-key-2>
APP_KEYS=<504-bit-key>
JWT_SECRET=<256-bit-key-3>
TRANSFER_TOKEN_SALT=<256-bit-key-4>
ENCRYPTION_KEY=<256-bit-key-5>
REVALIDATE_SECRET=<256-bit-key-6>
PREVIEW_SECRET=<256-bit-key-7>
```

**Lưu vào Notes app!**

---

## 2️⃣ RAILWAY SETUP (10 phút)

### A. Clear old deployment

Railway Dashboard → **sonhangtravel** service:

1. **Settings** → Scroll xuống **Danger Zone**
2. **Restart Service** (hoặc Delete & tạo lại nếu muốn fresh start)

### B. Add Environment Variables

**Variables** tab → **Raw Editor** → Paste:

```
NODE_ENV=production
HOST=0.0.0.0
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_SSL=false
ADMIN_JWT_SECRET=<từ-notes-app>
API_TOKEN_SALT=<từ-notes-app>
APP_KEYS=<từ-notes-app>
JWT_SECRET=<từ-notes-app>
TRANSFER_TOKEN_SALT=<từ-notes-app>
ENCRYPTION_KEY=<từ-notes-app>
CLOUDINARY_NAME=dzxntgoko
CLOUDINARY_KEY=316995586271977
CLOUDINARY_SECRET=9YuonKfWHcfu-OBlcUC8-nCXG3o
CLIENT_URL=https://sonhangtravel.vercel.app
REVALIDATE_SECRET=<từ-notes-app>
```

**Save** → Đợi Railway deploy (~3 phút)

### C. Verify Deployment

**Deployments** tab → Status = **Active** (xanh)

**View Logs** → Phải thấy:
```
✓ Strapi started successfully
✓ Admin panel: http://0.0.0.0:8080/admin
```

### D. Create Admin User

Safari → Vào:
```
https://sonhangtravel-production.up.railway.app/admin
```

**Create first admin:**
- Email: admin@sonhangtravel.com
- Password: <strong-password>
- First Name: Admin
- Last Name: Sơn Hằng

**Submit** → Login!

---

## 3️⃣ GENERATE STRAPI API TOKEN (5 phút)

Railway Admin:

1. **Settings** (⚙️) → **API Tokens**
2. **Create new API Token**
3. **Name:** `Vercel Frontend`
4. **Token type:** `Full Access`
5. **Click Create**
6. **COPY TOKEN** (chỉ hiện 1 lần!)
7. **Paste vào Notes app** với label: `STRAPI_API_TOKEN`

---

## 4️⃣ VERCEL SETUP (10 phút)

### A. Clear old deployment (Optional)

Vercel Dashboard → **sonhangtravel**:

**Settings** → **Environment Variables** → **Delete All** (nếu muốn fresh start)

### B. Add Environment Variables

**New Variable** (add từng cái):

```
Key: NEXT_PUBLIC_STRAPI_URL
Value: https://sonhangtravel-production.up.railway.app
Environments: ✅ Production, ✅ Preview, ✅ Development
```

```
Key: STRAPI_API_TOKEN
Value: <từ-notes-app-token-vừa-copy>
Environments: ✅ Production, ✅ Preview, ✅ Development
```

```
Key: REVALIDATE_SECRET
Value: <từ-notes-app-CÙNG-với-Railway>
Environments: ✅ Production, ✅ Preview, ✅ Development
```

```
Key: PREVIEW_SECRET
Value: <từ-notes-app>
Environments: ✅ Production, ✅ Preview, ✅ Development
```

**Save tất cả!**

### C. Redeploy (QUAN TRỌNG!)

**Deployments** tab:

1. Click vào deployment mới nhất
2. **⋯** (3 dots) → **Redeploy**
3. **❌ UNCHECK "Use existing Build Cache"** ← BẮT BUỘC!
4. **Redeploy**

Đợi ~2-3 phút build!

---

## 5️⃣ ADD CONTENT (10 phút)

Railway Admin:

### A. Create Categories

**Content Manager** → **Category** → **Create new entry**:

1. **Category 1:**
   - Ten: Đông Hưng
   - Slug: dong-hung (auto)
   - Icon: 🏯
   - Upload image
   - **Save** → **Publish**

2. **Category 2:**
   - Ten: Nam Ninh
   - Slug: nam-ninh
   - Icon: 🛍️
   - Upload image
   - **Save** → **Publish**

3. **Category 3:**
   - Ten: Quế Lâm
   - Slug: que-lam
   - Icon: ⛰️
   - Upload image
   - **Save** → **Publish**

### B. Create Tours

**Content Manager** → **Tour** → **Create new entry**:

**Tour 1 (Featured):**
- Title: Tour Đông Hưng 2N1Đ - Khám phá biên giới
- Slug: tour-dong-hung-2n1d (auto)
- Short Description: Tour Đông Hưng 2 ngày 1 đêm...
- Price: 1990000
- Duration: 2N1Đ
- Destination: Đông Hưng, Trung Quốc
- Category: Đông Hưng
- **✅ Featured: CHECKED** ← QUAN TRỌNG!
- Thumbnail: Upload ảnh
- **Save** → **Publish**

**Tạo thêm 3-4 tours tương tự**, ít nhất 3 tours phải ✅ **Featured**!

---

## 6️⃣ VERIFY & TEST (5 phút)

### A. Test Backend API

Safari → Vào:
```
https://sonhangtravel-production.up.railway.app/api/tours
```

**Phải thấy JSON với tours vừa tạo!**

### B. Test Frontend

Safari → Vào:
```
https://sonhangtravel.vercel.app
```

**Phải thấy:**
- ✅ Categories hiển thị
- ✅ Tours nổi bật (3+ tours)
- ✅ KHÔNG phải demo data (Bắc Kinh, Thượng Hải...)
- ✅ Load nhanh (~1-2s)

### C. Test Revalidation

Safari → Vào:
```
https://sonhangtravel.vercel.app/api/revalidate?secret=<REVALIDATE_SECRET>&path=/
```

**Kết quả:**
```json
{
  "revalidated": true,
  "message": "Cache cleared successfully"
}
```

### D. Test Auto-revalidation

1. Railway admin → Tạo tour mới
2. **Save** → **Publish**
3. Check Railway logs → Phải thấy:
   ```
   Revalidating frontend paths: /, /tours
   ✓ Revalidated: /
   ✓ Revalidated: /tours
   ```
4. Đợi **5 phút** hoặc manual revalidate
5. Refresh frontend → Tour mới hiện!

---

## 7️⃣ TROUBLESHOOTING

### ❌ Frontend vẫn hiển thị demo data

**Fix:**
1. Check Vercel env var `NEXT_PUBLIC_STRAPI_URL` đúng Railway URL
2. Vercel phải **Redeploy KHÔNG dùng cache**
3. Railway admin phải có ít nhất 3 tours marked **Featured**
4. Clear browser cache: Safari Settings → Clear History

### ❌ "Invalid token" khi revalidate

**Fix:**
1. Check `REVALIDATE_SECRET` PHẢI GIỐNG NHAU ở Vercel & Railway
2. Vercel redeploy để apply env var mới

### ❌ "500 Error" khi tạo tour

**Fix:**
1. Railway phải deploy code mới nhất (branch `claude/project-review-audit-JmxiI`)
2. Check Railway logs → Copy lỗi gửi cho tao

### ❌ Cache không tự clear

**Fix:**
1. Check `REVALIDATE_SECRET` đã add vào Railway chưa
2. Manual revalidate: `/api/revalidate?secret=XXX&path=/`
3. Đợi 5 phút (cache time mới)

---

## 8️⃣ FINAL CHECKLIST

**Railway:**
- [ ] Service Active (xanh)
- [ ] 15 environment variables
- [ ] PostgreSQL running
- [ ] Admin login OK
- [ ] 3+ categories created
- [ ] 5+ tours created (3+ featured)

**Vercel:**
- [ ] 4-5 environment variables
- [ ] Deployed successfully
- [ ] NOT using build cache (critical!)
- [ ] Homepage loads
- [ ] Shows real data (not demo)

**Integration:**
- [ ] Revalidate API works (200 OK)
- [ ] Auto-revalidation works (check logs)
- [ ] Search works
- [ ] Tour details load

---

## 🎉 SUCCESS!

Nếu tất cả ✅ → Setup hoàn tất!

**Performance từ VN:**
- Homepage load: ~1-2s
- API response: ~20-50ms (Railway Singapore)
- Admin từ iPhone: Cực nhanh!

---

## 📞 Need Help?

**Common URLs:**
- Railway admin: https://sonhangtravel-production.up.railway.app/admin
- Frontend: https://sonhangtravel.vercel.app
- Revalidate: https://sonhangtravel.vercel.app/api/revalidate?secret=XXX&path=/

**Logs:**
- Railway: Deployments → View Logs
- Vercel: Deployments → Function Logs
- Browser: Safari → AA button → Show Web Inspector

**Quick fixes:**
```bash
# Clear cache:
/api/revalidate?secret=YOUR_SECRET&path=/

# Hard refresh:
Safari → Hold reload button → "Request Desktop Website"

# Check connection:
Console → fetch('/api/keep-alive').then(r=>r.json()).then(console.log)
```

---

✅ **Happy coding!** 🚀
