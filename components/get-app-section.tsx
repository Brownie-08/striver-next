import Link from "next/link";
import Image from "next/image";
import type { WordPressPost } from "@/lib/api";
import { BrandLogo } from "./brand-logo";

type GetAppSectionProps = {
  ctaPost: WordPressPost | null;
};

export function GetAppSection({ ctaPost }: GetAppSectionProps) {
  const ctaHref = ctaPost ? `/posts/${ctaPost.slug}` : "/#featured-story";

  return (
    <section id="get-the-app" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-card via-nav-bg to-background p-6 shadow-[0_28px_90px_rgba(3,5,6,0.38)] md:grid-cols-[minmax(0,1fr)_320px] md:p-10">
        <div className="max-w-2xl">
          <p className="text-[11px] font-body uppercase tracking-[0.22em] text-primary">
            Get the app
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
            Join football&apos;s next generation
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            The previous conversion block had the right intent, so this version
            brings it back in a lighter form: a clear CTA, an app-shaped
            preview, and a simple explanation of what unlocks inside Striver.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={ctaHref}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-body font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Download the app
            </Link>
            <Link
              href="/#mentors"
              className="rounded-full border border-border/80 px-5 py-2.5 text-sm font-body font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              See mentor previews
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-[250px] rounded-[2.25rem] border border-border/80 bg-background p-3 shadow-[0_22px_70px_rgba(3,5,6,0.42)]">
            <div className="rounded-[1.6rem] border border-border/70 bg-nav-bg p-4">
              <BrandLogo compact className="gap-2" />

              <div className="mt-5 overflow-hidden rounded-[1.25rem]">
                <Image
                  src="/favicon.ico"
                  alt=""
                  width={224}
                  height={144}
                  className="h-36 w-full bg-primary/10 object-contain p-6"
                />
              </div>

              <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
                  App gated
                </p>
                <p className="mt-2 font-display text-lg font-bold text-foreground">
                  Mentor videos, exclusive articles, and author-led
                  conversation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
