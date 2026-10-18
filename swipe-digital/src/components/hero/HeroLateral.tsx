"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "next-view-transitions";
import { projetosEmDestaque } from "@/content/projetos";
import { publicos } from "@/content/textos";
import { motionConfig } from "@/config/motion";
import { useMenosMovimento } from "@/lib/hooks";
import { CardVidro } from "../CardVidro";
import { Botao } from "../Botao";
import { IconeChevron, IconePause, IconePlay } from "../Icones";
import { midia } from "@/lib/caminho";

const dois = (n: number) => String(n).padStart(2, "0");

export function ListaServicos() {
  const lista = ["Sites", "Posts", "Vídeos", "Tráfego"];
  const [atual, setAtual] = useState(0);
  const menos = useMenosMovimento();
  useEffect(() => {
    if (menos) return;
    const t = setInterval(() => setAtual((a) => (a + 1) % lista.length), motionConfig.listaServicosIntervaloMs);
    return () => clearInterval(t);
  }, [menos, lista.length]);
  return (
    <ul className="flex gap-4 text-sm lg:flex-col lg:gap-1.5" aria-label="Serviços">
      {lista.map((s, i) => (
        <li key={s} className={`flex items-center gap-2 transition-colors duration-500 ${i === atual ? "text-roxo-claro" : "text-cinza/70"}`}>
          <span className={`h-1 rounded-full bg-current transition-all duration-500 ${i === atual ? "w-4" : "w-1"}`} aria-hidden="true" />
          {s}
        </li>
      ))}
    </ul>
  );
}

export function CarrosselDestaques() {
  const total = projetosEmDestaque.length;
  const [i, setI] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [emFoco, setEmFoco] = useState(false);
  const menos = useMenosMovimento();
  const parado = pausado || emFoco || menos;

  useEffect(() => {
    if (parado || total < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % total), motionConfig.carrosselIntervaloMs);
    return () => clearInterval(t);
  }, [parado, total]);

  if (!total) return null;
  const p = projetosEmDestaque[i];
  const ir = (d: number) => setI((v) => (v + d + total) % total);

  return (
    <CardVidro className="p-3" inclinar={false}>
      <section
        aria-roledescription="carrossel"
        aria-label="Projetos em destaque"
        onMouseEnter={() => setEmFoco(true)}
        onMouseLeave={() => setEmFoco(false)}
        onFocus={() => setEmFoco(true)}
        onBlur={() => setEmFoco(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") ir(1);
          if (e.key === "ArrowLeft") ir(-1);
        }}
      >
        <Link href={`/trabalhos/${p.slug}`} className="relative block overflow-hidden rounded-[20px]" data-cursor="ver">
          <div className="relative aspect-[4/3]">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={p.slug}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image src={midia(p.capa)} alt={`Capa do projeto ${p.titulo}`} fill loading="eager" sizes="(min-width: 1024px) 280px, 80vw" className="object-cover" />
              </motion.div>
            </AnimatePresence>
          </div>
        </Link>
        <div className="flex items-end justify-between gap-3 px-1.5 pt-3 pb-1">
          <div className="min-w-0" aria-live={parado ? "polite" : "off"}>
            <p className="font-display text-xs font-semibold tabular-nums">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={i} className="inline-block" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.25 }}>
                  {dois(i + 1)}
                </motion.span>
              </AnimatePresence>
              <span className="text-cinza">/{dois(total)}</span>
            </p>
            <p className="mt-1 truncate text-sm text-cinza">{p.titulo}</p>
          </div>
          <div className="flex shrink-0 gap-1">
            <button type="button" onClick={() => ir(-1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 hover:bg-white/10" aria-label="Projeto anterior">
              <IconeChevron dir="esq" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPausado((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 hover:bg-white/10"
              aria-label={pausado ? "Continuar carrossel" : "Pausar carrossel"}
              aria-pressed={pausado}
            >
              {pausado ? <IconePlay className="h-3.5 w-3.5" /> : <IconePause className="h-3.5 w-3.5" />}
            </button>
            <button type="button" onClick={() => ir(1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 hover:bg-white/10" aria-label="Próximo projeto">
              <IconeChevron className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </CardVidro>
  );
}

export function ParaQuem() {
  return (
    <CardVidro className="p-5">
      <p className="font-display text-sm font-semibold">Para quem a gente faz</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {publicos.map((p) => (
          <li key={p} className="pilula !text-xs">
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <Botao href="#trabalhos" variante="escuro" className="!min-h-10 !px-4 !py-2 !text-xs">
          Ver trabalhos
        </Botao>
      </div>
    </CardVidro>
  );
}
