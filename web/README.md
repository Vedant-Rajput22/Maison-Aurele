# Maison Aurèle

A luxury fashion e-commerce platform built with Next.js 16, featuring bilingual support (EN/FR), editorial-first design, and a premium shopping experience.

## What's This About

This is the digital presence for Maison Aurèle, a fictional Parisian haute couture house. The site blends editorial storytelling with commerce — think Dior meets 1stDibs. Everything from product pages to the journal emphasizes cinematic visuals and smooth interactions.

## Tech Stack

- **Next.js 16** with App Router and Turbopack
- **TypeScript** throughout
- **Prisma** + PostgreSQL for data
- **Tailwind CSS** for styles
- **Framer Motion** + **Lenis** for animations
- **Cloudinary** for image hosting
- **Stripe** for payments
- **NextAuth.js** for authentication

## Performance & Architecture

Built for speed and scale:
- **Edge Caching**: Aggressive use of `unstable_cache` for CMS blocks and navigation ensures sub-millisecond data access.
- **Image Optimization**: Automatic WebP/AVIF serving and responsive sizing via Cloudinary.
- **Partial Prerendering**: Static shells with dynamic holes for user-specific data (cart, wishlist).
- **Database Pooling**: Optimized connection management via Neon for serverless environments.

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (I use Neon, but any Postgres works)
- Cloudinary account for images
- Stripe account for payments

### Setup

1. Clone the repo and install dependencies:
```bash
cd web
npm install
```

2. Copy the environment template and fill in your values:
```bash
cp .env.example .env
```

3. Push the database schema and seed:
```bash
npx prisma db push
npx prisma db seed
npx tsx prisma/scripts/seed-homepage-modules.ts
```

4. Start the dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you should see the homepage.

### Clearing Cache

If things look stale after changes:
```powershell
Remove-Item -Recurse -Force .next; npm run dev
```

## Project Structure

```
web/
├── prisma/
│   ├── schema.prisma      # Database models
│   ├── seed.ts            # Main seeder
│   ├── seed-data/         # Product/collection/editorial data
│   └── scripts/           # One-off DB scripts
├── public/
│   └── assets/media/      # Videos and images
├── src/
│   ├── app/
│   │   ├── [locale]/      # All public pages (EN/FR)
│   │   ├── admin/         # Admin dashboard
│   │   └── api/           # API routes
│   ├── components/
│   │   ├── admin/         # Admin UI components
│   │   ├── boutique/      # Boutique page sections
│   │   ├── collections/   # Collection components
│   │   ├── journal/       # Editorial/journal
│   │   ├── motion/        # Animation wrappers
│   │   ├── products/      # PDP components
│   │   ├── sections/      # Homepage modules
│   │   └── shop/          # Shop listing + filters
│   └── lib/
│       ├── auth/          # NextAuth config
│       ├── cart/          # Cart actions
│       ├── data/          # Data fetching
│       └── i18n/          # Internationalization
```

## Key Features

### Pages

- **Homepage** — Cinematic hero with video, gallery scroll, editorial teasers
- **Shop** — Product grid with category navigation and filters
- **Collections** — Each collection has its own video hero and lookbook
- **Journal** — Editorial posts with rich media blocks
- **Boutique** — Store information with gallery and services
- **Maison** — Brand story and heritage

### Commerce

- Cart with persistent state (cookie-based for guests, DB for logged-in)
- Wishlist functionality
- Stripe checkout integration
- Order management in admin

### Admin Panel

Located at `/admin` — full CRUD for:
- Products and variants
- Collections and lookbook slides
- Editorial posts
- Orders and customers
- Promotions and limited drops

## Environment Variables

Key ones you'll need:

```env
DATABASE_URL=            # Postgres connection string
NEXTAUTH_SECRET=         # Random secret for auth
NEXTAUTH_URL=            # Your site URL

CLOUDINARY_CLOUD_NAME=   # Cloudinary config
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

STRIPE_SECRET_KEY=       # Stripe keys
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

Check `.env.example` for the full list.

## Adding Content

### Products

Edit files in `prisma/seed-data/` and re-run:
```bash
npx prisma db seed
```

### Collection Videos

Drop your videos in `public/assets/media/` with names like:
- `Nuit-Parisienne.mp4`
- `Côte-d'Azur.mp4`
- etc.

The mapping is in `src/components/collections/collection-video-hero.tsx`.

### Homepage Modules

```bash
npx tsx prisma/scripts/seed-homepage-modules.ts
```

## Deployment

Built for Vercel. Just connect the repo and it should work. Make sure your env vars are set in the Vercel dashboard.

For other platforms, run:
```bash
npm run build
npm start
```

## Notes

- The site defaults to French (`/fr`) on the homepage
- All routes are locale-prefixed (`/en/shop`, `/fr/boutique`)
- Images use Unsplash URLs in seed data — swap these for your own in production
- The admin panel has no auth by default — add protection before deploying

---

Built by me. Questions? You know where to find me.
