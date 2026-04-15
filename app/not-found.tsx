import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] border border-border/70 bg-card/45 p-8 shadow-[0_24px_70px_rgba(3,5,6,0.38)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            404
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold text-foreground">
            That post could not be found.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            The slug does not exist in the WordPress backend or is no longer
            published.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:-translate-y-0.5"
          >
            Back to homepage
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
