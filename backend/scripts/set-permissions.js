// Script để set permissions cho Public role
// Chạy: node scripts/set-permissions.js

const http = require('http');

const STRAPI_URL = 'http://localhost:1337';

// Bạn cần tạo API Token trong Strapi Admin:
// Settings > API Tokens > Create new API Token (Full access)
const API_TOKEN = process.env.STRAPI_ADMIN_TOKEN || '';

async function setPermissions() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  HƯỚNG DẪN CẤU HÌNH PERMISSIONS CHO STRAPI                 ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  1. Mở trình duyệt: http://localhost:1337/admin            ║
║                                                            ║
║  2. Đăng nhập với tài khoản admin                          ║
║                                                            ║
║  3. Click vào ⚙️ Settings (góc trái dưới)                  ║
║                                                            ║
║  4. Chọn "Roles" trong phần "Users & Permissions"          ║
║                                                            ║
║  5. Click vào "Public"                                     ║
║                                                            ║
║  6. Trong phần Permissions, tìm:                           ║
║     ┌─────────────────────────────────────────────┐        ║
║     │ Tour Du Lịch                                │        ║
║     │   ☑ find    (Lấy danh sách)                │        ║
║     │   ☑ findOne (Lấy chi tiết 1 tour)          │        ║
║     │                                             │        ║
║     │ Danh mục Tour                               │        ║
║     │   ☑ find    (Lấy danh sách)                │        ║
║     │   ☑ findOne (Lấy chi tiết 1 danh mục)      │        ║
║     └─────────────────────────────────────────────┘        ║
║                                                            ║
║  7. Click "Save" ở góc phải trên                           ║
║                                                            ║
║  8. Refresh trang web: http://localhost:3000               ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
}

setPermissions();
