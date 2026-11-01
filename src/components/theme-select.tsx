"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

export function ThemeSelect() {
  const scope = useRef<HTMLButtonElement>(null);
  const { contextSafe } = useGSAP({ scope });
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    let initial: "light" | "dark" = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches
      ? "dark"
      : "light";
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") initial = saved;
    } catch {}
    document.documentElement.dataset.theme = initial;
    setTheme(initial);
  }, []);

  const label = theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro";
  return (
    <button
      ref={scope}
      type="button"
      className="theme-toggle"
      aria-label={label}
      title={label}
      disabled={theme === null}
      onClick={contextSafe(() => {
        const next = theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        setTheme(next);
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          gsap.fromTo(
            scope.current,
            { rotation: -50, scale: 0.88 },
            {
              rotation: 0,
              scale: 1,
              duration: 0.65,
              ease: "expo.out",
              overwrite: true,
              clearProps: "transform",
            },
          );
        }
        try {
          localStorage.setItem("theme", next);
        } catch {}
      })}
    >
      <Sun
        className="theme-sun"
        size={19}
        strokeWidth={1.7}
        aria-hidden="true"
      />
      <Moon
        className="theme-moon"
        size={19}
        strokeWidth={1.7}
        aria-hidden="true"
      />
    </button>
  );
}
