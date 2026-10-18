import { site } from "@/config/site";
import { linkWhatsapp } from "@/config/site";
import { IconeInstagram, IconeLinkedin, IconeTiktok, IconeWhatsapp } from "./Icones";

export function listaRedes() {
  const r: { nome: string; url: string; Icone: (p: { className?: string }) => React.JSX.Element }[] = [];
  if (site.redes.instagram.url) r.push({ nome: "Instagram", url: site.redes.instagram.url, Icone: IconeInstagram });
  if (site.redes.tiktok.url) r.push({ nome: "TikTok", url: site.redes.tiktok.url, Icone: IconeTiktok });
  r.push({ nome: "WhatsApp", url: linkWhatsapp(), Icone: IconeWhatsapp });
  if (site.redes.linkedin.url) r.push({ nome: "LinkedIn", url: site.redes.linkedin.url, Icone: IconeLinkedin });
  return r;
}

export function BotoesRedes({ className }: { className?: string }) {
  return (
    <ul className={`flex gap-2.5 ${className ?? ""}`}>
      {listaRedes().map(({ nome, url, Icone }) => (
        <li key={nome}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={nome}
            className="vidro grid h-11 w-11 place-items-center !rounded-full text-gelo/85 transition-colors hover:bg-roxo hover:text-gelo"
          >
            <Icone className="h-[18px] w-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
