import { SetaSublinhado } from "./Seta";

export function Logo({ comSelo = false, desenhar = false, className }: { comSelo?: boolean; desenhar?: boolean; className?: string }) {
  return (
    <span className={`inline-flex flex-col items-start ${className ?? ""}`}>
      <span className="font-display text-[1.6rem] leading-none font-extrabold tracking-[-0.07em] text-gelo">swipe</span>
      <SetaSublinhado className="-mt-0.5 h-[0.55rem] w-[5.4rem]" desenhar={desenhar} atraso={0.2} />
      {comSelo && (
        <span className="mt-1.5 rounded-lg bg-gelo px-2.5 py-0.5 font-display text-[0.6rem] font-semibold tracking-[0.4em] text-roxo">
          DIGITAL
        </span>
      )}
    </span>
  );
}
