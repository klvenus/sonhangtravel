# Environment Variables Setup Guide

## Quick Setup

### Backend (.env)

1. Copy the example file:
```bash
cd backend
cp .env.example .env
```

2. Generate secure secrets:
```bash
# Generate APP_KEYS (4 keys separated by commas)
node -e "console.log([1,2,3,4].map(() => require('crypto').randomBytes(16).toString('base64')).join(','))"

# Generate other secrets
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

3. Configure Cloudinary:
   - Sign up at https://cloudinary.com
   - Get Cloud Name, API Key, and API Secret from Dashboard
   - Add to `.env`

4. For production, configure PostgreSQL:
   - Uncomment PostgreSQL settings
   - Add your database credentials

### Frontend (.env.local)

1. Copy the example file:
```bash
cd frontend
cp .env.example .env.local
```

2. Generate secure secrets:
```bash
# Generate PREVIEW_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Generate REVALIDATE_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

3. Configure URLs:
   - Development: `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337`
   - Production: Update with your deployed backend URL

4. Get Strapi API Token:
   - Start Strapi backend
   - Go to Settings > API Tokens
   - Create new token with "Full access"
   - Copy token to `STRAPI_API_TOKEN`

5. Google Search Console:
   - Add your site to Google Search Console
   - Get verification code
   - Add to `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`

## Required vs Optional Variables

### Backend - Required
- `APP_KEYS` - Session encryption (4 keys)
- `API_TOKEN_SALT` - API token encryption
- `ADMIN_JWT_SECRET` - Admin JWT signing
- `TRANSFER_TOKEN_SALT` - Transfer token encryption
- `JWT_SECRET` - General JWT signing

### Backend - Optional
- `CLOUDINARY_*` - If using Cloudinary for uploads
- `DATABASE_URL` - If using PostgreSQL

### Frontend - Required
- `NEXT_PUBLIC_STRAPI_URL` - Backend API URL
- `PREVIEW_SECRET` - For preview mode
- `REVALIDATE_SECRET` - For cache revalidation

### Frontend - Optional
- `STRAPI_API_TOKEN` - For authenticated API calls
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` - For Google Search Console
- `NEXT_PUBLIC_SITE_URL` - Your site URL

## Security Best Practices

1. ✅ **Never commit `.env` files** - Already in `.gitignore`
2. ✅ **Use strong random secrets** - Use crypto.randomBytes()
3. ✅ **Different secrets per environment** - Dev vs Production
4. ✅ **Rotate secrets regularly** - Especially after team changes
5. ✅ **Store production secrets securely** - Use Vercel/Render secrets

## Vercel Deployment

Add environment variables in Vercel Dashboard:
1. Go to Project Settings > Environment Variables
2. Add each variable from `.env.example`
3. Set appropriate scope (Production/Preview/Development)

## Render Deployment (Backend)

Add environment variables in Render Dashboard:
1. Go to your service > Environment
2. Add each variable from `.env.example`
3. Click "Save Changes"
