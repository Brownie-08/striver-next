import Link from "next/link";
import type { WordPressPost } from "@/lib/api";
import { PostCard } from "./post-card";

type LatestNewsSectionProps = {
  posts: WordPressPost[];
};

export function LatestNewsSection({ posts }: LatestNewsSectionProps) {
  return (
    <section id="latest-news" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 border-b border-border/70 pb-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-body uppercase tracking-[0.22em] text-primary">
            Latest news
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
            The biggest stories across the Striver network
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            This section now sits directly below the hero and ad break, with a
            dedicated 3-column layout and a clear visual reset before the
            category-led sections.
          </p>
        </div>
        <Link
          href="/latest-news"
          className="inline-flex rounded-full border border-border/80 px-4 py-2 text-sm font-body font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          View all latest news
        </Link>
      </div>

      {posts.length ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              categoryHref="/latest-news"
              isLocked
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-border/70 bg-card/55 p-6 text-sm text-muted">
          Latest News will appear here as soon as posts are available from
          WordPress.
        </div>
      )}
    </section>
  );
}
