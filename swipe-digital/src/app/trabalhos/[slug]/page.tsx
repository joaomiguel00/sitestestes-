import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import { Botao } from "@/components/Botao";
import { Contato } from "@/components/Contato";
import { EtiquetaConceito, nomeTransicao } from "@/components/galeria/comum";
import { Revelar } from "@/components/Revelar";
import { SetaIcone } from "@/components/Seta";
import { isVideo, projetos } from "@/content/projetos";
import { dimensoes } from "@/lib/imagens";
import { basePath, midia } from "@/lib/caminho";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projetos.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = projetos.find((x) => x.slug === slug);
  if (!p) return {};
  const descricao = `${p.segmento} · ${p.servicos.join(", ")}. ${p.desafio}`;
  return {
    title: p.titulo,
    description: descricao,
    alternates: { canonical: `${basePath}/trabalhos/${p.slug}` },
    openGraph: { title: `${p.titulo} · Swipe Digital`, description: descricao, images: [{ url: midia(p.capa) }] },
  };
}

export default async function PaginaProjeto({ params }: Params) {
  const { slug } = await params;
  const i = projetos.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = projetos[i];
  const anterior = projetos[(i - 1 + projetos.length) % projetos.length];
  const proximo = projetos[(i + 1) % projetos.length];

  return (
    <>
      <article className="relative z-10 px-4 pt-28 sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-[1400px]">
          <Link href="/trabalhos" className="inline-flex items-center gap-2 rounded-full text-sm text-cinza hover:text-gelo">
            <SetaIcone className="h-4 w-4 -scale-x-100" /> Todos os trabalhos
          </Link>

          <div className="relative mt-6 overflow-hidden rounded-[32px] border border-white/8">
            <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
              <Image src={midia(p.capa)} alt={`Capa do projeto ${p.titulo}`} fill priority sizes="100vw" className="object-cover" style={{ viewTransitionName: nomeTransicao(p.slug) }} />
              <div className="absolute inset-0 bg-gradient-to-t from-preto/90 via-transparent to-transparent" aria-hidden="true" />
            </div>
            {p.tipo === "conceito" && <EtiquetaConceito className="absolute top-5 left-5" />}
          </div>

          <header className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-cinza">{p.segmento}</p>
              <h1 className="titulo mt-2 text-[2.2rem] sm:text-6xl">{p.titulo}</h1>
            </div>
            <ul className="flex flex-wrap gap-2 lg:justify-end">
              {p.servicos.map((s) => (
                <li key={s} className="rounded-full bg-roxo px-4 py-1.5 text-sm font-medium text-lilas">
                  {s}
                </li>
              ))}
            </ul>
          </header>

          <div className="mt-12 grid gap-3 sm:gap-4 md:grid-cols-2">
            <Revelar>
              <section className="painel h-full p-6 sm:p-8" aria-labelledby="desafio">
                <h2 id="desafio" className="font-display text-sm font-semibold tracking-wide text-roxo-claro uppercase">
                  O desafio
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-gelo/90 sm:text-xl">{p.desafio}</p>
              </section>
            </Revelar>
            <Revelar atraso={0.1}>
              <section className="painel h-full p-6 sm:p-8" aria-labelledby="fizemos">
                <h2 id="fizemos" className="font-display text-sm font-semibold tracking-wide text-roxo-claro uppercase">
                  O que fizemos
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-gelo/90 sm:text-xl">{p.solucao}</p>
                {p.link && (
                  <div className="mt-6">
                    <Botao href={p.link} externo variante="escuro">
                      Ver o site no ar
                    </Botao>
                  </div>
                )}
              </section>
            </Revelar>
          </div>

          <section className="mt-16" aria-labelledby="galeria-projeto">
            <h2 id="galeria-projeto" className="titulo text-3xl sm:text-4xl">
              Galeria do projeto
            </h2>
            <div className="mt-8 columns-1 gap-3 sm:columns-2 sm:gap-4 lg:columns-3">
              {p.video && (
                <Revelar className="mb-3 break-inside-avoid sm:mb-4">
                  <video src={midia(p.video)} poster={midia(p.capa)} controls muted loop playsInline preload="none" className="w-full rounded-[24px] border border-white/8 bg-grafite">
                    Vídeo do projeto {p.titulo}
                  </video>
                </Revelar>
              )}
              {p.galeria.map((src, n) => (
                <Revelar key={src} className="mb-3 break-inside-avoid sm:mb-4" atraso={(n % 3) * 0.08}>
                  {isVideo(src) ? (
                    <video src={midia(src)} poster={midia(p.capa)} controls muted loop playsInline preload="none" className="w-full rounded-[24px] border border-white/8 bg-grafite" />
                  ) : (
                    <Image
                      src={midia(src)}
                      alt={`${p.titulo}: imagem ${n + 1} da galeria`}
                      {...dimensoes(src)}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="h-auto w-full rounded-[24px] border border-white/8"
                    />
                  )}
                </Revelar>
              ))}
            </div>
          </section>

          <nav aria-label="Outros projetos" className="mt-20 grid gap-3 sm:grid-cols-2 sm:gap-4">
            {[
              { rotulo: "Projeto anterior", proj: anterior, esq: true },
              { rotulo: "Próximo projeto", proj: proximo, esq: false },
            ].map(({ rotulo, proj, esq }) => (
              <Link
                key={rotulo}
                href={`/trabalhos/${proj.slug}`}
                className={`group vidro flex items-center gap-4 p-4 sm:p-5 ${esq ? "" : "sm:flex-row-reverse sm:text-right"}`}
              >
                <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-2xl">
                  <Image src={midia(proj.capa)} alt="" fill sizes="80px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-cinza">{rotulo}</span>
                  <span className="block truncate font-display font-semibold">{proj.titulo}</span>
                </span>
                <SetaIcone className={`h-5 w-5 shrink-0 text-roxo-claro transition-transform ${esq ? "-scale-x-100 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
              </Link>
            ))}
          </nav>
        </div>
      </article>
      <Contato />
    </>
  );
}
