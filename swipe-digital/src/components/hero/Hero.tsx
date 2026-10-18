"use client";

import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { motionConfig } from "@/config/motion";
import { site } from "@/config/site";
import { useMenosMovimento } from "@/lib/hooks";
import { atrasoDaAbertura } from "../Abertura";
import { Botao } from "../Botao";
import { CardVidro } from "../CardVidro";
import { BotoesRedes } from "../Redes";
import { SetaIcone, SetaSublinhado } from "../Seta";
import { Celular } from "./Celular";
import { CarrosselDestaques, ListaServicos, ParaQuem } from "./HeroLateral";

function Contador({ valor, atraso }: { valor: number; atraso: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visto = useInView(ref, { once: true });
  const menos = useMenosMovimento();
  useEffect(() => {
    const el = ref.current;
    if (!el || !visto || menos || !motionConfig.contadores) return;
    el.textContent = "0";
    const c = animate(0, valor, {
      duration: 1.1,
      delay: atraso,
      ease: "easeOut",
      onUpdate: (v) => (el.textContent = String(Math.round(v))),
    });
    return () => c.stop();
  }, [visto, valor, atraso, menos]);
  return <span ref={ref}>{valor}</span>;
}

const dados = [
  { valor: 4, rotulo: "serviços em 1 time" },
  { valor: 3, rotulo: "especialistas" },
  { valor: 1, rotulo: "contato para tudo" },
];

/** Atraso das entradas em CSS (rodam antes do JavaScript carregar; a abertura soma o tempo dela). */
const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

function Linha({ children, atraso, className }: { children: React.ReactNode; atraso: number; className?: string }) {
  return (
    <span className={`-mt-[0.14em] block overflow-hidden pt-[0.14em] pb-[0.08em] whitespace-nowrap ${className ?? ""}`}>
      <span className="linha-sobe block" style={d(atraso)}>
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  const [a] = useState(() => atrasoDaAbertura());
  const menos = useMenosMovimento();

  return (
    <section id="topo" className="relative px-4 pt-28 pb-12 sm:px-8 sm:pt-32 lg:min-h-[100svh] lg:pb-20">
      <div className="halo -top-40 -left-40 h-[520px] w-[520px] opacity-40" aria-hidden="true" />
      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.75fr)_minmax(0,0.55fr)] lg:gap-8">
        {/* Coluna do texto */}
        <div className="flex flex-col">
          <span className="entra pilula self-start" style={d(0)}>
            <SetaIcone className="h-4 w-4 text-limao" />
            Agência digital · {site.cidade}
          </span>

          <div className="relative mt-7 self-start">
            <h1 className="titulo text-[clamp(2rem,10vw,4.2rem)] sm:text-[clamp(3.2rem,8vw,5.6rem)] lg:text-[clamp(2.9rem,4.4vw,4.5rem)]">
              <span className="flex items-start gap-4">
                <Linha atraso={0.1}>Seu negócio</Linha>
                <span
                  className="entra mt-2 hidden w-20 text-xs leading-tight font-normal tracking-normal text-cinza sm:block"
                  style={{ fontFamily: "var(--font-sans)", ...d(0.8) }}
                >
                  da ideia ao feed
                </span>
              </span>
              <Linha atraso={0.22}>no feed de</Linha>
              <span className="relative inline-block">
                <Linha atraso={0.34}>
                  <span className="texto-degrade brilho inline-block" style={d(0.7)}>
                    quem compra.
                  </span>
                </Linha>
                <SetaSublinhado className="absolute -bottom-[0.2em] left-[42%] h-[0.3em] w-[56%]" esticar desenhar={!menos} atraso={a + 1.1} />
              </span>
            </h1>

            {/* Adesivo */}
            <motion.span
              className="absolute -top-9 right-0 z-10 sm:top-[36%] sm:-right-10 inline-block cursor-default rounded-xl border border-white/15 bg-[#1c1c22] px-3.5 py-2 font-display text-sm font-extrabold tracking-[-0.03em] text-limao shadow-[0_10px_30px_rgba(0,0,0,0.5)] sm:text-base"
              initial={{ y: -140, rotate: -40, opacity: 0 }}
              animate={{ y: 0, rotate: -8, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 11, delay: a + 0.9 }}
              whileHover={{ rotate: [-8, -2, -13, -6, -8], transition: { duration: 0.6 } }}
            >
              pare o scroll
            </motion.span>
          </div>

          <p className="entra mt-3 text-xs text-cinza sm:hidden" style={d(0.8)}>
            da ideia ao feed
          </p>

          <div className="entra" style={d(0.5)}>
            <p className="mt-6 max-w-md text-base text-gelo/80 sm:text-lg">
              Site, posts, vídeos com IA e anúncios. Veja o que a gente já criou.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Botao href="#trabalhos">Ver trabalhos</Botao>
              <Botao href="#servicos" variante="escuro" seta={false}>
                Serviços
              </Botao>
            </div>
          </div>

          <ul className="mt-10 grid grid-cols-3 gap-2.5 sm:gap-3">
            {dados.map((item, i) => (
              <li key={item.rotulo} className="entra" style={d(0.7 + i * 0.12)}>
                <CardVidro className="h-full p-3.5 sm:p-5">
                  <p className="font-display text-3xl font-extrabold tracking-[-0.05em] sm:text-4xl">
                    <Contador valor={item.valor} atraso={a + 0.8 + i * 0.12} />
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-cinza sm:text-sm">{item.rotulo}</p>
                </CardVidro>
              </li>
            ))}
          </ul>
        </div>

        {/* Objeto central */}
        <div className="flex items-center justify-center py-6 lg:py-0">
          <Celular />
        </div>

        {/* Coluna da direita (no celular, fileira que desliza) */}
        <div
          style={d(0.6)}
          className="entra -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:justify-center lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0"
          data-lenis-prevent-touch
        >
          <div className="hidden lg:block">
            <ListaServicos />
          </div>
          <div className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-auto">
            <CarrosselDestaques />
          </div>
          <div className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-auto">
            <ParaQuem />
          </div>
          <div className="flex w-[60%] shrink-0 snap-start flex-col justify-center gap-3 rounded-[28px] border border-white/8 p-5 sm:w-[40%] lg:hidden">
            <ListaServicos />
            <BotoesRedes />
          </div>
        </div>
      </div>

      {/* Redes e "role pra ver" na borda direita */}
      <div className="absolute top-1/2 right-6 z-10 hidden -translate-y-1/2 flex-col items-center gap-4 2xl:flex">
        <BotoesRedes className="flex-col" />
        <span className="text-[11px] tracking-[0.3em] text-cinza uppercase [writing-mode:vertical-rl]">redes</span>
      </div>
      <a
        href="#trabalhos"
        className="absolute right-6 bottom-8 z-10 hidden flex-col items-center gap-3 text-[11px] tracking-[0.3em] text-cinza uppercase 2xl:flex"
      >
        <span className="[writing-mode:vertical-rl]">role pra ver</span>
        <svg viewBox="0 0 12 20" className="animate-seta-desce h-5 w-3 text-roxo-claro" aria-hidden="true">
          <path d="M6 1v16M1.5 12.5 6 17l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
