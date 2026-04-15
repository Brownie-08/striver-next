import Link from "next/link";
import Image from "next/image";
import type { WordPressPost } from "@/lib/api";
import type { MentorAuthor } from "@/lib/homepage";

type MentorsSectionProps = {
  post: WordPressPost | null;
  authors: MentorAuthor[];
};

export function MentorsSection({ post, authors }: MentorsSectionProps) {
  if (!post) {
    return null;
  }

  return (
    <section id="mentors" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-body uppercase tracking-[0.22em] text-primary">
            From the mentors
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
            Exclusive guidance is higher in the page flow now
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            The featured video now carries an explicit app-gate badge, play
            button, and the &quot;Join the Conversation on Striver&quot; overlay so
            the locked state is obvious at a glance.
          </p>
        </div>
        <Link
          href="/mentors"
          className="inline-flex rounded-full border border-border/80 px-4 py-2 text-sm font-body font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          Explore mentor content
        </Link>
      </div>

      <Link
        href={`/posts/${post.slug}`}
        className="group relative mb-8 block overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-[0_28px_90px_rgba(3,5,6,0.42)] transition-transform duration-300 hover:-translate-y-1"
      >
        <div className="absolute left-5 top-5 z-20 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-nav-bg/80 px-3 py-1.5 text-[11px] font-body font-semibold uppercase tracking-[0.18em] text-foreground backdrop-blur">
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
            App gate
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-secondary/40 bg-secondary/90 px-3 py-1.5 text-[11px] font-body font-semibold uppercase tracking-[0.18em] text-secondary-foreground">
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3">
              <path d="m6 4 6 4-6 4V4Z" fill="currentColor" />
            </svg>
            Video
          </span>
        </div>

        <div className="relative h-[520px] w-full">
          <Image
            src={post.featuredImageUrl || "/images/mentor-video.jpg"}
            alt={post.featuredImageAlt}
            fill
            sizes="(min-width: 1024px) 1120px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="rounded-full border border-primary/30 bg-primary/90 p-5 text-primary-foreground shadow-[0_18px_50px_rgba(60,117,106,0.4)]">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-8 w-8">
              <path d="M8 6.5 18 12 8 17.5v-11Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_340px] md:p-8">
          <div>
            <p className="text-[11px] font-body uppercase tracking-[0.22em] text-primary">
              Join the Conversation on Striver
            </p>
            <h3 className="mt-3 max-w-3xl font-display text-2xl font-bold leading-tight text-foreground md:text-4xl">
              {post.title}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              {post.excerpt}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-border/70 bg-nav-bg/82 p-5 backdrop-blur">
            <p className="text-sm leading-6 text-muted">
              This mentor video is locked to the app experience. Use the preview
              to tee up the story, then move the conversation into Striver.
            </p>
            <span className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-body font-medium text-primary-foreground">
              Watch in app
            </span>
          </div>
        </div>
      </Link>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {authors.map((author) => (
          <Link
            key={author.slug}
            href={`/authors/${author.slug}`}
            className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card/65 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_18px_50px_rgba(3,5,6,0.32)]"
          >
            {author.avatarUrl ? (
              <Image
                src={author.avatarUrl}
                alt={author.name}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 font-display text-lg font-bold text-primary">
                {author.name
                  .split(" ")
                  .map((token) => token[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            )}
            <div>
              <p className="font-display text-lg font-bold text-foreground">
                {author.name}
              </p>
              <p className="text-sm text-muted">{author.focus}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
