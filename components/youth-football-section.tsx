import Link from "next/link";
import type { WordPressPost } from "@/lib/api";
import { PostCard } from "./post-card";

type YouthFootballSectionProps = {
  posts: WordPressPost[];
};

const youthTopics = ["The Path", "Next Up", "Grassroots", "Academy", "U18 Competitions"];

export function YouthFootballSection({ posts }: YouthFootballSectionProps) {
  const [featured, ...morePosts] = posts;

  if (!featured) {
    return null;
  }

  return (
    <section id="youth-football" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-body uppercase tracking-[0.22em] text-accent-purple">
            Youth football
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
            Where the next generation gets shaped
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            The youth dropdown now maps directly to live category routes, and
            the subtopics below make those pages visible instead of hiding them
            inside a single nav hover state.
          </p>
        </div>

        <Link
          href="/youth-football"
          className="inline-flex rounded-full border border-border/80 px-4 py-2 text-sm font-body font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          View all youth coverage
        </Link>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {youthTopics.map((topic) => (
          <Link
            key={topic}
            href={`/youth-football/${topic.toLowerCase().replace(/\s+/g, "-")}`}
            className="rounded-full border border-border/80 px-3 py-1.5 text-xs font-body text-muted transition-colors hover:border-accent-purple hover:text-foreground"
          >
            {topic}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PostCard
            post={featured}
            large
            categoryLabel="Youth football"
            categoryHref="/youth-football"
            accentColorClassName="bg-accent-purple"
            isLocked
          />
        </div>
        <div className="grid gap-6">
          {morePosts.slice(0, 2).map((post) => (
            <PostCard
              key={post.id}
              post={post}
              categoryLabel="Youth football"
              categoryHref="/youth-football"
              accentColorClassName="bg-accent-purple"
              isLocked
            />
          ))}
        </div>
      </div>
    </section>
  );
}
