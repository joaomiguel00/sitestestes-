"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";
import { projetosEmDestaque } from "@/content/projetos";
import { motionConfig } from "@/config/motion";
import { useMenosMovimento, usePonteiroFino } from "@/lib/hooks";
import { SetaSublinhado } from "../Seta";
import { midia } from "@/lib/caminho";

/** Peças de marca que aparecem no feed, entre as capas dos projetos. */
function PostMarca({ tipo }: { tipo: number }) {
  if (tipo === 0)
    return (
      <div className="flex aspect-[4/5] flex-col justify-between rounded-2xl bg-roxo p-4">
        <span className="text-[10px] text-lilas">swipe.digital</span>
        <div>
          <p className="font-display text-xl leading-none font-extrabold tracking-[-0.05em]">pare o scroll</p>
          <SetaSublinhado className="mt-1 h-3 w-20" />
        </div>
      </div>
    );
  if (tipo === 1)
    return (
      <div className="flex aspect-square flex-col justify-end rounded-2xl border border-white/10 bg-grafite p-4">
        <p className="font-display text-lg leading-tight font-extrabold tracking-[-0.04em]">
          site · posts
          <br />
          <span className="text-roxo-claro">vídeo · ads</span>
        </p>
      </div>
    );
  return (
    <div className="flex aspect-[4/5] items-center justify-center rounded-2xl bg-gelo p-4">
      <span className="rounded-lg bg-roxo px-2 py-1 font-display text-xs font-semibold tracking-[0.35em] text-gelo">DIGITAL</span>
    </div>
  );
}

function ItensFeed() {
  const itens: React.ReactNode[] = [];
  projetosEmDestaque.forEach((p, i) => {
    itens.push(
      <div key={p.slug} className="overflow-hidden rounded-2xl">
        <Image src={midia(p.capa)} alt="" width={320} height={240} sizes="240px" className="aspect-[4/5] w-full object-cover" />
      </div>,
    );
    itens.push(<PostMarca key={`m${i}`} tipo={i % 3} />);
  });
  return (
    <div className="flex flex-col gap-2.5">
      {itens.map((item, i) => (
        <div key={i}>
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="h-4 w-4 rounded-full bg-gradient-to-br from-roxo to-roxo-claro" />
            <span className="h-1.5 w-12 rounded-full bg-white/20" />
          </div>
          {item}
          <div className="mt-1.5 flex gap-1.5" aria-hidden="true">
            <span className="h-1.5 w-6 rounded-full bg-white/15" />
            <span className="h-1.5 w-10 rounded-full bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Celular() {
  const fino = usePonteiroFino();
  const menos = useMenosMovimento();
  const ativo = fino && !menos && motionConfig.celularParallax;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const rotY = useTransform(sx, [-1, 1], [-26, -4]);
  const rotX = useTransform(sy, [-1, 1], [14, 2]);

  useEffect(() => {
    if (!ativo) return;
    const mover = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", mover, { passive: true });
    return () => window.removeEventListener("pointermove", mover);
  }, [ativo, mx, my]);

  return (
    <div className="relative flex justify-center [perspective:1400px]" data-ancora-celular>
      <div className="halo animate-glow top-1/2 left-1/2 h-[120%] w-[140%] -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
      <div className={menos ? "" : "animate-flutuar"}>
        <motion.div
          className="relative w-[230px] sm:w-[260px] [transform-style:preserve-3d]"
          style={{ rotateY: ativo ? rotY : -15, rotateX: ativo ? rotX : 8, rotateZ: 5 }}
          initial={{ opacity: 0, y: 40, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          role="img"
          aria-label="Celular mostrando um feed com trabalhos da Swipe Digital"
        >
          {/* corpo */}
          <div className="relative aspect-[9/19] rounded-[44px] border border-white/15 bg-[#0a0a0c] p-2.5 shadow-[0_40px_120px_-30px_rgba(123,47,247,0.75),inset_0_0_0_2px_rgba(255,255,255,0.04)]">
            <div className="relative h-full overflow-hidden rounded-[36px] bg-preto">
              {/* barra do app */}
              <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-preto via-preto/90 to-transparent px-4 pt-8 pb-4">
                <span className="font-display text-sm font-extrabold tracking-[-0.06em]">swipe</span>
                <span className="h-2 w-2 rounded-full bg-limao" />
              </div>
              <div className="absolute top-2.5 left-1/2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
              <div className={`px-3 pt-20 ${menos ? "" : "feed-rolando"}`} aria-hidden="true">
                <div className="pb-2.5">
                  <ItensFeed />
                </div>
                <div className="pb-2.5">
                  <ItensFeed />
                </div>
              </div>
            </div>
          </div>
          {/* reflexo */}
          <div className="pointer-events-none absolute inset-0 rounded-[44px] bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12]" aria-hidden="true" />
        </motion.div>
      </div>
    </div>
  );
}
