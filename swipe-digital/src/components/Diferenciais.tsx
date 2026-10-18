import { diferenciais } from "@/content/textos";
import { CardVidro } from "./CardVidro";
import { Revelar, TituloSecao } from "./Revelar";

const icones = [
  // tudo em um
  <path key="a" d="M4 7h16M4 12h16M4 17h10" />,
  // demonstração
  <path key="b" d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6zM12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
  // atendimento
  <path key="c" d="M5 18l1-3.2A7 7 0 1 1 9 17.5zM9 11h.01M12 11h.01M15 11h.01" />,
  // velocidade
  <path key="d" d="M13 3L5 13h6l-1 8 8-10h-6z" />,
];

export function Diferenciais() {
  return (
    <section id="por-que" className="relative z-10 overflow-x-clip px-4 py-24 sm:px-8 sm:py-32">
      <div className="halo top-1/3 -right-40 h-[480px] w-[480px] opacity-40" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1400px]">
        <TituloSecao pilula="Por que a Swipe" titulo="Marketing que faz o cliente parar e olhar." />
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {diferenciais.map((d, i) => (
            <li key={d.titulo}>
              <Revelar atraso={i * 0.08} className="h-full">
                <CardVidro className="flex h-full flex-col gap-10 p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-roxo/15 text-roxo-claro ring-1 ring-roxo/30">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {icones[i]}
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-extrabold tracking-[-0.03em]">{d.titulo}</h3>
                    <p className="mt-2 text-cinza">{d.texto}</p>
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
