import { Bento } from "@/components/Bento";
import { Botao } from "@/components/Botao";
import { Contato } from "@/components/Contato";
import { Diferenciais } from "@/components/Diferenciais";
import { Equipe } from "@/components/Equipe";
import { Etapas } from "@/components/Etapas";
import { Galeria } from "@/components/galeria/Galeria";
import { Hero } from "@/components/hero/Hero";
import { TracosNeon } from "@/components/hero/TracosNeon";
import { Letreiro } from "@/components/Letreiro";
import { Manifesto } from "@/components/Manifesto";
import { TituloSecao } from "@/components/Revelar";
import { Servicos } from "@/components/Servicos";
import { SetaSeparador } from "@/components/Seta";
import { projetosEmDestaque } from "@/content/projetos";

export default function Home() {
  return (
    <>
      <div className="relative">
        <TracosNeon />
        <Hero />
        <Letreiro />
        <Manifesto />
      </div>
      <Bento />

      <section id="trabalhos" className="relative z-10 px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <TituloSecao pilula="Trabalhos" titulo="O que a gente já criou" texto="Os trabalhos falam mais que a gente. Filtre por serviço." />
          </div>
          <div className="mt-10">
            <Galeria projetos={projetosEmDestaque} />
          </div>
          <div className="mt-10 flex justify-center">
            <Botao href="/trabalhos">Ver todos os trabalhos</Botao>
          </div>
        </div>
      </section>

      <Servicos />
      <Diferenciais />
      <SetaSeparador className="mx-auto max-w-[1400px] px-4 sm:px-8" />
      <Etapas />
      <Equipe />
      <Contato />
    </>
  );
}
