# Striver Next.js Frontend

Striver is now rebuilt as a Next.js App Router frontend backed by WordPress through WPGraphQL.

## Stack

- Next.js 16.2.3
- React 19
- TypeScript
- Tailwind CSS
- WordPress headless CMS
- WPGraphQL endpoint: `https://www.striver.football/graphql`

## Project Structure

- `app/` App Router pages and route handlers
- `components/` reusable UI adapted from the original Vite design
- `lib/api.ts` shared WordPress GraphQL fetch layer with ISR (`revalidate: 60`)
- `public/images/` migrated reference assets and fallback imagery

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Content Flow

- Homepage: fetches recent posts on the server and renders a featured hero plus post grids.
- Post route: `/posts/[slug]` fetches the full WordPress post by slug and renders HTML content with `dangerouslySetInnerHTML`.
- Core content uses server components and does not rely on client-side fetching for the initial load.
