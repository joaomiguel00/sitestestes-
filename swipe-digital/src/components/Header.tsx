"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { Logo } from "./Logo";
import { SetaIcone } from "./Seta";
import { ease } from "@/config/motion";
import { linkWhatsapp, site } from "@/config/site";
import { basePath } from "@/lib/caminho";

const itens = [
  { id: "trabalhos", rotulo: "Trabalhos" },
  { id: "servicos", rotulo: "Serviços" },
  { id: "sobre", rotulo: "Sobre" },
  { id: "contato", rotulo: "Contato" },
];

function BarraProgresso() {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const x = useTransform(p, (v) => `calc(${v * 100}vw - 10px)`);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[3px]" aria-hidden="true">
      <motion.div className="h-full origin-left bg-roxo shadow-[0_0_12px_rgba(123,47,247,0.9)]" style={{ scaleX: p }} />
      <motion.svg viewBox="0 0 12 12" className="absolute -top-[4.5px] h-3 w-3 text-roxo-claro" style={{ x }}>
        <polyline points="3,2 9,6 3,10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const naHome = pathname === "/";
  const [ativo, setAtivo] = useState<string | null>(naHome ? null : "trabalhos");
  const [aberto, setAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!naHome) {
      setAtivo(pathname.startsWith("/trabalhos") ? "trabalhos" : null);
      return;
    }
    // Seções fora do menu acendem o item mais próximo.
    const apelidos: Record<string, string> = { "por-que": "servicos", "como-trabalhamos": "sobre", "quem-faz": "sobre" };
    const ids = [...itens.map((i) => i.id), ...Object.keys(apelidos)];
    const secoes = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) setAtivo(apelidos[e.target.id] ?? e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    secoes.forEach((s) => obs.observe(s));
    const noTopo = () => {
      if (window.scrollY < 200) setAtivo(null);
    };
    window.addEventListener("scroll", noTopo, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", noTopo);
    };
  }, [naHome, pathname]);

  useEffect(() => {
    const ver = () => setRolou(window.scrollY > 24);
    ver();
    window.addEventListener("scroll", ver, { passive: true });
    return () => window.removeEventListener("scroll", ver);
  }, []);

  useEffect(() => {
    if (aberto) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = aberto ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [aberto, lenis]);

  const href = (id: string) => (naHome ? `#${id}` : `${basePath}/#${id}`);

  return (
    <>
      <BarraProgresso />
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 pb-4 sm:px-8 sm:pt-6">
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-[150%] bg-gradient-to-b from-preto from-40% via-preto/75 to-transparent transition-opacity duration-500 ${rolou && !aberto ? "opacity-100" : "opacity-0"}`}
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          <Link href="/" className="rounded-xl p-1">
            <span aria-hidden="true">
              <Logo />
            </span>
            <span className="sr-only">Swipe Digital, página inicial</span>
          </Link>

          <nav aria-label="Principal" className="hidden md:block">
            <ul className="vidro flex items-center gap-1 !rounded-full p-1.5">
              {itens.map((i) => (
                <li key={i.id}>
                  <a
                    href={href(i.id)}
                    onClick={() => setAtivo(i.id)}
                    aria-current={ativo === i.id ? "true" : undefined}
                    className="relative block rounded-full px-5 py-2.5 text-sm font-medium text-gelo/80 transition-colors hover:text-gelo"
                  >
                    {ativo === i.id && (
                      <motion.span
                        layoutId="nav-ativo"
                        className="absolute inset-0 rounded-full bg-roxo shadow-[0_0_24px_-4px_rgba(123,47,247,0.9)]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className={`relative ${ativo === i.id ? "text-gelo" : ""}`}>{i.rotulo}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href={href("contato")}
            className="hidden min-h-11 items-center gap-2 rounded-full bg-roxo px-5 font-display text-sm font-semibold shadow-[0_0_30px_-6px_rgba(123,47,247,0.8)] md:inline-flex"
          >
            Contato <SetaIcone className="h-4 w-4" />
          </a>

          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-roxo px-5 font-display text-sm font-semibold md:hidden"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? "Fechar" : "Menu"}
            <span className="relative flex h-3 w-4 flex-col justify-between" aria-hidden="true">
              <span className={`h-0.5 w-full rounded bg-gelo transition-transform ${aberto ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`h-0.5 w-full rounded bg-gelo transition-transform ${aberto ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {aberto && (
          <motion.div
            id="menu-celular"
            className="fixed inset-0 z-40 flex flex-col bg-preto/95 px-6 pt-28 pb-10 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="halo -top-20 -right-20 h-80 w-80" />
            <nav aria-label="Menu do celular">
              <ul className="space-y-2">
                {itens.map((i, n) => (
                  <motion.li
                    key={i.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * n + 0.05, duration: 0.45, ease }}
                  >
                    <a
                      href={href(i.id)}
                      onClick={() => setAberto(false)}
                      className="flex items-center justify-between border-b border-white/8 py-4 font-display text-4xl font-extrabold tracking-[-0.04em]"
                    >
                      {i.rotulo}
                      <SetaIcone className="h-7 w-7 text-roxo-claro" />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div
              className="mt-auto space-y-2 text-cinza"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <a href={linkWhatsapp()} target="_blank" rel="noopener noreferrer" className="block text-gelo">
                WhatsApp {site.contato.whatsappExibicao}
              </a>
              <a href={`mailto:${site.contato.email}`} className="block">
                {site.contato.email}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
