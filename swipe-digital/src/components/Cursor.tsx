"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { motionConfig } from "@/config/motion";
import { usePonteiroFino } from "@/lib/hooks";

/** Cursor "ver" sobre elementos com data-cursor="ver" (só no computador). */
export function Cursor() {
  const fino = usePonteiroFino();
  const [visivel, setVisivel] = useState(false);
  const x = useSpring(useMotionValue(-100), { stiffness: 500, damping: 40 });
  const y = useSpring(useMotionValue(-100), { stiffness: 500, damping: 40 });

  useEffect(() => {
    if (!fino || !motionConfig.cursorVer) return;
    const mover = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const alvo = (e.target as HTMLElement | null)?.closest?.("[data-cursor='ver']");
      setVisivel(!!alvo);
    };
    window.addEventListener("pointermove", mover, { passive: true });
    return () => window.removeEventListener("pointermove", mover);
  }, [fino, x, y]);

  if (!fino || !motionConfig.cursorVer) return null;
  return (
    <motion.div className="pointer-events-none fixed top-0 left-0 z-[70]" style={{ x, y }} aria-hidden="true">
      <AnimatePresence>
        {visivel && (
          <motion.div
            className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-roxo px-5 py-5 font-display text-sm font-semibold text-gelo shadow-[0_0_40px_rgba(123,47,247,0.7)]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            ver
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
