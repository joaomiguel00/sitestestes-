"use client";

import { motion } from "motion/react";
import { ease, motionConfig } from "@/config/motion";

/** Aparece subindo suavemente quando entra na tela. */
export function Revelar({
  children,
  atraso = 0,
  className,
  y = 28,
}: {
  children: React.ReactNode;
  atraso?: number;
  className?: string;
  y?: number;
}) {
  if (!motionConfig.entradaDosCards) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, delay: atraso, ease }}
    >
      {children}
    </motion.div>
  );
}

export function TituloSecao({
  pilula,
  titulo,
  texto,
  className,
  nivel = "h2",
}: {
  pilula: string;
  titulo: React.ReactNode;
  texto?: string;
  className?: string;
  nivel?: "h1" | "h2";
}) {
  const H = nivel;
  return (
    <Revelar className={className}>
      <span className="pilula">
        <span className="h-1.5 w-1.5 rounded-full bg-roxo-claro" aria-hidden="true" />
        {pilula}
      </span>
      <H className="titulo mt-5 text-[2rem] sm:text-5xl lg:text-6xl">{titulo}</H>
      {texto && <p className="mt-4 max-w-xl text-base text-cinza sm:text-lg">{texto}</p>}
    </Revelar>
  );
}
