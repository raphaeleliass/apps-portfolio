"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { type ComponentProps, useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function MotionMain(props: ComponentProps<"main">) {
  const scope = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const progress = root
          .closest(".shell")
          ?.querySelector(".route-progress");
        if (progress) {
          gsap.to(progress, {
            scaleX: 1,
            opacity: 0,
            duration: 0.3,
            overwrite: true,
            clearProps: "all",
          });
        }
        gsap.set(root, { opacity: 1, clearProps: "transform,filter" });

        const readme = root.querySelector(".readme");
        if (readme) {
          // Leave already visible content untouched, including restored scroll positions.
          for (const block of readme.querySelectorAll(
            ":scope > h2, :scope > .readme-hint, .markdown-body > h2, .markdown-body > h3, .markdown-body > pre",
          )) {
            if (block.getBoundingClientRect().top < window.innerHeight)
              continue;
            gsap.from(block, {
              y: 8,
              opacity: 0.7,
              duration: 0.55,
              ease: "power3.out",
              clearProps: "transform,opacity",
              scrollTrigger: {
                trigger: block,
                start: "clamp(top 92%)",
                end: "clamp(top 70%)",
                once: true,
                fastScrollEnd: 1800,
              },
            });
          }
          const readingLine = root.querySelector(".reading-progress");
          if (readingLine) {
            gsap.fromTo(
              readingLine,
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                  start: 0,
                  end: "max",
                  invalidateOnRefresh: true,
                  scrub: 0.16,
                },
              },
            );
            let refreshFrame = 0;
            const observer = new ResizeObserver(() => {
              cancelAnimationFrame(refreshFrame);
              refreshFrame = requestAnimationFrame(() =>
                ScrollTrigger.refresh(true),
              );
            });
            observer.observe(root.closest(".shell") ?? root);
            return () => {
              observer.disconnect();
              cancelAnimationFrame(refreshFrame);
            };
          }
        }
      });
      return () => media.revert();
    },
    { scope, dependencies: [pathname], revertOnUpdate: true },
  );

  return <main {...props} ref={scope} />;
}
