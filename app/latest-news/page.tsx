import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPosts } from "@/lib/api";
import { SITE_NAME, getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `Latest News | ${SITE_NAME}`,
  description: "The latest stories from the Striver WordPress feed.",
  alternates: {
    canonical: "/latest-news",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `Latest News | ${SITE_NAME}`,
    description: "The latest stories from the Striver WordPress feed.",
    url: `${getSiteUrl()}/latest-news`,
  },
};

export default async function LatestNewsPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-border/70 bg-card/45 p-6 shadow-[0_24px_70px_rgba(3,5,6,0.28)] md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            Latest news
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-foreground md:text-5xl">
            The biggest stories across the Striver network
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Full latest-news listing sourced from server-rendered WordPress
            content.
          </p>
        </header>

        <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.slice(0, 30).map((post) => (
            <PostCard key={post.id} post={post} isLocked />
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
