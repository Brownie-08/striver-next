import Link from "next/link";
import type { WordPressPost } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { PostImage } from "./post-image";

type HeroPostProps = {
  post: WordPressPost;
};

export function HeroPost({ post }: HeroPostProps) {
  return (
    <section
      id="featured-story"
      className="relative overflow-hidden border-b border-border/70"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/35 to-transparent" />

      <div className="relative h-[540px] md:h-[640px]">
        <PostImage
          src={post.featuredImageUrl}
          alt={post.featuredImageAlt}
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 mx-auto grid max-w-7xl gap-8 px-4 pb-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:pb-12">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/#latest-news"
              className="inline-flex rounded-full bg-accent-purple px-3 py-1 text-xs font-body font-semibold uppercase tracking-[0.18em] text-foreground"
            >
              Featured story
            </Link>
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-nav-bg/75 px-3 py-1 text-[11px] font-body font-semibold uppercase tracking-[0.18em] text-foreground backdrop-blur">
              <svg
                viewBox="0 0 16 16"
                aria-hidden="true"
                className="h-3 w-3 text-primary"
              >
                <path
                  d="M5.67 9.67A1.67 1.67 0 0 0 7.33 8c0-.92-.34-1.33-.67-2-.71-1.43-.15-2.7 1.34-4 .33 1.67 1.33 3.27 2.66 4.33 1.34 1.07 2 2.34 2 3.67a4.67 4.67 0 0 1-9.33 0c0-.77.29-1.53.67-2a1.67 1.67 0 0 0 1.67 1.67Z"
                  fill="currentColor"
                />
              </svg>
              App gated
            </span>
          </div>

          <Link href={`/posts/${post.slug}`} className="block">
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.02] text-foreground transition-colors hover:text-primary md:text-6xl">
              {post.title}
            </h1>
          </Link>

          <p className="mt-4 max-w-2xl text-base leading-7 text-muted md:text-lg">
            {post.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
            <Link
              href={`/authors/${post.authorSlug}`}
              className="font-medium text-primary hover:underline"
            >
              By {post.authorName}
            </Link>
            <span>{formatDate(post.date)}</span>
          </div>
        </div>

        <div className="hidden rounded-[1.75rem] border border-border/70 bg-nav-bg/78 p-6 shadow-[0_24px_80px_rgba(3,5,6,0.4)] backdrop-blur lg:block">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
            Featured story
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-foreground">
            Unlock the full article and join the conversation in the Striver
            app.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Every article and mentor video can route through the app gate, so
            premium content stays consistent across text and video.
          </p>
          <Link
            href={`/posts/${post.slug}`}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-body font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Open preview
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
              <path
                d="M3.5 8h9M8.5 3l4.5 5-4.5 5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
