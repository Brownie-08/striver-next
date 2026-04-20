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
        "inline-flex flex-col items-start text-foreground hover:opacity-90",
        className,
      )}
    >
      <span
        className={cn(
          "relative h-5 w-[124px] shrink-0 sm:h-6 sm:w-[152px]",
          compact && "h-4 w-[100px] sm:h-5 sm:w-[124px]",
        )}
      >
        <Image
          src="/brand/striver-wordmark-light.svg"
          alt="Striver"
          fill
          sizes={compact ? "122px" : "148px"}
          className="brand-asset-light object-contain object-left"
        />
        <Image
          src="/brand/striver-wordmark-dark.svg"
          alt="Striver"
          fill
          sizes={compact ? "122px" : "148px"}
          className="brand-asset-dark object-contain object-left"
        />
      </span>
      {!compact ? (
        <span className="font-body text-[9px] uppercase tracking-[0.2em] text-muted">
          Football stories that move
        </span>
      ) : null}
    </Link>
  );
}
