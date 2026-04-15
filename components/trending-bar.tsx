import Link from "next/link";
import type { WordPressPost } from "@/lib/api";
import { trendingTopics } from "@/lib/site";

type TrendingBarProps = {
  posts: WordPressPost[];
};

export function TrendingBar({ posts }: TrendingBarProps) {
  const postTopics = posts.slice(0, 5).map((post) => ({
    label: post.title,
    href: `/posts/${post.slug}`,
  }));
  const topics = [...trendingTopics, ...postTopics];
  return (
    <div className="overflow-x-auto border-b border-border/80 bg-nav-bg/85">
      <div className="mx-auto flex min-w-max max-w-7xl items-center gap-2 px-4 py-2.5 sm:px-6 lg:px-8">
        {topics.map((topic, index) => (
          <Link
            key={`${topic.href}-${index}`}
            href={topic.href}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-body font-medium whitespace-nowrap transition-all ${
              index === 0
                ? "bg-primary text-primary-foreground"
                : "border border-transparent text-muted hover:border-border/80 hover:text-foreground"
            }`}
          >
            {index === 0 ? (
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
                <path
                  d="M5.67 9.67A1.67 1.67 0 0 0 7.33 8c0-.92-.34-1.33-.67-2-.71-1.43-.15-2.7 1.34-4 .33 1.67 1.33 3.27 2.66 4.33 1.34 1.07 2 2.34 2 3.67a4.67 4.67 0 0 1-9.33 0c0-.77.29-1.53.67-2a1.67 1.67 0 0 0 1.67 1.67Z"
                  fill="currentColor"
                />
              </svg>
            ) : null}
            <span className={index === 0 ? "" : "max-w-[240px] truncate"}>
              {topic.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
