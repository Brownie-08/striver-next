import Link from "next/link";
import { footerColumns, socialLinks } from "@/lib/site";
import { BrandLogo } from "./brand-logo";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border/80 bg-nav-bg/92">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <BrandLogo compact className="items-start" />
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
              Fresh reporting, mentor guidance, and locked app-first content
              presented with a clearer hierarchy.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-foreground">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-6 sm:flex-row">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            Copyright 2026 Striver. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-card/35 text-foreground/75 transition-all hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary hover:text-primary-foreground"
              >
                {link.label === "X" ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                    <path d="M17.8 3H21l-7 8 8.2 10H16l-5-6.8L5 21H1.8l7.5-8.6L1.5 3H8l4.5 6zM15 18.5h1.8L7 5.4H5.1z" />
                  </svg>
                ) : null}
                {link.label === "Facebook" ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                    <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V5a22 22 0 0 0-2.5-.1c-2.5 0-4.1 1.5-4.1 4.3V11H7.5v3h2.6v8h3.4Z" />
                  </svg>
                ) : null}
                {link.label === "YouTube" ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                    <path d="M21.6 8.2a2.8 2.8 0 0 0-2-2C17.9 5.7 12 5.7 12 5.7s-5.9 0-7.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 3.8 2.8 2.8 0 0 0 2 2c1.7.5 7.6.5 7.6.5s5.9 0 7.6-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-3.8ZM10 15.2V8.8l5.2 3.2z" />
                  </svg>
                ) : null}
                {link.label === "Instagram" ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                    <path d="M16.5 2h-9A5.5 5.5 0 0 0 2 7.5v9A5.5 5.5 0 0 0 7.5 22h9a5.5 5.5 0 0 0 5.5-5.5v-9A5.5 5.5 0 0 0 16.5 2m-4.5 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10m6.2-.3a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0M12 9.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6" />
                  </svg>
                ) : null}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
