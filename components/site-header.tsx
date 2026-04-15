"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { primaryNav } from "@/lib/site";
import { BrandLogo } from "./brand-logo";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLightTheme, setIsLightTheme] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("light")
      : false,
  );
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  function openMenu(label: string) {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setOpenDropdown(label);
  }

  function closeMenuSoon() {
    closeTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 180);
  }

  function toggleTheme() {
    const root = document.documentElement;
    const nextIsLight = !root.classList.contains("light");
    root.classList.toggle("light", nextIsLight);
    localStorage.setItem("striver-theme", nextIsLight ? "light" : "dark");
    setIsLightTheme(nextIsLight);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-border/80 bg-nav-bg/95 shadow-[0_16px_48px_rgba(3,5,6,0.32)] backdrop-blur"
          : "bg-nav-bg/90 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandLogo />

        <nav className="hidden items-center gap-6 md:flex">
          {primaryNav.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => openMenu(item.label)}
              onMouseLeave={closeMenuSoon}
            >
              <Link
                href={item.href}
                prefetch
                className="flex items-center gap-1 text-sm font-body text-muted transition-colors hover:text-foreground"
              >
                {item.label}
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className={`h-3.5 w-3.5 transition-transform ${
                    openDropdown === item.label ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M3.5 6.25 8 10.75l4.5-4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </Link>

              {openDropdown === item.label ? (
                <div className="absolute left-0 top-full mt-3 min-w-[240px] overflow-hidden rounded-2xl border border-border/70 bg-nav-bg/95 p-2 shadow-[0_24px_70px_rgba(3,5,6,0.48)]">
                  <p className="px-3 pb-2 pt-1 text-[11px] font-body uppercase tracking-[0.18em] text-muted">
                    {item.description}
                  </p>
                  {item.dropdown.map((dropdownItem) => (
                    <Link
                      key={dropdownItem.label}
                      href={dropdownItem.href}
                      prefetch
                      className="block rounded-xl px-3 py-2.5 text-sm font-body text-muted transition-colors hover:bg-card hover:text-foreground"
                    >
                      {dropdownItem.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-border/70 text-muted transition-colors hover:text-foreground sm:inline-flex"
            aria-label="Toggle color theme"
          >
            {isLightTheme ? (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                <path
                  d="M20.4 14.7a8.4 8.4 0 1 1-11.1-11 7 7 0 1 0 11.1 11Z"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                <path
                  d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6M12 16.2A4.2 4.2 0 1 0 12 7.8a4.2 4.2 0 0 0 0 8.4Z"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            )}
          </button>
          <Link
            href="/#get-the-app"
            className="hidden rounded-full bg-primary px-4 py-2 text-sm font-body font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            Get the App
          </Link>
          <button
            type="button"
            className="text-foreground md:hidden"
            onClick={() => setIsMobileOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
                <path
                  d="M6 6 18 18M18 6 6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
                <path
                  d="M4 6.5h16M4 12h16M4 17.5h16"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isMobileOpen ? (
        <div className="border-t border-border/80 bg-nav-bg/98 px-4 pb-5 md:hidden">
          <div className="space-y-2 py-4">
            {primaryNav.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border/70 bg-card/35 px-4 py-3"
              >
                <Link
                  href={item.href}
                  prefetch
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-sm font-semibold text-foreground"
                >
                  {item.label}
                </Link>
                <p className="mt-1 text-xs leading-5 text-muted">{item.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.dropdown.map((dropdownItem) => (
                    <Link
                      key={dropdownItem.label}
                      href={dropdownItem.href}
                      prefetch
                      onClick={() => setIsMobileOpen(false)}
                      className="rounded-full border border-border/70 px-3 py-1.5 text-xs text-muted transition-colors hover:border-primary/50 hover:text-foreground"
                    >
                      {dropdownItem.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
