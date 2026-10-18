"use client";

import { useEffect, useState } from "react";

/** true só em computador com mouse (sem toque). */
export function usePonteiroFino() {
  const [fino, setFino] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const atualizar = () => setFino(mq.matches);
    atualizar();
    mq.addEventListener("change", atualizar);
    return () => mq.removeEventListener("change", atualizar);
  }, []);
  return fino;
}

/** "Reduzir movimento" do aparelho. É false até montar, para o HTML do servidor bater com o do cliente. */
export function useMenosMovimento() {
  const [menos, setMenos] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const atualizar = () => setMenos(mq.matches);
    atualizar();
    mq.addEventListener("change", atualizar);
    return () => mq.removeEventListener("change", atualizar);
  }, []);
  return menos;
}

/** Carrega GSAP + ScrollTrigger sob demanda (import dinâmico). */
export async function carregarGsap() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}
