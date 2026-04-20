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
        "inline-flex items-center gap-2.5 text-foreground hover:opacity-90",
        className,
      )}
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/70 shadow-[0_8px_30px_rgba(60,117,106,0.18)]">
        <Image
          src="/brand/striver-square-light.svg"
          alt=""
          fill
          sizes="40px"
          className="brand-asset-light object-cover"
        />
        <Image
          src="/brand/striver-square-dark.svg"
          alt=""
          fill
          sizes="40px"
          className="brand-asset-dark object-cover"
        />
      </span>
      <span
        className={cn(
          "relative h-5 w-[122px] shrink-0 sm:h-6 sm:w-[148px]",
          compact && "h-4 w-[98px] sm:h-5 sm:w-[122px]",
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
    </Link>
  );
}
