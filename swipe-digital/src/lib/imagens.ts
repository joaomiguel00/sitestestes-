import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

/** Lê largura e altura reais de uma imagem em public/ (evita pulo de layout). */
export function dimensoes(src: string) {
  try {
    const { width, height } = imageSize(readFileSync(path.join(process.cwd(), "public", src)));
    if (width && height) return { width, height };
  } catch {}
  return { width: 1600, height: 1200 };
}
