# Sơn Hằng Travel - AI Coding Agent Instructions

## Project Overview
Full-stack travel agency application for cross-border China tours. **Backend**: Strapi 5 headless CMS (TypeScript). **Frontend**: Next.js 16 with App Router, Server Components, and ISR (TypeScript + TailwindCSS 4).

## Architecture

### Backend (`/backend`) - Strapi 5.33.1
- **Database**: SQLite (dev), PostgreSQL (production) - see `config/database.ts`
- **Media**: Cloudinary via `@strapi/provider-upload-cloudinary` - configured in `config/plugins.ts`
- **Plugin**: `strapi-plugin-populate-deep` for nested population
- **Port**: 1337 (default)
- **Commands**: `npm run develop` (dev with auto-reload), `npm run start` (prod), `npm run build`

### Frontend (`/frontend`) - Next.js 16.1.1
- **Rendering**: Server Components (default) + ISR with 1-hour revalidation (`revalidate = 3600`)
- **ISR Pages**: Homepage (`/`), Tours listing (`/tours`), Tour detail (`/tour/[slug]`)
- **Styling**: TailwindCSS 4 via `@tailwindcss/postcss` - Use `bg-linear-*` instead of `bg-gradient-*`
- **Port**: 3000 (default)
- **API Client**: Custom wrapper in `src/lib/strapi.ts` with Next.js fetch cache
- **Commands**: `npm run dev`, `npm run build`, `npm run start`

### Data Flow
1. Server Components fetch on server → `lib/strapi.ts` → Strapi REST API
2. Transform raw Strapi data → Pass to Client Components for interactivity
3. Image URLs: Local dev (`http://localhost:1337/uploads/...`) or Cloudinary (production)
4. Preview mode: Draft tours accessible via `/api/preview?slug=...`

## Content Model

### Tour (`api::tour.tour`)
**Schema**: `backend/src/api/tour/content-types/tour/schema.json`

Key fields:
- **Basic**: `title`, `slug` (auto from title), `shortDescription`, `content` (richtext), `price`, `originalPrice`
- **Details**: `duration`, `departure`, `destination`, `transportation`, `groupSize`
- **Media**: `thumbnail` (single), `gallery` (multiple)
- **Components**: 
  - `itinerary[]` - repeatable (`tour.itinerary-item`: time, title, description, image)
  - `includes[]`, `excludes[]`, `notes[]` - repeatable (`tour.list-item`: text)
  - `departureDates[]` - repeatable (`tour.departure-date`: date, price, availableSlots, status)
- **Relations**: `category` (manyToOne)
- **Flags**: `featured` (boolean), `rating` (decimal 0-5), `reviewCount`, `bookingCount`

### Category (`api::category.category`)
**Schema**: `backend/src/api/category/content-types/category/schema.json`

Key fields:
- `ten` (Vietnamese name - IMPORTANT: use `ten` not `name` when querying)
- `slug`, `description`, `icon` (emoji string), `image`, `order`
- `tours[]` (oneToMany relation)

## Critical Conventions

### Strapi API Queries (Strapi 5 Syntax)
```typescript
// Correct deep population (used throughout codebase)
?populate[0]=thumbnail&populate[1]=gallery&populate[2]=category&populate[3]=itinerary.image

// Filtering
?filters[slug][$eq]=tour-slug&filters[featured][$eq]=true

// Sorting & pagination
?sort=bookingCount:desc&pagination[page]=1&pagination[pageSize]=10
```

### Frontend Data Transformation Pattern
All pages follow Server Component → Client Component pattern:
```typescript
// page.tsx - Server Component (ISR enabled)
export const revalidate = 3600  // 1 hour cache

export default async function Page() {
  const data = await getDataFromStrapi()
  const transformed = data.map(transformForClient)
  return <ClientComponent initialData={transformed} />
}

// ClientComponent.tsx - Client interactions
'use client'
export default function ClientComponent({ initialData }) {
  const [state, setState] = useState(initialData)
  // Handle user interactions, filters, etc.
}
```

Examples:
- `app/page.tsx` → Components (HeroSection, CategorySection, FeaturedTours)
- `app/tours/page.tsx` → `ToursPageClient.tsx`  
- `app/tour/[slug]/page.tsx` → `TourDetailClient.tsx`

### Image Handling
- **Helper**: `getImageUrl(image, size)` from `lib/strapi.ts`
- **Sizes**: `thumbnail`, `small`, `medium`, `large`
- **Next.js Config**: Remote patterns defined in `next.config.ts` for `localhost:1337`, `res.cloudinary.com`, `images.unsplash.com`
- Always use `Image` from `next/image` with `fill` or explicit dimensions

### Vietnamese Field Names
⚠️ **CRITICAL**: Category uses `ten` (not `name`) for Vietnamese compatibility. Transform to `name` in frontend:
```typescript
const categoryName = cat.ten || cat.name || 'Danh mục'
```

## Development Workflows

### Start Development
```bash
# Terminal 1 - Backend
cd backend && npm run develop  # http://localhost:1337/admin

# Terminal 2 - Frontend  
cd frontend && npm run dev     # http://localhost:3000
```

### Admin Setup (First Time)
1. Create admin user at `http://localhost:1337/admin`
2. **Settings → Roles → Public**: Enable `find` + `findOne` for `Tour` and `Category`
3. Create categories via Content Manager (see `HUONG_DAN_STRAPI.md` for examples)

### Creating New Tours
Follow checklist in `HUONG_DAN_STRAPI.md` (lines 118-157):
1. Use Content Manager → Tour Du Lịch → Create new entry
2. Slug auto-generates from title
3. Add itinerary items sequentially (time → title → description → image)
4. Always set featured flag for homepage display
5. Publish (not just Save) to make visible to public API

### API Testing
```bash
# Verify permissions working
curl http://localhost:1337/api/tours?populate=*

# Test specific tour
curl "http://localhost:1337/api/tours?filters[slug][\$eq]=tour-dong-hung-1-ngay&populate=*"
```

### Cache Revalidation
- **ISR**: Pages auto-refresh every 3600s (1 hour)
- **On-demand**: POST to `/api/revalidate?secret=...` (see `app/api/revalidate/route.ts`)
- **Preview**: Use `/api/preview?slug=...` for draft content

## Common Patterns

### Adding New Content Type
1. Create schema JSON in `backend/src/api/<name>/content-types/<name>/`
2. Restart Strapi to detect
3. Use default controller/service (factories pattern - see `tour/controllers/tour.ts`)
4. Add TypeScript interface in `frontend/src/lib/strapi.ts`
5. Create fetch function following `getTours()` pattern

### Mobile-First Responsive Design
- All components have mobile variants (see `TourCard`: `variant="horizontal"`)
- Bottom navigation: `<BottomNav />` component (mobile only)
- Breakpoints: Use Tailwind defaults (`sm:`, `md:`, `lg:`)

### Route Structure
- Tour detail: `/tour/[slug]` (NOT `/tours/[slug]` - note singular!)
- Tours listing: `/tours` (with client-side filtering)
- Static exports for deployments (if needed)

## Environment Variables

### Backend (`.env`)
```
DATABASE_CLIENT=sqlite / postgres
DATABASE_URL=...           # For PostgreSQL
CLOUDINARY_NAME=...
CLOUDINARY_KEY=...
CLOUDINARY_SECRET=...
APP_KEYS=[...]             # Auto-generated
```

### Frontend (`.env.local`)
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=...       # Optional for private content
REVALIDATE_SECRET=...      # For on-demand ISR
```

## Production Deployment

1. **Backend**:
   - Switch to PostgreSQL (`DATABASE_CLIENT=postgres` in `config/database.ts`)
   - Configure Cloudinary for media storage
   - Set `NODE_ENV=production`
   - Generate production `APP_KEYS`

2. **Frontend**:
   - Update `NEXT_PUBLIC_STRAPI_URL` to production Strapi URL
   - Set `STRAPI_API_TOKEN` if using private content
   - Ensure remote image patterns include production CDN

## Key Files Reference
- **API wrapper**: `frontend/src/lib/strapi.ts` (all Strapi fetch logic)
- **Content schemas**: `backend/src/api/*/content-types/*/schema.json`
- **Component schemas**: `backend/src/components/*/*.json`
- **Admin guide**: `HUONG_DAN_STRAPI.md` (Vietnamese instructions)
- **Type generation**: `backend/types/generated/` (auto-generated from schemas)

## Debugging Tips
- Check Strapi console for API errors (terminal running `npm run develop`)
- Use browser DevTools Network tab for API response inspection
- Verify permissions: Settings → Roles → Public (most common issue)
- Image 404s: Check `next.config.ts` remote patterns and Cloudinary config
- ISR not updating: Check `revalidate` value in page components or use on-demand revalidation
