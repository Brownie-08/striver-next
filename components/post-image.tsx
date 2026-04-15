import Image from "next/image";
import { cn } from "@/lib/utils";

type PostImageProps = {
  src?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export function PostImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
}: PostImageProps) {
  return (
    <Image
      src={src || "/images/hero-football.jpg"}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
