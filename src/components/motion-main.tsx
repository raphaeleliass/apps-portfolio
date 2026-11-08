"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { usePathname } from "next/navigation";
import { type ComponentProps, useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export function MotionMain(props: ComponentProps<"main">) {
  const scope = useRef<HTMLElement>(null);
  const lastPath = useRef<string | null>(null);
  const pathname = usePathname();

  useGSAP(
    (context) => {
      const root = scope.current;
      if (!root) return;
      let active = true;
      let fontTimer = 0;
      const media = gsap.matchMedia();
      const start = context.add("start", () => {
        if (!active) return;
        const firstLoad = lastPath.current === null;
        const entrance =
          !firstLoad || document.documentElement.dataset.motion === "pending";
        lastPath.current = pathname;
        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.set(root, { autoAlpha: 1, clearProps: "transform,filter" });
          const progress = root
            .closest(".shell")
            ?.querySelector(".route-progress");
          if (progress)
            gsap.to(progress, {
              scaleX: 1,
              autoAlpha: 0,
              duration: 0.45,
              overwrite: true,
              clearProps: "all",
            });
          const visibleRows: Element[] = [];
          for (const row of root.querySelectorAll(".projects li")) {
            if (row.getBoundingClientRect().top < window.innerHeight) {
              visibleRows.push(row);
              continue;
            }
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: row,
                  start: "clamp(top 96%)",
                  end: "clamp(top 45%)",
                  scrub: 0.65,
                  once: true,
                },
              })
              .from(
                row.querySelector(".project-info"),
                {
                  y: 24,
                  opacity: 0.25,
                  clipPath: "inset(0 0 75% 0)",
                  duration: 1.2,
                  ease: "power1.out",
                  clearProps: "opacity,clipPath",
                },
                0,
              )
              .from(
                row.querySelector(".project-actions"),
                {
                  x: -16,
                  opacity: 0.15,
                  duration: 1,
                  ease: "power1.out",
                  clearProps: "transform,opacity",
                },
                0.22,
              );
          }
          if (entrance) {
            const title = root.querySelector("h1");
            const timeline = gsap.timeline({
              delay: 0.18,
              defaults: { ease: "power2.out" },
            });
            const header = root.closest(".shell")?.querySelector("header");
            if (firstLoad && header) {
              timeline.from(
                header.querySelectorAll(":scope > .brand, nav > *"),
                {
                  y: -14,
                  autoAlpha: 0,
                  duration: 1.3,
                  stagger: 0.14,
                  clearProps: "transform,opacity,visibility",
                },
                0,
              );
            }
            if (title) {
              const split = SplitText.create(title, {
                type: "words",
                mask: "words",
                wordsClass: "motion-word",
              });
              timeline.from(
                split.words,
                {
                  yPercent: 112,
                  rotation: 2,
                  transformOrigin: "0% 100%",
                  duration: 1.7,
                  stagger: 0.16,
                  onComplete: () => split.revert(),
                },
                0,
              );
            }
            const supporting = root.querySelectorAll(
              ".intro > p, .back, .detail-actions > a, .language, .status, .notice:not(:has(h1))",
            );
            if (supporting.length)
              timeline.from(
                supporting,
                {
                  y: 16,
                  autoAlpha: 0,
                  duration: 1.25,
                  stagger: 0.1,
                  clearProps: "transform,opacity,visibility",
                },
                0.48,
              );
            if (visibleRows.length) {
              timeline.from(
                visibleRows.map((row) => row.querySelector(".project-info")),
                {
                  y: 24,
                  opacity: 0,
                  clipPath: "inset(0 0 100% 0)",
                  duration: 1.5,
                  stagger: 0.18,
                  clearProps: "opacity,clipPath",
                },
                0.62,
              );
              timeline.from(
                visibleRows.map((row) => row.querySelector(".project-actions")),
                {
                  x: -14,
                  autoAlpha: 0,
                  duration: 1.3,
                  stagger: 0.18,
                  clearProps: "opacity,visibility",
                },
                0.92,
              );
            }
          }
          for (const heading of root.querySelectorAll(
            ".readme > h2, .markdown-body > h2, .markdown-body > h3, .markdown-body > pre, .markdown-body > p:has(img)",
          )) {
            if (heading.getBoundingClientRect().top < window.innerHeight)
              continue;
            const next = heading.nextElementSibling;
            const group = [heading];
            if (
              heading.matches("h2,h3") &&
              next?.matches("p:not(:has(img)), ul, ol")
            )
              group.push(next);
            const reveal = gsap.timeline({
              scrollTrigger: {
                trigger: heading,
                start: "clamp(top 95%)",
                end: "clamp(top 42%)",
                scrub: 0.65,
                once: true,
              },
            });
            reveal.from(
              group,
              {
                y: 20,
                opacity: 0.4,
                duration: 1.2,
                stagger: 0.18,
                ease: "none",
                clearProps: "transform,opacity",
              },
              0,
            );
            if (heading.matches("h2,h3,pre"))
              reveal.from(
                heading,
                {
                  clipPath: "inset(0 0 65% 0)",
                  duration: 1,
                  ease: "none",
                  clearProps: "clipPath",
                },
                0,
              );
            const image = heading.querySelector("img");
            if (image)
              reveal.from(
                image,
                {
                  scale: 0.98,
                  clipPath: "inset(4% 0 4% 0)",
                  duration: 1.4,
                  ease: "none",
                  clearProps: "transform,clipPath",
                },
                0,
              );
          }
          const footer = root.closest(".shell")?.querySelector("footer");
          if (
            footer &&
            footer.getBoundingClientRect().top >= window.innerHeight
          ) {
            gsap.from(footer.children, {
              y: 16,
              opacity: 0.3,
              duration: 1.2,
              stagger: 0.15,
              ease: "none",
              clearProps: "transform,opacity",
              scrollTrigger: {
                trigger: footer,
                start: "clamp(top 98%)",
                end: "max",
                scrub: 0.6,
                once: true,
              },
            });
          }
          const readingLine = root.querySelector(".reading-progress");
          if (readingLine)
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
                  scrub: 0.25,
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
          if (entrance) document.documentElement.dataset.motion = "ready";
          return () => {
            observer.disconnect();
            cancelAnimationFrame(refreshFrame);
          };
        });
        if (document.documentElement.dataset.motion === "pending") {
          delete document.documentElement.dataset.motion;
        }
      });
      Promise.race([
        document.fonts.ready,
        new Promise((resolve) => {
          fontTimer = window.setTimeout(resolve, 1400);
        }),
      ]).then(() => start());
      return () => {
        active = false;
        clearTimeout(fontTimer);
        media.revert();
      };
    },
    { scope, dependencies: [pathname], revertOnUpdate: true },
  );

  return <main {...props} ref={scope} />;
}
