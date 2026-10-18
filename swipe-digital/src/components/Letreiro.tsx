"use client";

import { useEffect, useRef } from "react";
import { motionConfig } from "@/config/motion";
import { useMenosMovimento } from "@/lib/hooks";
import { SetaIcone } from "./Seta";

const palavras = ["SITES", "POSTS", "VÍDEOS COM IA", "TRÁFEGO PAGO"];

function Faixa({ vazado }: { vazado?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-6 pr-6 sm:gap-10 sm:pr-10">
      {palavras.map((p) => (
        <span key={p} className="flex items-center gap-6 sm:gap-10">
          <span className={vazado ? "vazado" : ""}>{p}</span>
          <SetaIcone className={`h-[0.7em] w-[0.7em] ${vazado ? "text-white/20" : "text-limao"}`} />
        </span>
      ))}
    </div>
  );
}

/**
 * Letreiro correndo em duas linhas (sentidos opostos).
 * Acelera com a velocidade da rolagem e inverte quando a pessoa rola para cima.
 */
export function Letreiro() {
  const linha1 = useRef<HTMLDivElement>(null);
  const linha2 = useRef<HTMLDivElement>(null);
  const caixa = useRef<HTMLDivElement>(null);
  const menos = useMenosMovimento();

  useEffect(() => {
    if (menos || !motionConfig.letreiro) return;
    const l1 = linha1.current!;
    const l2 = linha2.current!;
    let x1 = 0;
    let x2 = 0;
    let dir = 1;
    let extra = 0;
    let ultimoY = window.scrollY;
    let ultimoT = performance.now();
    let raf = 0;
    let visivel = true;

    let w1 = l1.scrollWidth / 2;
    let w2 = l2.scrollWidth / 2;
    const ro = new ResizeObserver(() => {
      w1 = l1.scrollWidth / 2;
      w2 = l2.scrollWidth / 2;
    });
    ro.observe(l1);
    const io = new IntersectionObserver(([e]) => (visivel = e.isIntersecting));
    io.observe(caixa.current!);

    const passo = (t: number) => {
      const dt = Math.min((t - ultimoT) / 1000, 0.05);
      ultimoT = t;
      if (motionConfig.letreiroReageARolagem) {
        const y = window.scrollY;
        const dy = y - ultimoY;
        ultimoY = y;
        if (dy !== 0) dir = dy > 0 ? 1 : -1;
        extra = extra * 0.9 + Math.min(Math.abs(dy) / Math.max(dt, 0.001), 3000) * 0.012;
      }
      if (visivel && w1 > 0 && w2 > 0) {
        const v = (motionConfig.letreiroVelocidade + extra * 2) * dir * dt;
        x1 = (((x1 - v) % w1) - w1) % w1;
        x2 = (((x2 + v) % w2) - w2) % w2;
        l1.style.transform = `translate3d(${x1}px,0,0)`;
        l2.style.transform = `translate3d(${x2}px,0,0)`;
      }
      raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [menos]);

  return (
    <div ref={caixa} className="relative z-10 overflow-hidden border-y border-white/8 bg-preto/60 py-6 backdrop-blur-sm sm:py-8">
      <p className="sr-only">Sites, posts, vídeos com IA e tráfego pago.</p>
      <div aria-hidden="true" className="space-y-2 font-display font-extrabold tracking-[-0.04em] whitespace-nowrap">
        <div ref={linha1} className="flex w-max text-4xl will-change-transform sm:text-6xl lg:text-7xl">
          <Faixa />
          <Faixa />
        </div>
        <div ref={linha2} className="flex w-max text-3xl will-change-transform sm:text-5xl lg:text-6xl">
          <Faixa vazado />
          <Faixa vazado />
        </div>
      </div>
    </div>
  );
}
