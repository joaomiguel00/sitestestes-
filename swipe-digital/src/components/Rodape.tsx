import Link from "next/link";
import { site } from "@/config/site";
import { Logo } from "./Logo";
import { BotoesRedes } from "./Redes";

export function Rodape() {
  return (
    <footer className="relative z-10 border-t border-white/8 px-4 py-12 sm:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href="/" className="inline-block rounded-xl">
            <span aria-hidden="true">
              <Logo comSelo />
            </span>
            <span className="sr-only">Swipe Digital, página inicial</span>
          </Link>
          <p className="mt-5 max-w-xs text-sm text-cinza">Site, conteúdo, vídeo e anúncios. Tudo com a Swipe.</p>
        </div>
        <div className="flex flex-col gap-5 md:items-end">
          <BotoesRedes />
          <p className="text-sm text-cinza">{site.regiao}</p>
          <p className="text-xs text-cinza">© 2026 Swipe Digital</p>
        </div>
      </div>
    </footer>
  );
}
