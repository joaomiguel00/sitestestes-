"use client";

import { useEffect, useRef, useState } from "react";
import { motionConfig } from "@/config/motion";
import { carregarGsap, useMenosMovimento } from "@/lib/hooks";

type Traco = { d: string; ponta: string; cor: string; largura: number };

/** Ponta de seta no fim de uma curva, a partir da direção final. */
function ponta(x: number, y: number, cx: number, cy: number, tam = 22) {
  const ang = Math.atan2(y - cy, x - cx);
  const a1 = ang + Math.PI - 0.55;
  const a2 = ang + Math.PI + 0.55;
  return `${x + Math.cos(a1) * tam},${y + Math.sin(a1) * tam} ${x},${y} ${x + Math.cos(a2) * tam},${y + Math.sin(a2) * tam}`;
}

/**
 * Traços em neon (o gesto de swipe) que saem do celular e descem pela página,
 * se desenhando conforme a rolagem. Fica dentro de um container relative
 * que envolve o topo, o letreiro e o manifesto.
 */
export function TracosNeon() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tam, setTam] = useState<{ w: number; h: number; tracos: Traco[] } | null>(null);
  const menos = useMenosMovimento();

  useEffect(() => {
    if (!motionConfig.tracosNeon) return;
    const svg = svgRef.current;
    const pai = svg?.parentElement;
    if (!svg || !pai) return;

    const medir = () => {
      const base = pai.getBoundingClientRect();
      const cel = pai.querySelector("[data-ancora-celular]")?.getBoundingClientRect();
      const alvo = pai.querySelector("#sobre")?.getBoundingClientRect();
      if (!cel || !alvo) return;
      const w = base.width;
      const h = base.height;
      const px = cel.left - base.left + cel.width / 2;
      const py = cel.top - base.top + cel.height * 0.78;
      const fim = alvo.top - base.top + 40;
      const H = fim - py;
      const larga = w >= 1024;

      const e1 = { x: larga ? w * 0.82 : w * 0.86, y: fim };
      const c1a = { x: px - w * 0.35, y: py + H * 0.35 };
      const c1b = { x: w * 0.98, y: fim - H * 0.35 };
      const e2 = { x: larga ? w * 0.1 : w * 0.12, y: fim + 30 };
      const c2a = { x: px + w * 0.3, y: py + H * 0.3 };
      const c2b = { x: -w * 0.05, y: fim - H * 0.4 };

      setTam({
        w,
        h,
        tracos: [
          {
            d: `M${px},${py} C${c1a.x},${c1a.y} ${c1b.x},${c1b.y} ${e1.x},${e1.y}`,
            ponta: ponta(e1.x, e1.y, c1b.x, c1b.y),
            cor: "#7B2FF7",
            largura: larga ? 7 : 5,
          },
          {
            d: `M${px + 12},${py} C${c2a.x},${c2a.y} ${c2b.x},${c2b.y} ${e2.x},${e2.y}`,
            ponta: ponta(e2.x, e2.y, c2b.x, c2b.y, 16),
            cor: "#C6FF3D",
            largura: larga ? 3 : 2.5,
          },
        ],
      });
    };

    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(pai);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!tam || menos) return;
    const svg = svgRef.current;
    if (!svg) return;
    let fim: (() => void) | undefined;
    let cancelado = false;
    carregarGsap().then(({ gsap }) => {
      if (cancelado) return;
      const ctx = gsap.context(() => {
        const linhas = svg.querySelectorAll<SVGPathElement>("[data-linha]");
        const pontas = svg.querySelectorAll<SVGPolylineElement>("[data-ponta]");
        gsap.set(linhas, { strokeDasharray: 1, strokeDashoffset: 0.94 });
        gsap.set(pontas, { opacity: 0 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: svg.parentElement, start: "top top", end: `+=${tam.h * 0.62}`, scrub: 0.6 },
        });
        tl.to(linhas, { strokeDashoffset: 0, ease: "none", duration: 1 }).to(pontas, { opacity: 1, duration: 0.05 }, 0.96);
      }, svg);
      fim = () => ctx.revert();
    });
    return () => {
      cancelado = true;
      fim?.();
    };
  }, [tam, menos]);

  if (!motionConfig.tracosNeon) return null;
  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
      viewBox={tam ? `0 0 ${tam.w} ${tam.h}` : "0 0 1 1"}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="neon" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {tam?.tracos.map((t, i) => (
        <g key={i} filter={tam.w >= 1024 ? "url(#neon)" : undefined} opacity={i === 0 ? 0.9 : 0.75}>
          <path data-linha d={t.d} pathLength={1} stroke={t.cor} strokeWidth={t.largura} strokeLinecap="round" />
          <polyline data-ponta points={t.ponta} stroke={t.cor} strokeWidth={t.largura} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
    </svg>
  );
}
