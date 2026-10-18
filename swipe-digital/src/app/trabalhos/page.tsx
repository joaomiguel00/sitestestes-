import type { Metadata } from "next";
import { Galeria } from "@/components/galeria/Galeria";
import { TituloSecao } from "@/components/Revelar";
import { Contato } from "@/components/Contato";
import { projetos } from "@/content/projetos";

export const metadata: Metadata = {
  title: "Trabalhos",
  description: "Portfólio da Swipe Digital: sites, posts, vídeos com IA e tráfego pago para pequenos negócios.",
  alternates: { canonical: "/trabalhos" },
};

export default function Trabalhos() {
  return (
    <>
      <section className="relative z-10 px-4 pt-32 pb-16 sm:px-8 sm:pt-40">
        <div className="halo -top-40 left-1/3 h-[420px] w-[420px] opacity-40" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1400px]">
          <TituloSecao nivel="h1" pilula="Portfólio" titulo={<>Todos os trabalhos</>} texto="Site, posts, vídeos e anúncios. Escolha um serviço para filtrar." />
          <div className="mt-10">
            <Galeria projetos={projetos} sincronizarUrl />
          </div>
        </div>
      </section>
      <Contato />
    </>
  );
}
