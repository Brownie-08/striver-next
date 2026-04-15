"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "./brand-logo";

type MobileAppBannerProps = {
  ctaHref: string;
};

export function MobileAppBanner({ ctaHref }: MobileAppBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  function dismissBanner() {
    setDismissed(true);
  }

  if (dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-nav-bg/95 px-4 py-3 md:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <BrandLogo compact className="gap-2" />
          <p className="mt-1 text-xs text-muted">
            Unlock mentor videos and gated articles in the app.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={ctaHref}
            className="rounded-full bg-primary px-4 py-1.5 text-xs font-body font-medium text-primary-foreground"
          >
            Open
          </Link>
          <button
            type="button"
            onClick={dismissBanner}
            aria-label="Dismiss app banner"
            className="text-muted transition-colors hover:text-foreground"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]">
              <path
                d="M6 6 18 18M18 6 6 18"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
