import Link from "next/link";
import type { WordPressPost } from "@/lib/api";
import { PostCard } from "./post-card";

type FootballCultureSectionProps = {
  posts: WordPressPost[];
};

export function FootballCultureSection({ posts }: FootballCultureSectionProps) {
  if (!posts.length) {
    return null;
  }

  return (
    <section id="football-culture" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 border-b border-border/70 pb-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-body uppercase tracking-[0.22em] text-accent-orange">
            Football culture
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
            Stories beyond the pitch still need a clear shelf
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Culture stories now sit on their own surface with the same hover
            feedback as the rest of the site, while keeping a distinct
            editorial tone.
          </p>
        </div>

        <Link
          href="/latest-news"
          className="inline-flex rounded-full border border-border/80 px-4 py-2 text-sm font-body font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          Browse culture stories
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            className="h-full"
            categoryLabel="Football culture"
            categoryHref="/latest-news"
            accentColorClassName="bg-accent-orange"
            isLocked
          />
        ))}
      </div>
    </section>
  );
}
