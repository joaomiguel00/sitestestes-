import { linkWhatsapp, site } from "@/config/site";
import { Botao } from "./Botao";
import { IconeEmail, IconeInstagram, IconeWhatsapp } from "./Icones";
import { Revelar } from "./Revelar";
import { SetaIcone } from "./Seta";

export function Contato() {
  const canais = [
    { rotulo: "WhatsApp", valor: site.contato.whatsappExibicao, href: linkWhatsapp(), Icone: IconeWhatsapp, externo: true },
    { rotulo: "E-mail", valor: site.contato.email, href: `mailto:${site.contato.email}`, Icone: IconeEmail, externo: false },
    { rotulo: "Instagram", valor: site.redes.instagram.usuario, href: site.redes.instagram.url, Icone: IconeInstagram, externo: true },
  ];
  return (
    <section id="contato" className="relative z-10 overflow-hidden px-4 py-24 sm:px-8 sm:py-32">
      <span
        className="vazado pointer-events-none absolute inset-x-0 bottom-0 text-center font-display text-[34vw] leading-[0.8] font-extrabold tracking-[-0.08em] select-none"
        aria-hidden="true"
      >
        swipe
      </span>
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[32px] bg-roxo p-6 sm:p-12 lg:p-16">
        <div className="halo -top-24 -right-24 h-96 w-96 !bg-[radial-gradient(circle,rgba(239,230,255,0.35),transparent_70%)]" aria-hidden="true" />
        <Revelar className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-preto/25 px-4 py-1.5 text-sm text-lilas">Contato</span>
          <h2 className="titulo mt-6 text-[2.3rem] sm:text-6xl lg:text-7xl">
            Gostou do que viu?
            <br />
            Bora conversar.
          </h2>
          <p className="mt-5 max-w-lg text-lg text-lilas">Conta pra gente sobre o seu negócio. Sem compromisso.</p>
        </Revelar>
        <ul className="relative mt-10 grid gap-3 sm:grid-cols-3">
          {canais.map(({ rotulo, valor, href, Icone, externo }) => (
            <li key={rotulo} className="min-w-0">
              <a
                href={href}
                {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex h-full items-center gap-4 rounded-[22px] bg-preto/30 p-4 ring-1 ring-white/10 transition-colors hover:bg-preto/50 sm:p-5"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gelo text-roxo">
                  <Icone className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-lilas">{rotulo}</span>
                  <span className="block truncate font-display text-sm font-semibold">{valor}</span>
                </span>
                <SetaIcone className="h-5 w-5 shrink-0 text-lilas transition-transform group-hover:translate-x-1" />
              </a>
            </li>
          ))}
        </ul>
        <div className="relative mt-8">
          <Botao href={linkWhatsapp()} externo variante="escuro" className="!border-white/20 !bg-preto/40">
            Chamar no WhatsApp
          </Botao>
        </div>
      </div>
    </section>
  );
}
