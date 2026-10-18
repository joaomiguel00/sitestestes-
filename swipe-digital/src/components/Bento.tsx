import Image from "next/image";
import { site } from "@/config/site";
import { equipe, fraseSocio } from "@/content/textos";
import { Botao } from "./Botao";
import { CardVidro } from "./CardVidro";
import { Iniciais } from "./Equipe";
import { Revelar } from "./Revelar";

export function Bento() {
  const socio = equipe.find((e) => e.nome === fraseSocio.nome) ?? equipe[0];
  return (
    <section className="relative z-10 px-4 pb-24 sm:px-8 sm:pb-32" aria-label="A Swipe em resumo">
      <div className="mx-auto grid max-w-[1400px] gap-3 sm:gap-4 lg:grid-cols-12">
        {/* Card grande: disponível + base */}
        <Revelar className="lg:col-span-7 lg:row-span-2">
          <CardVidro className="h-full overflow-hidden p-0" glow>
            <div className="relative h-full min-h-[420px]">
              <Image
                src="/bastidores.jpg"
                alt="Foto da equipe da Swipe Digital (imagem de exemplo)"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover opacity-45 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-preto via-roxo/30 to-roxo/20 mix-blend-multiply" aria-hidden="true" />
              <div className="absolute inset-0 bg-gradient-to-t from-preto/95 via-preto/30 to-transparent" aria-hidden="true" />
              <div className="relative flex h-full min-h-[420px] flex-col justify-between p-6 sm:p-8">
                <span className="pilula self-start bg-preto/60">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="animate-pulsar absolute inset-0 rounded-full bg-limao" />
                    <span className="relative h-2 w-2 rounded-full bg-limao" />
                  </span>
                  Disponível para novos projetos
                </span>
                <div>
                  <p className="titulo text-3xl sm:text-5xl">
                    Base em <span className="text-roxo-claro">{site.cidade}</span>
                  </p>
                  <p className="mt-3 max-w-md text-cinza">{site.regiao}</p>
                  <div className="mt-6">
                    <Botao href="#contato">Bora conversar</Botao>
                  </div>
                </div>
              </div>
            </div>
          </CardVidro>
        </Revelar>

        {/* 4 em 1 */}
        <Revelar className="lg:col-span-5" atraso={0.1}>
          <CardVidro className="flex h-full flex-col justify-between gap-6 p-6 sm:p-8">
            <p className="titulo text-7xl text-gelo sm:text-8xl">
              4<span className="text-roxo-claro"> em </span>1
            </p>
            <p className="max-w-xs text-lg text-gelo/80">site, posts, vídeos e anúncios com um time só</p>
          </CardVidro>
        </Revelar>

        {/* Quem faz: frase de um sócio */}
        <Revelar className="lg:col-span-5" atraso={0.2}>
          <CardVidro className="flex h-full flex-col justify-between gap-6 p-6 sm:p-8">
            <span className="pilula self-start">Quem faz</span>
            <blockquote className="text-xl leading-snug text-gelo sm:text-2xl">“{fraseSocio.frase}”</blockquote>
            <div className="flex items-center gap-3">
              <Iniciais nome={socio.nome} foto={socio.foto} tamanho="sm" />
              <div>
                <p className="font-display text-sm font-semibold">{socio.nome}</p>
                <p className="text-sm text-cinza">{socio.funcao}</p>
              </div>
            </div>
          </CardVidro>
        </Revelar>
      </div>
    </section>
  );
}
