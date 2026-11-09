"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function SiteMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(
    (_context, contextSafe) => {
      const root = scope.current;
      if (!root || !contextSafe) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const header = root.querySelector("header");
        if (header)
          gsap.from(header.querySelectorAll(":scope > .brand, nav > *"), {
            y: -10,
            autoAlpha: 0,
            duration: 0.65,
            stagger: 0.065,
            ease: "power3.out",
            clearProps: "transform,opacity,visibility",
          });
        const footer = root.querySelector("footer");
        if (footer)
          gsap.from(footer.children, {
            y: 12,
            autoAlpha: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "transform,opacity,visibility",
            scrollTrigger: {
              trigger: footer,
              start: "clamp(top 96%)",
              once: true,
            },
          });
        const feedback = contextSafe((event: Event) => {
          if (!(event.target instanceof Element)) return;
          if (event instanceof PointerEvent && event.pointerType === "touch")
            return;
          const related = (event as MouseEvent | FocusEvent).relatedTarget;
          const entering =
            event.type === "pointerover" || event.type === "focusin";
          const row = event.target.closest(".projects li");
          if (row && !(related instanceof Node && row.contains(related))) {
            gsap.to(row, {
              "--row-line-scale":
                entering || row.matches(":hover,:focus-within") ? 1 : 0,
              duration: 0.45,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
          const link = event.target.closest("a,button");
          if (
            !link ||
            !root.contains(link) ||
            (related instanceof Node && link.contains(related))
          )
            return;
          const on = entering || link.matches(":hover,:focus-visible");
          const timeline = gsap.timeline({
            defaults: { duration: 0.35, ease: "power3.out", overwrite: "auto" },
          });
          const arrow = link.querySelector(".motion-arrow");
          if (arrow) {
            timeline.to(
              arrow.querySelectorAll("svg"),
              {
                xPercent: on ? 130 : 0,
                yPercent: on ? -130 : 0,
                stagger: 0.035,
              },
              0,
            );
          }
          const back = link.querySelector(":scope > svg");
          if (back && link.matches(".back"))
            timeline.to(back, { x: on ? -4 : 0 }, 0);
          if (link.matches(".brand,.details,.icon-link,.back,footer a")) {
            timeline.to(
              link,
              { backgroundSize: on ? "100% 1px" : "0% 1px" },
              0,
            );
          }
          if (link.matches(".open-app,.button,.theme-toggle")) {
            timeline.to(link, { scale: on ? 1.035 : 1 }, 0);
          }
        });
        const events = ["pointerover", "pointerout", "focusin", "focusout"];
        for (const event of events) root.addEventListener(event, feedback);
        return () => {
          for (const event of events) root.removeEventListener(event, feedback);
        };
      });
      return () => media.revert();
    },
    { scope },
  );

  return (
    <div className="shell" ref={scope}>
      {children}
    </div>
  );
}
