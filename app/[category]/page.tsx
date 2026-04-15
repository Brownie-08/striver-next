import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPosts } from "@/lib/api";
import { getPostsForCategory } from "@/lib/route-posts";
import { SITE_NAME, getCategoryRoute, getSiteUrl, primaryNav } from "@/lib/site";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateStaticParams() {
  return primaryNav.map((item) => ({ category: item.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryRoute = getCategoryRoute(category);

  if (!categoryRoute) {
    return { title: "Category not found" };
  }

  return {
    title: `${categoryRoute.label} | ${SITE_NAME}`,
    description: categoryRoute.description,
    alternates: {
      canonical: `/${categoryRoute.slug}`,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: `${categoryRoute.label} | ${SITE_NAME}`,
      description: categoryRoute.description,
      url: `${getSiteUrl()}/${categoryRoute.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryRoute = getCategoryRoute(category);

  if (!categoryRoute) {
    notFound();
  }

  const posts = await getPosts();
  const categoryPosts = getPostsForCategory(posts, categoryRoute);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-border/70 bg-card/45 p-6 shadow-[0_24px_70px_rgba(3,5,6,0.28)] md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            Category
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-foreground md:text-5xl">
            {categoryRoute.label}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            {categoryRoute.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {categoryRoute.dropdown.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className="rounded-full border border-border/80 px-3 py-1.5 text-xs text-muted transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </header>

        <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categoryPosts.map((post) => (
            <PostCard key={post.id} post={post} isLocked />
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
