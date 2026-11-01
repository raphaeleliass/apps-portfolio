import { ArrowUpRight } from "lucide-react";

export function MotionArrow({ size = 16 }: { size?: number }) {
  return (
    <span
      className="motion-arrow"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <ArrowUpRight size={size} />
      <ArrowUpRight size={size} className="motion-arrow-copy" />
    </span>
  );
}
