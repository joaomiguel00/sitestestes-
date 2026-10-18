import { motionConfig } from "@/config/motion";

export function EtiquetaConceito({ className }: { className?: string }) {
  return (
    <span className={`rounded-full border border-white/15 bg-preto/70 px-2.5 py-1 text-[11px] font-medium text-cinza backdrop-blur ${className ?? ""}`}>
      Projeto conceito
    </span>
  );
}

export function nomeTransicao(slug: string) {
  return motionConfig.transicaoCapa ? `capa-${slug}` : undefined;
}
