"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ComponentProps, useRef } from "react";

gsap.registerPlugin(useGSAP);

export function MotionLink({
  href,
  prefetch = true,
  ...props
}: Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> & {
  href: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const router = useRouter();
  const { contextSafe } = useGSAP({ scope: ref });

  const navigate = contextSafe((event: { preventDefault: () => void }) => {
    const main = ref.current?.closest(".shell")?.querySelector("main");
    if (
      !main ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      new URL(href, location.href).href === location.href
    )
      return;
    event.preventDefault();
    const progress = ref.current
      ?.closest(".shell")
      ?.querySelector(".route-progress");
    if (progress) {
      gsap.fromTo(
        progress,
        { scaleX: 0, opacity: 1 },
        {
          scaleX: 0.9,
          duration: 8,
          ease: "power3.out",
          overwrite: true,
        },
      );
    }
    gsap.to(main, {
      y: href === "/" ? 10 : -10,
      opacity: 0.45,
      duration: 0.18,
      ease: "power2.in",
      overwrite: true,
      onComplete: () => router.push(href),
    });
  });

  return (
    <Link
      {...props}
      href={href}
      prefetch={prefetch}
      ref={ref}
      onNavigate={navigate}
    />
  );
}
