"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type PostImageProps = {
  src?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

const FALLBACK_POST_IMAGE = "/images/hero-football.jpg";

function resolveImageSrc(src?: string | null) {
  if (!src?.trim()) {
    return FALLBACK_POST_IMAGE;
  }

  try {
    const parsed = new URL(src);
    if (parsed.protocol === "http:") {
      parsed.protocol = "https:";
    }
    return parsed.toString();
  } catch {
    return FALLBACK_POST_IMAGE;
  }
}

export function PostImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
}: PostImageProps) {
  const normalizedSrc = useMemo(() => resolveImageSrc(src), [src]);
  const [resolvedSrc, setResolvedSrc] = useState(normalizedSrc);
  const isRemoteImage =
    resolvedSrc.startsWith("https://") || resolvedSrc.startsWith("http://");

  useEffect(() => {
    setResolvedSrc(normalizedSrc);
  }, [normalizedSrc]);

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={isRemoteImage}
      className={cn("object-cover", className)}
      onError={() => {
        if (resolvedSrc !== FALLBACK_POST_IMAGE) {
          setResolvedSrc(FALLBACK_POST_IMAGE);
        }
      }}
    />
  );
}
