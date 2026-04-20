# Striver Next.js Frontend

Striver is now rebuilt as a Next.js App Router frontend backed by WordPress via a resilient GraphQL + REST integration.

## Stack

- Next.js 16.2.3
- React 19
- TypeScript
- Tailwind CSS
- WordPress headless CMS
- WordPress API mode: GraphQL primary, REST fallback

## Project Structure

- `app/` App Router pages and route handlers
- `components/` reusable UI adapted from the original Vite design
- `lib/api.ts` shared WordPress data fetch layer with ISR (`revalidate: 60`)
- `public/images/` migrated reference assets and fallback imagery

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Environment Variables

Set backend URLs explicitly so DNS changes on the frontend domain do not break CMS fetches:

```bash
WORDPRESS_BACKEND_URL=https://your-wordpress-host.example
WORDPRESS_GRAPHQL_URL=https://your-wordpress-host.example/graphql
WORDPRESS_REST_API_URL=https://your-wordpress-host.example/wp-json/wp/v2
NEXT_PUBLIC_SITE_URL=https://your-frontend-domain.example
```

## Content Flow

- Homepage: fetches recent posts on the server and renders a featured hero plus post grids.
- Post route: `/posts/[slug]` fetches the full WordPress post by slug and renders HTML content with `dangerouslySetInnerHTML`.
- Core content uses server components and does not rely on client-side fetching for the initial load.
