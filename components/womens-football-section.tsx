import Link from "next/link";
import type { WordPressPost } from "@/lib/api";
import { PostCard } from "./post-card";

type WomensFootballSectionProps = {
  posts: WordPressPost[];
};

export function WomensFootballSection({ posts }: WomensFootballSectionProps) {
  if (!posts.length) {
    return null;
  }

  return (
    <section id="womens-football" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 border-b border-border/70 pb-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-body uppercase tracking-[0.22em] text-secondary">
            Women&apos;s football
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
            Reporting with a distinct lane, not a duplicate layout
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            This section uses a lighter accent treatment and its own
            introduction so it no longer reads like a copy of the youth block
            above it.
          </p>
        </div>

        <Link
          href="/womens-football"
          className="inline-flex rounded-full border border-border/80 px-4 py-2 text-sm font-body font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          View all women&apos;s football
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            categoryLabel="Women's football"
            categoryHref="/womens-football"
            accentColorClassName="bg-secondary"
            isLocked
          />
        ))}
      </div>
    </section>
  );
}
