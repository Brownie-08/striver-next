import type { Metadata } from "next";
import { AdSlot } from "@/components/ad-slot";
import { FootballCultureSection } from "@/components/football-culture-section";
import { GetAppSection } from "@/components/get-app-section";
import { HeroPost } from "@/components/hero-post";
import { LatestNewsSection } from "@/components/latest-news-section";
import { MentorsSection } from "@/components/mentors-section";
import { MobileAppBanner } from "@/components/mobile-app-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPosts } from "@/lib/api";
import { buildHomepageData } from "@/lib/homepage";
import { SITE_NAME, getSiteUrl } from "@/lib/site";
import { WomensFootballSection } from "@/components/womens-football-section";
import { YouthFootballSection } from "@/components/youth-football-section";

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPosts();
  const [heroPost] = posts;

  return {
    title: SITE_NAME,
    description:
      "Server-rendered Striver coverage powered by WordPress data through WPGraphQL.",
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      url: getSiteUrl(),
      siteName: SITE_NAME,
      title: SITE_NAME,
      description:
        heroPost?.excerpt ||
        "Server-rendered Striver coverage powered by WordPress data through WPGraphQL.",
      images: heroPost?.featuredImageUrl
        ? [
            {
              url: heroPost.featuredImageUrl,
              alt: heroPost.featuredImageAlt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: heroPost?.featuredImageUrl ? "summary_large_image" : "summary",
      title: SITE_NAME,
      description:
        heroPost?.excerpt ||
        "Server-rendered Striver coverage powered by WordPress data through WPGraphQL.",
      images: heroPost?.featuredImageUrl ? [heroPost.featuredImageUrl] : undefined,
    },
  };
}

export default async function HomePage() {
  const posts = await getPosts();
  const homepageData = buildHomepageData(posts);
  const appBannerHref = homepageData.appCtaPost
    ? `/posts/${homepageData.appCtaPost.slug}`
    : "/#featured-story";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div className="pt-16">
        {homepageData.featuredPost ? (
          <HeroPost post={homepageData.featuredPost} />
        ) : (
          <section className="border-b border-border/70 py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-[1.75rem] border border-border/70 bg-card/45 p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                  Latest stories
                </p>
                <h1 className="mt-4 font-display text-4xl font-bold text-foreground">
                  No posts are available yet.
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
                  The frontend is connected to WordPress and ready to render as
                  soon as content is published.
                </p>
              </div>
            </div>
          </section>
        )}

        <div className="border-b border-border/70 bg-nav-bg/55 py-6">
          <AdSlot size="billboard" />
        </div>

        <div className="bg-background/65">
          <LatestNewsSection posts={homepageData.latestPosts} />
        </div>

        <div className="border-y border-border/70 bg-primary/8">
          <MentorsSection
            post={homepageData.mentorsFeature}
            authors={homepageData.mentorAuthors}
          />
        </div>

        <div className="bg-background py-4">
          <AdSlot size="leaderboard" />
        </div>

        <div className="border-y border-border/70 bg-accent-purple/8">
          <YouthFootballSection posts={homepageData.youthPosts} />
        </div>

        <div className="border-y border-border/70 bg-secondary/12">
          <WomensFootballSection posts={homepageData.womensPosts} />
        </div>

        <div className="border-y border-border/70 bg-accent-orange/8">
          <FootballCultureSection posts={homepageData.culturePosts} />
        </div>

        <div className="border-t border-border/70 bg-nav-bg/30">
          <GetAppSection ctaPost={homepageData.appCtaPost} />
        </div>

        <SiteFooter />
      </div>
      <MobileAppBanner ctaHref={appBannerHref} />
    </div>
  );
}
