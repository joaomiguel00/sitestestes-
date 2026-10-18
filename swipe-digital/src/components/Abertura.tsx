"use client";

import { useEffect, useRef } from "react";
import { motionConfig } from "@/config/motion";

export const CHAVE_ABERTURA = "swipe-abertura";

/** Roda antes da página pintar: decide se a abertura aparece (só na primeira visita). */
export const scriptAbertura = `try{var d=document.documentElement;if(!${motionConfig.abertura}||localStorage.getItem('${CHAVE_ABERTURA}')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.intro='skip'}else{d.dataset.intro='play';localStorage.setItem('${CHAVE_ABERTURA}','1')}}catch(e){document.documentElement.dataset.intro='skip'}`;

/** Quanto o topo deve esperar para começar a animar. */
export function atrasoDaAbertura() {
  if (typeof document === "undefined") return 0;
  return document.documentElement.dataset.intro === "play" ? motionConfig.aberturaDuracaoMs / 1000 - 0.25 : 0;
}

export function Abertura() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fim = () => {
      el.style.display = "none";
    };
    el.addEventListener("animationend", (e) => e.target === el && fim());
    const t = setTimeout(fim, motionConfig.aberturaDuracaoMs + 800);
    return () => clearTimeout(t);
  }, []);

  if (!motionConfig.abertura) return null;
  return (
    <div
      ref={ref}
      className="abertura"
      style={{ "--dur": `${motionConfig.aberturaDuracaoMs}ms` } as React.CSSProperties}
      onClick={() => ref.current && (ref.current.style.display = "none")}
      aria-hidden="true"
    >
      <div className="flex flex-col items-start">
        <span className="flex overflow-hidden font-display text-[22vw] leading-[1.05] font-extrabold tracking-[-0.07em] sm:text-[10rem]">
          {"swipe".split("").map((l, i) => (
            <span key={i} className="abertura-letra" style={{ "--i": i } as React.CSSProperties}>
              {l}
            </span>
          ))}
        </span>
        <svg viewBox="0 0 240 34" fill="none" className="-mt-2 w-[60vw] sm:w-[28rem]">
          <path className="abertura-traco" pathLength={1} d="M10 26 Q 120 34 222 10" stroke="#C6FF3D" strokeWidth="8" strokeLinecap="round" />
          <polyline className="abertura-traco abertura-ponta" pathLength={1} points="206,6 224,9 216,25" stroke="#C6FF3D" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="absolute bottom-8 text-xs tracking-widest text-cinza uppercase">toque para pular</span>
    </div>
  );
}
