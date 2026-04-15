import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPosts } from "@/lib/api";
import { SITE_NAME, getSiteUrl } from "@/lib/site";

type AuthorPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getAuthorPosts(slug: string) {
  const posts = await getPosts();
  return posts.filter((post) => post.authorSlug === slug);
}

export async function generateStaticParams() {
  const posts = await getPosts();
  const uniqueAuthorSlugs = Array.from(
    new Set(posts.map((post) => post.authorSlug)),
  );

  return uniqueAuthorSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const authorPosts = await getAuthorPosts(slug);
  const authorName = authorPosts[0]?.authorName;

  if (!authorName) {
    return {
      title: "Author not found",
    };
  }

  return {
    title: `${authorName} | ${SITE_NAME}`,
    description: `Read the latest stories from ${authorName} on ${SITE_NAME}.`,
    alternates: {
      canonical: `/authors/${slug}`,
    },
    openGraph: {
      type: "profile",
      url: `${getSiteUrl()}/authors/${slug}`,
      title: `${authorName} | ${SITE_NAME}`,
      description: `Read the latest stories from ${authorName} on ${SITE_NAME}.`,
    },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const authorPosts = await getAuthorPosts(slug);

  if (!authorPosts.length) {
    notFound();
  }

  const author = authorPosts[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex rounded-full border border-border/80 px-4 py-2 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary"
          >
            Back to homepage
          </Link>
        </div>

        <section className="rounded-[2rem] border border-border/70 bg-card/45 p-6 shadow-[0_24px_70px_rgba(3,5,6,0.32)] md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              {author.authorAvatarUrl ? (
                <Image
                  src={author.authorAvatarUrl}
                  alt={author.authorName}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] rounded-full border border-border/70 object-cover"
                />
              ) : (
                <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-border/70 bg-primary/20 font-display text-2xl font-bold text-primary">
                  {author.authorName
                    .split(" ")
                    .map((token) => token[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              )}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                  Author profile
                </p>
                <h1 className="mt-1 font-display text-4xl font-bold text-foreground md:text-5xl">
                  {author.authorName}
                </h1>
                <p className="mt-2 text-sm text-muted">
                  {authorPosts.length} published stories
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {authorPosts.map((post) => (
            <PostCard key={post.id} post={post} isLocked />
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
