import Image from "next/image";
import Link from "next/link";

/**
 * Official Shield Nirun logo (public/images/logo.png — cropped from logo-original.png).
 * The wordmark is part of the image, so no extra text is rendered next to it.
 */
export function Logo({ className = "h-10", href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className="flex shrink-0 items-center" aria-label={href.startsWith("/en") ? "Shield Nirun — home" : "Shield Nirun — нүүр хуудас"}>
      <Image src="/images/logo.png" alt="Shield Nirun" width={489} height={240} priority className={`${className} w-auto`} />
    </Link>
  );
}
