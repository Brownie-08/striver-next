import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostImage } from "@/components/post-image";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPostBySlug, getPostSlugs } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { SITE_NAME, getSiteUrl } from "@/lib/site";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getPostSlugs(24);

  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/posts/${post.slug}`,
    },
    openGraph: {
      type: "article",
      url: `${getSiteUrl()}/posts/${post.slug}`,
      siteName: SITE_NAME,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date ?? undefined,
      authors: [post.authorName],
      images: post.featuredImageUrl
        ? [
            {
              url: post.featuredImageUrl,
              alt: post.featuredImageAlt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: post.featuredImageUrl ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
      images: post.featuredImageUrl ? [post.featuredImageUrl] : undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    image: post.featuredImageUrl ? [post.featuredImageUrl] : undefined,
    mainEntityOfPage: `${getSiteUrl()}/posts/${post.slug}`,
  }).replace(/</g, "\\u003c");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleJsonLd }}
      />

      <main className="mx-auto max-w-5xl px-4 py-28 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex rounded-full border border-border/80 px-4 py-2 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary"
          >
            Back to homepage
          </Link>
        </div>

        <article className="rounded-[2rem] border border-border/70 bg-card/35 p-6 shadow-[0_28px_90px_rgba(3,5,6,0.42)] md:p-8">
          <header className="mb-8 border-b border-border/80 pb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              WordPress article
            </p>
            <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold leading-[1.04] text-foreground md:text-6xl">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/authors/${post.authorSlug}`}
                  className="rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  {post.authorName}
                </Link>
                <span className="rounded-full border border-primary/35 bg-nav-bg/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                  App gate available
                </span>
                <time dateTime={post.date ?? undefined}>
                  {formatDate(post.date)}
                </time>
              </div>
              <span className="text-xs uppercase tracking-[0.16em]">
                Server rendered
              </span>
            </div>
          </header>

          <div className="relative mb-10 overflow-hidden rounded-[1.75rem] border border-border/70">
            <div className="relative aspect-[16/9]">
              <PostImage
                src={post.featuredImageUrl}
                alt={post.featuredImageAlt}
                sizes="(min-width: 1280px) 1120px, 100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/15 to-transparent" />
            </div>
          </div>

          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
