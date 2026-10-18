type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const IconeInstagram = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);
export const IconeTiktok = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
    <path d="M14 3c.4 2.6 2.2 4.4 5 4.6" />
  </svg>
);
export const IconeWhatsapp = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M4 20l1.2-3.6A8 8 0 1 1 8 19z" />
    <path d="M9 9.2c0 3 2.6 5.6 5.6 5.8l1-1.3-2-1-.9.8a4 4 0 0 1-2.2-2.2l.8-.9-1-2-1.3 1z" />
  </svg>
);
export const IconeEmail = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="M4 7l8 6 8-6" />
  </svg>
);
export const IconeLinkedin = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M8 10.5V16M8 7.8v.1M12 16v-5.5M12 13c0-1.6 1-2.5 2.2-2.5S16 11.3 16 13v3" />
  </svg>
);
export const IconePlay = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
  </svg>
);
export const IconePause = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <rect x="6.5" y="5" width="4" height="14" rx="1" fill="currentColor" />
    <rect x="13.5" y="5" width="4" height="14" rx="1" fill="currentColor" />
  </svg>
);
export const IconeChevron = ({ className, dir = "dir" }: P & { dir?: "esq" | "dir" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base} strokeWidth={2.2}>
    <path d={dir === "dir" ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"} />
  </svg>
);
