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
    () => {
      const root = scope.current;
      if (!root) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const timeline = gsap.timeline({ defaults: { ease: "expo.out" } });
        const home = root.classList.contains("apps-screen");
        const titles = root.querySelectorAll(
          home ? ".intro-word, .intro-signature" : "h1",
        );
        const rows = root.querySelectorAll<HTMLElement>(".projects li");
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

        titles.forEach((title, index) => {
          SplitText.create(title, {
            type: "lines,words",
            mask: "lines",
            autoSplit: true,
            linesClass: "motion-line",
            wordsClass: "motion-word",
            onSplit(split) {
              return gsap.from(split.words, {
                yPercent: 115,
                rotation: home ? 5 : 2,
                transformOrigin: "0% 100%",
                duration: home ? 1.05 : 0.85,
                delay: home ? 0.08 + index * 0.16 : 0.08,
                stagger: { amount: 0.12 },
                ease: "expo.out",
                onComplete: () => split.revert(),
              });
            },
          });
        });

        const supporting = root.querySelectorAll(
          ".intro > p, .back, .detail-actions > a, .language, .status, .notice:not(:has(h1)), main.notice > p, main.notice > a, .notice:has(h1) > p, .notice:has(h1) > a",
        );
        if (supporting.length) {
          timeline.from(
            supporting,
            {
              y: 18,
              opacity: 0,
              duration: 0.65,
              stagger: { amount: 0.12 },
              clearProps: "transform,opacity",
            },
            0.2,
          );
        }
        if (rows.length) {
          rows.forEach((row, index) => {
            timeline.from(
              row.querySelector(".project-info"),
              {
                clipPath: "inset(0 0 100% 0)",
                y: 28,
                duration: 0.8,
                clearProps: "clipPath,transform",
              },
              0.12 + index * 0.055,
            );
            timeline.from(
              row.querySelector(".project-actions"),
              {
                x: -14,
                opacity: 0,
                duration: 0.7,
                clearProps: "transform,opacity",
              },
              0.26 + index * 0.055,
            );
          });
        }

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
