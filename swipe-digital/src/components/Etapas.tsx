"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { etapas } from "@/content/textos";
import { motionConfig } from "@/config/motion";
import { useMenosMovimento } from "@/lib/hooks";
import { TituloSecao } from "./Revelar";

/** Linha em seta que liga as etapas e se desenha com a rolagem. */
export function Etapas() {
  const ref = useRef<HTMLOListElement>(null);
  const menos = useMenosMovimento();
  const animar = motionConfig.linhaDasEtapas && !menos;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 55%"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });
  const [acesasRolagem, setAcesas] = useState(0);
  const acesas = animar ? acesasRolagem : etapas.length;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!animar) return;
    setAcesas(Math.min(etapas.length, Math.floor(v * etapas.length + 0.35)));
  });

  return (
    <section id="como-trabalhamos" className="relative z-10 px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <TituloSecao
          className="lg:sticky lg:top-32 lg:self-start"
          pilula="Como trabalhamos"
          titulo="Do papo inicial ao relatório do mês."
          texto="Cinco etapas simples. Você aprova tudo antes de ir ao ar."
        />
        <ol ref={ref} className="relative">
          {/* trilho + linha */}
          <div className="absolute top-3 bottom-10 left-[19px] w-[2px] rounded-full bg-white/8" aria-hidden="true">
            <motion.div className="h-full w-full origin-top rounded-full bg-roxo shadow-[0_0_12px_rgba(123,47,247,0.9)]" style={{ scaleY: animar ? p : 1 }} />
          </div>
          {etapas.map((e, i) => {
            const acesa = i < acesas;
            return (
              <li key={e.titulo} className="relative flex gap-6 pb-12 last:pb-0">
                <span
                  className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border font-display text-sm font-semibold transition-all duration-500 ${
                    acesa ? "border-roxo bg-roxo text-gelo shadow-[0_0_24px_rgba(123,47,247,0.8)]" : "border-white/15 bg-preto text-cinza"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="pt-1">
                  <h3 className={`font-display text-xl font-extrabold tracking-[-0.03em] transition-colors duration-500 sm:text-2xl ${acesa ? "text-gelo" : "text-cinza"}`}>{e.titulo}</h3>
                  <p className="mt-1.5 text-cinza sm:text-lg">{e.texto}</p>
                </div>
              </li>
            );
          })}
          <li aria-hidden="true" className="relative -mt-2 pl-[9px]">
            <svg viewBox="0 0 24 24" className={`h-6 w-6 rotate-90 text-roxo-claro transition-opacity duration-500 ${acesas >= etapas.length ? "opacity-100" : "opacity-0"}`} fill="none">
              <polyline points="13,5 20,12 13,19" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </li>
        </ol>
      </div>
    </section>
  );
}
