#!/usr/bin/env node

/**
 * Generate random secrets for Railway deployment
 * Usage: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('base64');
}

console.log('🔐 Railway Environment Variables - Copy these to Railway Dashboard:\n');
console.log('='.repeat(80));
console.log('\n# App Secrets (paste vào Railway Variables tab)\n');

console.log(`ADMIN_JWT_SECRET=${generateSecret(32)}`);
console.log(`API_TOKEN_SALT=${generateSecret(32)}`);
console.log(`APP_KEYS=${generateSecret(64)}`);
console.log(`JWT_SECRET=${generateSecret(32)}`);
console.log(`TRANSFER_TOKEN_SALT=${generateSecret(32)}`);

console.log('\n' + '='.repeat(80));
console.log('\n✅ Copy các dòng trên vào Railway → Variables tab');
console.log('⚠️  LƯU Ý: Mỗi lần chạy script sẽ tạo secrets MỚI - chỉ run 1 lần!\n');
