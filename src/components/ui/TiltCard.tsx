"use client";

import { useEffect, useRef, type ReactNode, type MouseEvent, type CSSProperties } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  spotlight?: boolean;
  animatedBorder?: boolean;
  fill?: boolean;
  glow?: string;
}

export default function TiltCard({
  children,
  className = "",
  intensity = 6,
  spotlight = true,
  animatedBorder = false,
  fill = false,
  glow = "201 243 108",
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useRef(false);

  useEffect(() => {
    fine.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !fine.current || !spotlight) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  const lift = Math.min(Math.max(intensity, 0), 10) * 0.6;

  return (
    <div
      className={`${fill ? "h-full" : ""} w-full min-w-0`}
      style={
        {
          "--tilt-glow": glow,
          "--card-lift": `${-lift}px`,
        } as CSSProperties
      }
    >
      <div
        ref={ref}
        onMouseMove={handleMove}
        className={`group/tilt relative h-full min-w-0 transition-transform duration-300 ease-out hover:[transform:translateY(var(--card-lift))] ${className}`}
      >
        {animatedBorder && <div aria-hidden className="animated-border" />}
        <div className="relative h-full min-w-0">{children}</div>
        {spotlight && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
            style={{
              background:
                "radial-gradient(430px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgb(var(--tilt-glow) / 0.12), transparent 45%)",
            }}
          />
        )}
      </div>
    </div>
  );
}
