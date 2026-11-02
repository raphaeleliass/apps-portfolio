import type { ReactNode } from "react";

export function SiteMotion({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <div className="route-progress" aria-hidden="true" />
      {children}
    </div>
  );
}
