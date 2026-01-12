"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  primary: string;
  secondary?: string | null;
  alt: string;
  sizes?: string;
  className?: string;
};

export function HoverSwapImage({ primary, secondary, alt, sizes, className }: Props) {
  const hasSecondary = Boolean(secondary);

  return (
    <div className={cn("group relative h-full w-full overflow-hidden", className)}>
      <Image
        src={primary}
        alt={alt}
        fill
        sizes={sizes}
        className={cn("object-cover transition-opacity duration-700", hasSecondary ? "opacity-100 group-hover:opacity-0" : "opacity-100")}
      />
      {hasSecondary && (
        <Image
          src={secondary as string}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        />
      )}
    </div>
  );
}
