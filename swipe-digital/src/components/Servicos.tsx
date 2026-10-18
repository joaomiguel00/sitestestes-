"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { filtroDoServico } from "@/content/projetos";
import { servicos } from "@/content/textos";
import { motionConfig } from "@/config/motion";
import { useMenosMovimento } from "@/lib/hooks";
import { Revelar } from "./Revelar";
import { SetaIcone } from "./Seta";

function CardServico({ s, i, total, progresso, empilhar }: { s: (typeof servicos)[number]; i: number; total: number; progresso: MotionValue<number>; empilhar: boolean }) {
  const inicio = i / total;
  const escala = useTransform(progresso, [inicio, 1], [1, 1 - (total - 1 - i) * 0.05]);
  const sombra = useTransform(progresso, [inicio, Math.min(inicio + 1 / total, 1)], [0, i === total - 1 ? 0 : 0.55]);

  return (
    <motion.li
      className={empilhar ? "sticky" : ""}
      style={empilhar ? { top: `calc(96px + ${i * 22}px)`, scale: escala, transformOrigin: "top center" } : undefined}
    >
      <Link
        href={`/trabalhos?servico=${filtroDoServico(s.filtro)}`}
        className="group relative block overflow-hidden rounded-[28px] border border-white/10 bg-[#1b1b21] p-6 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.8)] transition-colors hover:border-roxo/60 sm:p-8"
      >
        <div className="flex items-start justify-between gap-6">
          <h3 className="font-display text-2xl font-extrabold tracking-[-0.04em] sm:text-3xl">{s.titulo}</h3>
          <span className="font-display text-sm font-semibold text-roxo-claro">{s.numero}</span>
        </div>
        <p className="mt-4 max-w-lg text-gelo/75">{s.frase}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <ul className="flex flex-wrap gap-2">
            {s.etiquetas.map((e) => (
              <li key={e} className="pilula !text-xs">
                {e}
              </li>
            ))}
          </ul>
          <span className="inline-flex items-center gap-2 text-sm text-roxo-claro">
            Ver trabalhos <SetaIcone className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
        {empilhar && <motion.div className="pointer-events-none absolute inset-0 bg-preto" style={{ opacity: sombra }} aria-hidden="true" />}
      </Link>
    </motion.li>
  );
}

export function Servicos() {
  const ref = useRef<HTMLUListElement>(null);
  const menos = useMenosMovimento();
  const empilhar = motionConfig.servicosEmpilhando && !menos;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 96px", "end end"] });

  return (
    <section id="servicos" className="relative z-10 px-4 py-16 sm:px-8 sm:py-24">
      <div className="painel mx-auto grid max-w-[1400px] gap-10 p-5 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:p-14">
        <Revelar className="lg:sticky lg:top-32 lg:self-start">
          <span className="pilula">
            <span className="h-1.5 w-1.5 rounded-full bg-roxo-claro" aria-hidden="true" />
            Serviços
          </span>
          <h2 className="titulo mt-5 text-[2rem] sm:text-5xl">Tudo que o seu negócio precisa no digital</h2>
          <p className="mt-5 max-w-md text-cinza sm:text-lg">
            Site, conteúdo, vídeo e anúncios. Tudo com a Swipe. Escolha um serviço para ver os trabalhos dele.
          </p>
        </Revelar>
        <ul ref={ref} className="flex flex-col gap-4">
          {servicos.map((s, i) => (
            <CardServico key={s.numero} s={s} i={i} total={servicos.length} progresso={scrollYProgress} empilhar={empilhar} />
          ))}
        </ul>
      </div>
    </section>
  );
}
