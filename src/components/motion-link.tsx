"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { type ComponentProps, useRef } from "react";

gsap.registerPlugin(useGSAP);

export function MotionLink({
  href,
  prefetch = true,
  ...props
}: Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> & {
  href: string;
}) {
  const scope = useRef<HTMLAnchorElement>(null);
  const { contextSafe } = useGSAP({ scope });
  return (
    <Link
      {...props}
      href={href}
      prefetch={prefetch}
      ref={scope}
      onNavigate={contextSafe(() => {
        const main = scope.current?.closest(".shell")?.querySelector("main");
        if (
          !main ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
          new URL(href, location.href).href === location.href
        )
          return;
        // Navigation starts immediately; the outgoing page stays readable while loading.
        gsap.fromTo(
          main,
          { opacity: 1, y: 0 },
          {
            opacity: 0.65,
            y: -6,
            duration: 0.2,
            ease: "power2.out",
            overwrite: "auto",
            clearProps: "transform,opacity",
          },
        );
      })}
    />
  );
}
