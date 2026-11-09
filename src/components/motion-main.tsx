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
  const pathname = usePathname();

  useGSAP(
    (_context, contextSafe) => {
      const root = scope.current;
      if (!root || !contextSafe) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const blocks = root.matches(".notice")
          ? [root]
          : Array.from(
              root.querySelectorAll<HTMLElement>(
                ".intro, .back, .detail-actions, .language, .status, .notice, .projects > li, .readme > h2, .readme-hint, .markdown-body > *",
              ),
            );
        let entranceIndex = 0;
        const reveals = new Map<Element, gsap.core.Timeline>();
        for (const block of blocks) {
          const bounds = block.getBoundingClientRect();
          // Restored scroll positions must not conceal content already passed.
          if (bounds.bottom <= 0) continue;
          const inView = bounds.top < window.innerHeight * 0.92;
          const timeline = gsap.timeline({
            delay: inView ? Math.min(entranceIndex++ * 0.07, 0.28) : 0,
            defaults: { duration: 0.72, ease: "power3.out" },
            scrollTrigger: inView
              ? undefined
              : {
                  trigger: block,
                  start: "clamp(top 92%)",
                  once: true,
                },
          });
          reveals.set(block, timeline);
          const grouped = block.matches(
            ".intro,.detail-actions,.notice,li,ul,ol,blockquote",
          );
          timeline.from(
            block,
            {
              opacity: 0,
              scale: block.matches(".back,.language,.readme-hint") ? 1 : 0.97,
              y: grouped ? 0 : 18,
              transformOrigin: "50% 0%",
              clearProps: "transform,transformOrigin,opacity,visibility",
            },
            0,
          );
          if (grouped) {
            const children = block.matches(".projects > li")
              ? block.querySelectorAll(
                  ".project-info > *, .project-actions > *",
                )
              : block.children;
            timeline.from(
              children,
              {
                y: 22,
                opacity: 0,
                stagger: {
                  amount: Math.min(
                    Math.max(children.length - 1, 0) * 0.075,
                    0.24,
                  ),
                },
                clearProps: "transform,opacity,visibility",
              },
              0.06,
            );
          }
          const title = block.querySelector("h1");
          if (title) {
            SplitText.create(title, {
              type: "words",
              mask: "words",
              autoSplit: true,
              onSplit: (split) =>
                gsap.from(split.words, {
                  yPercent: 105,
                  rotation: 1.5,
                  transformOrigin: "0% 100%",
                  duration: 0.9,
                  stagger: { amount: 0.18 },
                  ease: "power4.out",
                }),
            });
          }
        }
        // Keyboard navigation reveals a focused block immediately.
        const revealFocus = (event: FocusEvent) => {
          if (!(event.target instanceof Node)) return;
          for (const [block, timeline] of reveals) {
            if (block.contains(event.target)) timeline.progress(1);
          }
        };
        root.addEventListener("focusin", revealFocus);
        const readingLine = root.querySelector(".reading-progress");
        if (readingLine)
          gsap.to(readingLine, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              start: 0,
              end: "max",
              scrub: 0.2,
              invalidateOnRefresh: true,
            },
          });
        let frame = 0;
        const refresh = contextSafe(() => ScrollTrigger.refresh());
        const observer = new ResizeObserver(() => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(refresh);
        });
        observer.observe(root);
        return () => {
          observer.disconnect();
          cancelAnimationFrame(frame);
          root.removeEventListener("focusin", revealFocus);
        };
      });
      return () => media.revert();
    },
    { scope, dependencies: [pathname], revertOnUpdate: true },
  );

  return <main {...props} ref={scope} />;
}
