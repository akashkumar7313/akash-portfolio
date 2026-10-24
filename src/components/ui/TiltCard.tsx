"use client";

import { useEffect, useRef, type ReactNode, type MouseEvent, type CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

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
  const canTilt = useRef(false);
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  useEffect(() => {
    canTilt.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  const rotateX = useSpring(
    useTransform(pointerY, [0, 1], [intensity, -intensity]),
    { stiffness: 140, damping: 20 }
  );
  const rotateY = useSpring(
    useTransform(pointerX, [0, 1], [-intensity, intensity]),
    { stiffness: 140, damping: 20 }
  );

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduceMotion || !canTilt.current) return;

    const rect = el.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);

    if (spotlight) {
      el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    }
  };

  const handleLeave = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  return (
    <div
      className={fill ? "h-full [perspective:1400px]" : "[perspective:1400px]"}
      style={{ "--tilt-glow": glow } as CSSProperties}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={
          reduceMotion
            ? undefined
            : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
        className={`group/tilt relative h-full will-change-transform ${className}`}
      >
        {animatedBorder && <div aria-hidden className="animated-border" />}
        <div className="relative h-full [transform-style:preserve-3d]">
          {children}
        </div>
        {spotlight && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
            style={{
              background:
                "radial-gradient(430px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgb(var(--tilt-glow) / 0.14), transparent 45%)",
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
