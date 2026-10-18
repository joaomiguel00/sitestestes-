"use client";

import { motion } from "motion/react";

/** Sublinhado curvo que termina em seta: o gesto de swipe da marca. */
export function SetaSublinhado({
  className,
  desenhar = false,
  atraso = 0,
  cor = "#C6FF3D",
  esticar = false,
}: {
  className?: string;
  desenhar?: boolean;
  atraso?: number;
  cor?: string;
  /** Estica até a largura do elemento (traço com espessura fixa). */
  esticar?: boolean;
}) {
  const traco = esticar ? { strokeWidth: 5, vectorEffect: "non-scaling-stroke" as const } : { strokeWidth: 8 };
  const anim = desenhar
    ? { initial: { pathLength: 0 }, animate: { pathLength: 1 } }
    : { initial: false as const };
  return (
    <svg viewBox="0 0 240 34" fill="none" className={className} preserveAspectRatio={esticar ? "none" : undefined} aria-hidden="true">
      <motion.path
        d="M10 26 Q 120 34 222 10"
        stroke={cor}
        {...traco}
        strokeLinecap="round"
        {...anim}
        transition={{ duration: 0.7, delay: atraso, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.polyline
        points="206,6 224,9 216,25"
        stroke={cor}
        {...traco}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...anim}
        transition={{ duration: 0.3, delay: atraso + 0.6, ease: "easeOut" }}
      />
    </svg>
  );
}

/** Setinha curta para links e botões. */
export function SetaIcone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 15 Q 11 17 19 9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <polyline points="13,7.5 19.5,8.5 18,15" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Separador de seção com o gesto em seta. */
export function SetaSeparador({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className ?? ""}`} aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
      <SetaSublinhado className="h-4 w-24 opacity-80" cor="#A77BFF" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
    </div>
  );
}
