# Performance Optimization Guide 🚀

## Overview

Dự án đã được optimize để có **instant page loads** với aggressive caching strategy. Tuy nhiên, do backend (Strapi on Render free tier) có cold start issue, cần setup keep-alive service.

---

## 🎯 Current Performance Strategy

### 1. Aggressive ISR Caching
- **Homepage**: Cache 24 giờ (86400s)
- **Tour Detail**: Cache 12 giờ (43200s)
- **API Calls**: Cache 24 giờ (86400s) mặc định

**Result**: Users luôn thấy cached version ngay lập tức, không phải chờ backend.

### 2. Static Site Generation (SSG)
- Tất cả tour pages được pre-render at build time
- 100 tours phổ biến nhất được generate sẵn
- New tours được generate on-demand

### 3. Cache Warming
- Vercel Cron chạy 1 lần/ngày lúc 6am
- Warm tất cả pages + backend wake-up
- Ensures pages luôn fresh vào giờ cao điểm

---

## ⚡ Backend Keep-Alive Setup (CRITICAL!)

**Problem**: Render free tier sleep sau 15 phút không dùng → Cold start 15-30s

**Solution**: Setup external cron để ping backend mỗi 5-10 phút

### Option 1: Cron-Job.org (RECOMMENDED - FREE)

1. **Sign up** tại https://cron-job.org
2. **Create New Cron Job**:
   ```
   Title: Sơn Hằng Travel - Keep Alive
   URL: https://sonhangtravel.vercel.app/api/keep-alive
   Schedule: */10 * * * * (Every 10 minutes)
   Method: GET
   Timeout: 30 seconds
   ```
3. **Save & Enable**

### Option 2: EasyCron (FREE tier available)

1. Sign up tại https://www.easycron.com
2. Create cron job:
   ```
   URL: https://sonhangtravel.vercel.app/api/keep-alive
   When: Every 10 minutes
   ```

### Option 3: UptimeRobot (FREE - Bonus: monitoring)

1. Sign up tại https://uptimerobot.com
2. Add New Monitor:
   ```
   Monitor Type: HTTP(s)
   URL: https://sonhangtravel.vercel.app/api/keep-alive
   Monitoring Interval: 5 minutes
   ```

**Benefit**: Cũng có uptime monitoring miễn phí!

---

## 📊 Performance Metrics (Expected)

### After Optimization:

#### First Visit (Cold)
- **Homepage**: 800ms - 1.5s (if backend warm)
- **Tour Detail**: 1s - 2s (if backend warm)
- **With Cold Backend**: +15-30s (only happens if keep-alive not setup)

#### Return Visit (Cached)
- **Homepage**: 100-300ms ⚡
- **Tour Detail**: 150-400ms ⚡
- **Navigation**: Instant (prefetch)

### With Keep-Alive Setup:
- **First Visit**: 800ms - 1.5s (backend always warm)
- **Return Visit**: 100-300ms
- **No cold starts!** 🎉

---

## 🔧 Advanced Optimizations

### 1. On-Demand Revalidation

Khi update tour trong Strapi admin, trigger revalidation ngay lập tức:

```bash
# Call revalidation webhook
curl -X POST "https://sonhangtravel.vercel.app/api/revalidate?secret=YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"model": "tour", "entry": {"slug": "tour-dong-hung"}}'
```

Setup Strapi webhook:
1. Strapi Admin > Settings > Webhooks
2. Create webhook:
   ```
   URL: https://sonhangtravel.vercel.app/api/revalidate
   Headers: x-revalidate-token: YOUR_REVALIDATE_SECRET
   Events: entry.create, entry.update, entry.delete
   ```

### 2. Prefetch Critical Pages

Đã implement automatic prefetching cho:
- Links visible in viewport
- Next.js automatic prefetch on hover

### 3. Bundle Optimization

Analyze bundle size:
```bash
npm run analyze
```

---

## 🎯 Checklist

### Initial Setup
- [ ] Setup cron-job.org để ping `/api/keep-alive` mỗi 10 phút
- [ ] Verify cron job hoạt động (check logs)
- [ ] Setup Strapi webhook cho on-demand revalidation

### Monitoring
- [ ] Check Vercel Analytics để xem performance metrics
- [ ] Monitor backend uptime via UptimeRobot (optional)
- [ ] Check cache hit rate

### Optimization
- [ ] Run `npm run analyze` để check bundle size
- [ ] Optimize images nếu cần (compress, WebP)
- [ ] Review và remove unused dependencies

---

## 📈 Performance Debugging

### Check if backend is alive:
```bash
curl -I https://sonhangtravel.onrender.com/_health
```

### Check cache warming status:
```bash
curl https://sonhangtravel.vercel.app/api/warm-cache
```

### Check keep-alive status:
```bash
curl https://sonhangtravel.vercel.app/api/keep-alive
```

### Vercel Logs:
```bash
vercel logs
```

---

## 🚨 Troubleshooting

### Issue: Pages still slow after 1 hour
**Cause**: Cache expired + backend cold
**Fix**:
1. Ensure keep-alive cron is running
2. Check cron-job.org logs
3. Increase cron frequency to every 5 mins

### Issue: First visit very slow
**Cause**: Backend cold start
**Fix**: Setup keep-alive cron (see above)

### Issue: Old content showing
**Cause**: Aggressive caching
**Fix**: Use on-demand revalidation after CMS updates

---

## 💡 Tips

1. **Peak Hours**: Cache warming chạy lúc 6am để sẵn sàng cho ngày mới
2. **Keep-Alive**: Chạy mỗi 10 phút là đủ, không cần quá thường xuyên
3. **Revalidation**: Chỉ cần on-demand revalidation khi update content quan trọng
4. **Monitoring**: Check Vercel Analytics hàng tuần để track performance

---

## 📚 References

- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Render Free Tier Limits](https://render.com/docs/free)

---

**Status**: ✅ Optimized for instant page loads with 24h aggressive caching + keep-alive strategy
