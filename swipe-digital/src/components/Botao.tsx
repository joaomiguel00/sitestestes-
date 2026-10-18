import Link from "next/link";
import { Magnetico } from "./Magnetico";
import { SetaIcone } from "./Seta";

type Props = {
  href: string;
  children: React.ReactNode;
  variante?: "roxo" | "escuro";
  externo?: boolean;
  className?: string;
  seta?: boolean;
};

export function Botao({ href, children, variante = "roxo", externo, className, seta = true }: Props) {
  const estilo =
    variante === "roxo"
      ? "bg-roxo text-gelo shadow-[0_0_30px_-6px_rgba(123,47,247,0.75)] hover:shadow-[0_0_48px_-4px_rgba(123,47,247,0.95)]"
      : "border border-white/12 bg-white/[0.04] text-gelo hover:bg-white/[0.08]";
  const classes = `group inline-flex min-h-12 items-center gap-2.5 rounded-full px-6 py-3 font-display text-sm font-semibold transition-[box-shadow,background-color] duration-300 ${estilo} ${className ?? ""}`;
  const conteudo = (
    <>
      {children}
      {seta && <SetaIcone className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
    </>
  );
  return (
    <Magnetico>
      {externo ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {conteudo}
        </a>
      ) : (
        <Link href={href} className={classes}>
          {conteudo}
        </Link>
      )}
    </Magnetico>
  );
}
