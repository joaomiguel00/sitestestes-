"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";
import { motionConfig } from "@/config/motion";
import { useMenosMovimento, usePonteiroFino } from "@/lib/hooks";

/** Card de vidro com luz que segue o cursor na borda e inclinação 3D leve. */
export function CardVidro({
  children,
  className,
  glow,
  inclinar = true,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  inclinar?: boolean;
  as?: "div" | "article" | "li";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fino = usePonteiroFino();
  const menos = useMenosMovimento();
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
  const podeInclinar = inclinar && fino && !menos && motionConfig.cardsInclinacao;
  const spot = fino && motionConfig.cardsSpotlight;
  const Comp = motion[as] as typeof motion.div;

  return (
    <Comp
      ref={ref}
      className={`vidro ${glow ? "vidro-glow" : ""} ${className ?? ""}`}
      style={podeInclinar ? { rotateX: rx, rotateY: ry, transformPerspective: 900 } : undefined}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || (!spot && !podeInclinar)) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        if (spot) {
          el.style.setProperty("--mx", `${px * 100}%`);
          el.style.setProperty("--my", `${py * 100}%`);
          el.style.setProperty("--spot", "1");
        }
        if (podeInclinar) {
          rx.set((0.5 - py) * 6);
          ry.set((px - 0.5) * 6);
        }
      }}
      onPointerLeave={() => {
        ref.current?.style.setProperty("--spot", "0");
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </Comp>
  );
}
