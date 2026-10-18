"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { useRef, useState } from "react";
import type { Projeto } from "@/content/projetos";
import { usePonteiroFino } from "@/lib/hooks";
import { IconePause, IconePlay } from "../Icones";
import { EtiquetaConceito, nomeTransicao } from "./comum";
import { midia } from "@/lib/caminho";

export function CardProjeto({
  projeto: p,
  altura,
  prioridade,
  nivelTitulo = "h3",
}: {
  projeto: Projeto;
  altura: string;
  prioridade?: boolean;
  nivelTitulo?: "h2" | "h3";
}) {
  const Titulo = nivelTitulo;
  const video = useRef<HTMLVideoElement>(null);
  const [tocando, setTocando] = useState(false);
  const fino = usePonteiroFino();

  const tocar = () => {
    const v = video.current;
    if (!v) return;
    v.play().then(() => setTocando(true)).catch(() => {});
  };
  const parar = () => {
    video.current?.pause();
    setTocando(false);
  };

  return (
    <article
      className="group relative h-full overflow-hidden rounded-[28px] border border-white/8 bg-grafite"
      onMouseEnter={() => fino && p.video && tocar()}
      onMouseLeave={() => fino && p.video && parar()}
    >
      <Link href={`/trabalhos/${p.slug}`} className="block h-full rounded-[28px]" data-cursor="ver">
        <div className={`relative overflow-hidden ${altura}`}>
          <Image
            src={midia(p.capa)}
            alt={`Capa do projeto ${p.titulo}`}
            fill
            priority={prioridade}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            style={{ viewTransitionName: nomeTransicao(p.slug) }}
          />
          {p.video && (
            <video
              ref={video}
              src={midia(p.video)}
              muted
              loop
              playsInline
              preload="none"
              poster={midia(p.capa)}
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${tocando ? "opacity-100" : "opacity-0"}`}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-preto/90 via-preto/10 to-transparent" aria-hidden="true" />
          {p.tipo === "conceito" && <EtiquetaConceito className="absolute top-4 left-4" />}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <p className="text-sm text-cinza">{p.segmento}</p>
          <Titulo className="mt-1 font-display text-xl font-extrabold tracking-[-0.04em] sm:text-2xl">{p.titulo}</Titulo>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {p.servicos.map((s) => (
              <li key={s} className="rounded-full bg-roxo/90 px-3 py-1 text-xs font-medium text-lilas">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </Link>
      {p.video && (
        <button
          type="button"
          onClick={() => (tocando ? parar() : tocar())}
          className="absolute top-4 right-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-preto/70 text-gelo ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-roxo"
          aria-label={tocando ? `Pausar vídeo de ${p.titulo}` : `Tocar vídeo de ${p.titulo}`}
          aria-pressed={tocando}
        >
          {tocando ? <IconePause className="h-4 w-4" /> : <IconePlay className="ml-0.5 h-4 w-4" />}
        </button>
      )}
    </article>
  );
}
