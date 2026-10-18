import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ViewTransitions } from "next-view-transitions";
import { Abertura, scriptAbertura } from "@/components/Abertura";
import { Cursor } from "@/components/Cursor";
import { Header } from "@/components/Header";
import { Moldura } from "@/components/Moldura";
import { Providers } from "@/components/Providers";
import { Rodape } from "@/components/Rodape";
import { site } from "@/config/site";
import "./globals.css";

// Fontes do Google (Unbounded e Space Grotesk) hospedadas no próprio projeto.
const unbounded = localFont({
  src: [
    { path: "../fonts/unbounded-600.woff2", weight: "600" },
    { path: "../fonts/unbounded-800.woff2", weight: "800" },
  ],
  variable: "--font-unbounded",
  display: "swap",
});
const spaceGrotesk = localFont({
  src: [
    { path: "../fonts/spacegrotesk-400.woff2", weight: "400" },
    { path: "../fonts/spacegrotesk-500.woff2", weight: "500" },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Swipe Digital · Seu negócio no feed de quem compra", template: "%s · Swipe Digital" },
  description: site.descricao,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.nome,
    title: "Swipe Digital · Seu negócio no feed de quem compra",
    description: site.descricao,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0E0E10",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <html lang="pt-BR" className={`${unbounded.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{ __html: scriptAbertura }} />
        </head>
        <body>
          <a href="#conteudo" className="sr-only z-[90] rounded-full bg-roxo px-5 py-3 focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
            Pular para o conteúdo
          </a>
          <Abertura />
          <Providers>
            <Header />
            <main id="conteudo" className="overflow-x-clip">{children}</main>
            <Rodape />
          </Providers>
          <Moldura />
          <Cursor />
        </body>
      </html>
    </ViewTransitions>
  );
}
