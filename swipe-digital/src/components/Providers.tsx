"use client";

import { MotionConfig } from "motion/react";
import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import { motionConfig } from "@/config/motion";
import { useMenosMovimento } from "@/lib/hooks";

export function Providers({ children }: { children: React.ReactNode }) {
  const menos = useMenosMovimento();
  const montado = useMontado();
  // Lenis entra como irmão (modo root) só depois de montar, para não trocar a árvore na hidratação.
  const lenis = montado && motionConfig.rolagemSuave && !menos;
  return (
    <>
      {lenis && <ReactLenis root options={{ lerp: 0.1 / motionConfig.rolagemSuaveIntensidade, anchors: { offset: -88 } }} />}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </>
  );
}

function useMontado() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
