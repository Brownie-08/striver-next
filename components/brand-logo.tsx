import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  compact?: boolean;
};

export function BrandLogo({
  className,
  compact = false,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-3 text-foreground hover:opacity-90",
        className,
      )}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-secondary/90 shadow-[0_8px_30px_rgba(60,117,106,0.18)]">
        <Image src="/striver-ball.svg" alt="" width={24} height={24} />
      </span>

      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-xl font-bold uppercase tracking-[0.26em]",
            compact && "text-base",
          )}
        >
          Striver
        </span>
        {!compact ? (
          <span className="font-body text-[10px] uppercase tracking-[0.22em] text-muted">
            Football stories that move
          </span>
        ) : null}
      </span>
    </Link>
  );
}
