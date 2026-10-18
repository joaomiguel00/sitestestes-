// Prefixo do site quando ele roda numa subpasta (ex.: GitHub Pages em /sitestestes-).
// Fica vazio na Vercel ou em domínio próprio.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Caminho de imagem/vídeo de public/ com o prefixo do site. */
export function midia(src: string) {
  return src.startsWith("/") ? `${basePath}${src}` : src;
}
