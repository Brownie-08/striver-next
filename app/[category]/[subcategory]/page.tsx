import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPosts } from "@/lib/api";
import { getPostsForSubcategory } from "@/lib/route-posts";
import {
  SITE_NAME,
  getCategoryRoute,
  getSiteUrl,
  getSubcategoryRoute,
  primaryNav,
} from "@/lib/site";

type SubcategoryPageProps = {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
};

export async function generateStaticParams() {
  return primaryNav.flatMap((categoryRoute) =>
    categoryRoute.dropdown
      .filter((item) => item.href.startsWith(`/${categoryRoute.slug}/`))
      .map((item) => ({
        category: categoryRoute.slug,
        subcategory: item.slug,
      })),
  );
}

export async function generateMetadata({
  params,
}: SubcategoryPageProps): Promise<Metadata> {
  const { category, subcategory } = await params;
  const categoryRoute = getCategoryRoute(category);
  const subcategoryRoute = getSubcategoryRoute(category, subcategory);

  if (!categoryRoute || !subcategoryRoute) {
    return { title: "Category page not found" };
  }

  const title = `${subcategoryRoute.label} | ${categoryRoute.label} | ${SITE_NAME}`;

  return {
    title,
    description: `${subcategoryRoute.label} coverage from ${SITE_NAME}.`,
    alternates: {
      canonical: `/${category}/${subcategory}`,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description: `${subcategoryRoute.label} coverage from ${SITE_NAME}.`,
      url: `${getSiteUrl()}/${category}/${subcategory}`,
    },
  };
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { category, subcategory } = await params;
  const categoryRoute = getCategoryRoute(category);
  const subcategoryRoute = getSubcategoryRoute(category, subcategory);

  if (!categoryRoute || !subcategoryRoute) {
    notFound();
  }

  const posts = await getPosts();
  const routePosts = getPostsForSubcategory(posts, categoryRoute, subcategoryRoute);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-border/70 bg-card/45 p-6 shadow-[0_24px_70px_rgba(3,5,6,0.28)] md:p-8">
          <Link
            href={categoryRoute.href}
            className="text-sm text-primary transition-colors hover:underline"
          >
            {categoryRoute.label}
          </Link>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            Subcategory
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-foreground md:text-5xl">
            {subcategoryRoute.label}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Filtered coverage for {subcategoryRoute.label} from the Striver
            WordPress feed.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {categoryRoute.dropdown.map((item) => {
              const active = item.slug === subcategoryRoute.slug;
              return (
                <Link
                  key={item.slug}
                  href={item.href}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    active
                      ? "border-primary/40 bg-primary/15 text-foreground"
                      : "border-border/80 text-muted hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </header>

        <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {routePosts.map((post) => (
            <PostCard key={post.id} post={post} isLocked />
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
