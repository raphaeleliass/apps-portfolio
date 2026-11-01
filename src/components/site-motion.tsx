"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type ReactNode, useRef } from "react";

gsap.registerPlugin(useGSAP);

export function SiteMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("header > .brand, header nav > *", {
          y: -12,
          opacity: 0,
          duration: 0.75,
          stagger: 0.06,
          ease: "expo.out",
          clearProps: "transform,opacity",
        });
        gsap.from("footer", {
          opacity: 0,
          duration: 0.8,
          delay: 0.35,
          clearProps: "opacity",
        });
      });
      return () => media.revert();
    },
    { scope },
  );

  return (
    <div className="shell" ref={scope}>
      <div className="route-progress" aria-hidden="true" />
      {children}
    </div>
  );
}
