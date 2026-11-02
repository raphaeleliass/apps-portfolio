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
            duration: 0.4,
            overwrite: true,
            clearProps: "all",
          });
        }
        gsap.set(root, { opacity: 1, clearProps: "transform,filter" });

        const readme = root.querySelector(".readme");
        if (readme) {
          const readmeIntro = readme.querySelectorAll(
            ":scope > h2, :scope > .readme-hint",
          );
          gsap.from(readmeIntro, {
            y: 20,
            opacity: 0,
            duration: 0.7,
            stagger: 0.06,
            ease: "expo.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: readme, start: "top 95%", once: true },
          });
          // Keep long documents readable; only section headings and code get scroll accents.
          for (const block of readme.querySelectorAll(
            ".markdown-body > h2, .markdown-body > h3, .markdown-body > pre",
          )) {
            gsap.from(block, {
              y: 16,
              opacity: 0.35,
              duration: 0.65,
              ease: "expo.out",
              clearProps: "transform,opacity",
              scrollTrigger: { trigger: block, start: "top 97%", once: true },
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
                  scrub: true,
                },
              },
            );
            let refreshFrame = 0;
            const observer = new ResizeObserver(() => {
              cancelAnimationFrame(refreshFrame);
              refreshFrame = requestAnimationFrame(() =>
                ScrollTrigger.refresh(),
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
