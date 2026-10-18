"use client";

import { useEffect, useRef } from "react";
import { motionConfig } from "@/config/motion";
import { carregarGsap, useMenosMovimento } from "@/lib/hooks";

const texto = "A gente cria *site*, *conteúdo* e *anúncios* para o seu negócio aparecer bonito e ser lembrado por quem rola o feed.";

export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const menos = useMenosMovimento();

  useEffect(() => {
    if (menos || !motionConfig.manifestoAcendendo || !ref.current) return;
    const el = ref.current;
    let fim: (() => void) | undefined;
    let cancelado = false;
    carregarGsap().then(({ gsap }) => {
      if (cancelado) return;
      const ctx = gsap.context(() => {
        gsap.fromTo(
          el.querySelectorAll("[data-palavra]"),
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.5 },
          },
        );
      }, el);
      fim = () => ctx.revert();
    });
    return () => {
      cancelado = true;
      fim?.();
    };
  }, [menos]);

  return (
    <section id="sobre" className="relative z-10 px-4 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1100px]">
        <span className="pilula">
          <span className="h-1.5 w-1.5 rounded-full bg-roxo-claro" aria-hidden="true" />
          Sobre a Swipe
        </span>
        <p ref={ref} className="titulo mt-8 text-[1.9rem] leading-[1.12] sm:text-5xl lg:text-[4.2rem]">
          {texto.split(" ").map((p, i) => {
            const m = p.match(/^\*(.+)\*(.*)$/);
            return (
              <span key={i}>
                <span data-palavra className="inline-block">
                  {m ? (
                    <>
                      <span className="text-roxo-claro">{m[1]}</span>
                      {m[2]}
                    </>
                  ) : (
                    p
                  )}
                </span>{" "}
              </span>
            );
          })}
        </p>
        <p className="mt-8 max-w-xl text-base text-cinza sm:text-lg">
          Agência de marketing digital que cuida de site, conteúdo, vídeo e anúncios em um só lugar, para pequenos negócios que não
          têm tempo nem equipe de marketing.
        </p>
      </div>
    </section>
  );
}
