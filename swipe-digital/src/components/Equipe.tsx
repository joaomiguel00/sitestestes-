import Image from "next/image";
import { equipe } from "@/content/textos";
import { CardVidro } from "./CardVidro";
import { Revelar, TituloSecao } from "./Revelar";

export function Iniciais({ nome, foto, tamanho = "lg" }: { nome: string; foto?: string; tamanho?: "sm" | "lg" }) {
  const classe = tamanho === "lg" ? "h-24 w-24 text-3xl" : "h-11 w-11 text-sm";
  if (foto)
    return (
      <span className={`relative block shrink-0 overflow-hidden rounded-full ring-2 ring-roxo/60 ${classe}`}>
        <Image src={foto} alt={`Foto de ${nome}`} fill sizes="96px" className="object-cover" />
      </span>
    );
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-roxo font-display font-extrabold tracking-[-0.04em] text-lilas shadow-[0_0_30px_-6px_rgba(123,47,247,0.8)] ${classe}`}
      aria-hidden="true"
    >
      {nome.slice(0, 1)}
    </span>
  );
}

export function Equipe() {
  return (
    <section id="quem-faz" className="relative z-10 px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        <TituloSecao pilula="Quem faz" titulo="Três especialistas, um time só." texto="Cada sócio cuida de uma parte. Você fala com a gente e a gente resolve o resto." />
        <ul className="mt-12 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {equipe.map((p, i) => (
            <li key={p.nome}>
              <Revelar atraso={i * 0.1} className="h-full">
                <CardVidro className="flex h-full flex-col items-start gap-8 p-6 sm:p-8">
                  <Iniciais nome={p.nome} foto={p.foto} />
                  <div>
                    <h3 className="font-display text-2xl font-extrabold tracking-[-0.04em]">{p.nome}</h3>
                    <p className="mt-1.5 text-cinza">{p.funcao}</p>
                  </div>
                </CardVidro>
              </Revelar>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
