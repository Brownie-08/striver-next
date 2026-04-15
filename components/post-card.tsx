import Link from "next/link";
import type { WordPressPost } from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";
import { PostImage } from "./post-image";

type PostCardProps = {
  post: WordPressPost;
  large?: boolean;
  className?: string;
  categoryLabel?: string;
  categoryHref?: string;
  accentColorClassName?: string;
  isLocked?: boolean;
  isVideo?: boolean;
};

export function PostCard({
  post,
  large = false,
  className,
  categoryLabel,
  categoryHref,
  accentColorClassName = "bg-primary",
  isLocked = false,
  isVideo = false,
}: PostCardProps) {
  const fallbackCategory = post.categories[0]?.name || "Latest news";
  const label = categoryLabel || fallbackCategory;
  const labelHref = categoryHref || "/latest-news";

  return (
    <article
      className={cn(
        "group rounded-2xl border border-border/70 bg-card/55 p-3 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/65 hover:shadow-[0_28px_80px_rgba(8,12,14,0.45)]",
        className,
      )}
    >
      <Link href={`/posts/${post.slug}`} className="block">
        <div
          className={cn(
            "relative aspect-video overflow-hidden rounded-[1.125rem]",
            large && "aspect-[16/10]",
          )}
        >
          <PostImage
            src={post.featuredImageUrl}
            alt={post.featuredImageAlt}
            sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw"
            className="transition-all duration-500 group-hover:scale-[1.08] group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-75 transition-opacity duration-300 group-hover:opacity-90" />
          {isLocked || isVideo ? (
            <div className="absolute left-3 top-3 flex items-center gap-2">
              {isLocked ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-nav-bg/80 px-2.5 py-1 text-[11px] font-body font-semibold uppercase tracking-[0.16em] text-foreground backdrop-blur">
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
              ) : null}
              {isVideo ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-secondary/40 bg-secondary/90 px-2.5 py-1 text-[11px] font-body font-semibold uppercase tracking-[0.16em] text-secondary-foreground">
                  <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3">
                    <path d="m6 4 6 4-6 4V4Z" fill="currentColor" />
                  </svg>
                  Video
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </Link>

      <div className="mt-4">
        <Link
          href={labelHref}
          className={cn(
            "inline-flex rounded-full px-2.5 py-1 text-[11px] font-body font-semibold uppercase tracking-[0.16em] text-foreground transition-opacity hover:opacity-90",
            accentColorClassName,
            accentColorClassName === "bg-secondary" && "text-secondary-foreground",
          )}
        >
          {label}
        </Link>

        <Link href={`/posts/${post.slug}`} className="block">
          <h3
            className={cn(
              "mt-3 font-display font-bold leading-tight text-foreground transition-colors group-hover:text-primary",
              large ? "text-2xl md:text-[2rem]" : "text-lg",
            )}
          >
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
            {post.excerpt}
          </p>
        </Link>

        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted">
          <Link
            href={`/authors/${post.authorSlug}`}
            className="font-medium text-primary hover:underline"
          >
            {post.authorName}
          </Link>
          <time dateTime={post.date ?? undefined}>{formatDate(post.date)}</time>
        </div>
      </div>
    </article>
  );
}
