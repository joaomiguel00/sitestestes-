"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";
import { motionConfig } from "@/config/motion";
import { useMenosMovimento, usePonteiroFino } from "@/lib/hooks";

/** Puxa levemente o conteúdo na direção do cursor (só no computador). */
export function Magnetico({ children, forca = 0.25, className }: { children: React.ReactNode; forca?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fino = usePonteiroFino();
  const menos = useMenosMovimento();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const ativo = fino && !menos && motionConfig.botoesMagneticos;

  return (
    <motion.span
      ref={ref}
      className={`inline-flex ${className ?? ""}`}
      style={ativo ? { x, y } : undefined}
      onPointerMove={(e) => {
        if (!ativo || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * forca);
        y.set((e.clientY - (r.top + r.height / 2)) * forca);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
