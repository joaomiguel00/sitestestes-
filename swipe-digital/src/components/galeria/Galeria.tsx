"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { filtros, type Projeto } from "@/content/projetos";
import { ease } from "@/config/motion";
import { CardProjeto } from "./CardProjeto";

/** Monta o bento: linhas alternando 2 e 3 cards; a última linha ocupa a largura toda. */
function layoutBento(n: number) {
  const linhas: number[] = [];
  let resta = n;
  let grande = true;
  while (resta > 0) {
    const t = Math.min(grande ? 2 : 3, resta);
    linhas.push(t);
    resta -= t;
    grande = !grande;
  }
  const spans: { col: string; altura: string }[] = [];
  linhas.forEach((t, li) => {
    const larguras = t === 1 ? [12] : t === 2 ? (li % 4 === 0 ? [7, 5] : [5, 7]) : [4, 4, 4];
    larguras.forEach((w) => {
      spans.push({
        col: { 12: "lg:col-span-12", 7: "lg:col-span-7", 5: "lg:col-span-5", 4: "lg:col-span-4" }[w]!,
        altura: w === 12 ? "aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]" : t === 3 ? "aspect-[4/3] lg:aspect-auto lg:h-[380px]" : "aspect-[4/3] lg:aspect-auto lg:h-[460px]",
      });
    });
  });
  return spans;
}

export function Galeria({ projetos, sincronizarUrl = false }: { projetos: Projeto[]; sincronizarUrl?: boolean }) {
  const [filtro, setFiltro] = useState("todos");
  const botoes = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!sincronizarUrl) return;
    const v = new URLSearchParams(window.location.search).get("servico");
    if (v && filtros.some((f) => f.valor === v)) setFiltro(v);
  }, [sincronizarUrl]);

  const escolher = (v: string) => {
    setFiltro(v);
    if (sincronizarUrl) {
      const url = new URL(window.location.href);
      if (v === "todos") url.searchParams.delete("servico");
      else url.searchParams.set("servico", v);
      window.history.replaceState(null, "", url);
    }
  };

  const servico = filtros.find((f) => f.valor === filtro)?.servico;
  const lista = servico ? projetos.filter((p) => p.servicos.includes(servico)) : projetos;
  const spans = layoutBento(lista.length);

  return (
    <div>
      <div
        role="toolbar"
        aria-label="Filtrar trabalhos por serviço"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
        onKeyDown={(e) => {
          const i = botoes.current.findIndex((b) => b === document.activeElement);
          if (i < 0) return;
          let n = -1;
          if (e.key === "ArrowRight") n = (i + 1) % filtros.length;
          if (e.key === "ArrowLeft") n = (i - 1 + filtros.length) % filtros.length;
          if (e.key === "Home") n = 0;
          if (e.key === "End") n = filtros.length - 1;
          if (n >= 0) {
            e.preventDefault();
            botoes.current[n]?.focus();
          }
        }}
      >
        {filtros.map((f, i) => {
          const ativo = f.valor === filtro;
          return (
            <button
              key={f.valor}
              ref={(el) => {
                botoes.current[i] = el;
              }}
              type="button"
              aria-pressed={ativo}
              tabIndex={ativo ? 0 : -1}
              onClick={() => escolher(f.valor)}
              className={`relative min-h-11 shrink-0 rounded-full border px-5 text-sm font-medium transition-colors ${
                ativo ? "border-roxo text-gelo" : "border-white/10 text-gelo/75 hover:border-white/25 hover:text-gelo"
              }`}
            >
              {ativo && (
                <motion.span
                  layoutId="filtro-ativo"
                  className="absolute inset-0 rounded-full bg-roxo"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{f.rotulo}</span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {lista.length} {lista.length === 1 ? "projeto" : "projetos"}
      </p>

      <LayoutGroup>
        <motion.ul layout className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12">
          <AnimatePresence mode="popLayout" initial={!sincronizarUrl}>
            {lista.map((p, i) => (
              <motion.li
                key={p.slug}
                layout
                className={`${spans[i].col} ${lista.length % 2 === 1 && i === lista.length - 1 ? "sm:col-span-2" : ""}`}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease }}
              >
                <CardProjeto projeto={p} altura={spans[i].altura} prioridade={sincronizarUrl && i < 2} nivelTitulo={sincronizarUrl ? "h2" : "h3"} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>

      {lista.length === 0 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 rounded-[28px] border border-dashed border-white/12 p-10 text-center text-cinza">
          Ainda não tem trabalho desse serviço por aqui. Em breve.
        </motion.p>
      )}
    </div>
  );
}
