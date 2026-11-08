"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { type ReactNode, useRef } from "react";

gsap.registerPlugin(useGSAP);

export function SiteMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useGSAP(
    (_context, contextSafe) => {
      const root = scope.current;
      if (!root || !contextSafe) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        for (const arrow of root.querySelectorAll(".motion-arrow")) {
          gsap.set(arrow.querySelector(".motion-arrow-copy"), {
            x: 0,
            y: 0,
            xPercent: -130,
            yPercent: 130,
          });
        }
        const feedback = contextSafe((event: Event) => {
          if (!(event.target instanceof Element)) return;
          if (event instanceof PointerEvent && event.pointerType === "touch")
            return;
          const related = (event as MouseEvent | FocusEvent).relatedTarget;
          const entering =
            event.type === "pointerover" || event.type === "focusin";
          const row = event.target.closest(".projects li");
          if (row && !(related instanceof Node && row.contains(related))) {
            const on = entering || row.matches(":hover,:focus-within");
            gsap.to(row.querySelector(".project-info"), {
              x: on ? 5 : 0,
              duration: 0.65,
              ease: "power3.out",
              overwrite: "auto",
            });
            gsap.to(row.querySelector(".project-actions"), {
              x: on ? -3 : 0,
              duration: 0.65,
              ease: "power3.out",
              overwrite: "auto",
            });
            gsap.to(row, {
              "--row-line-scale": on ? 1 : 0,
              duration: 0.75,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
          const link = event.target.closest("a, .theme-toggle");
          if (
            !link ||
            !root.contains(link) ||
            (related instanceof Node && link.contains(related))
          )
            return;
          const on = entering || link.matches(":hover,:focus-within");
          const colors = getComputedStyle(root);
          if (link.matches(".brand,.details,.icon-link,.back,footer a"))
            gsap.to(link, {
              backgroundSize: on ? "100% 1px" : "0% 1px",
              duration: 0.65,
              ease: "power3.out",
              overwrite: "auto",
            });
          if (link.matches(".button"))
            gsap.to(link, {
              opacity: on ? 0.82 : 1,
              duration: 0.45,
              ease: "power2.out",
              overwrite: "auto",
            });
          if (link.matches(".open-app"))
            gsap.to(link, {
              borderColor: colors.getPropertyValue(
                on ? "--foreground" : "--line",
              ),
              duration: 0.5,
              overwrite: "auto",
            });
          if (link.matches(".theme-toggle"))
            gsap.to(link, {
              backgroundColor: colors.getPropertyValue(
                on ? "--foreground" : "--background",
              ),
              color: colors.getPropertyValue(
                on ? "--background" : "--foreground",
              ),
              duration: 0.45,
              overwrite: "auto",
            });
          const arrow = link.querySelector(".motion-arrow");
          if (arrow) {
            gsap.to(arrow.querySelector("svg:first-child"), {
              xPercent: on ? 130 : 0,
              yPercent: on ? -130 : 0,
              duration: 0.65,
              ease: "power3.inOut",
              overwrite: "auto",
            });
            gsap.to(arrow.querySelector(".motion-arrow-copy"), {
              xPercent: on ? 0 : -130,
              yPercent: on ? 0 : 130,
              duration: 0.65,
              ease: "power3.inOut",
              overwrite: "auto",
            });
          }
          const back = link.querySelector(":scope > svg");
          if (back)
            gsap.to(back, {
              x: on ? -3 : 0,
              duration: 0.6,
              ease: "power3.out",
              overwrite: "auto",
            });
        });
        const events = ["pointerover", "pointerout", "focusin", "focusout"];
        for (const event of events) root.addEventListener(event, feedback);
        return () => {
          for (const event of events) root.removeEventListener(event, feedback);
        };
      });
      return () => media.revert();
    },
    { scope, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div className="shell" ref={scope}>
      <div className="route-progress" aria-hidden="true" />
      {children}
    </div>
  );
}
