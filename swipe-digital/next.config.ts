import type { NextConfig } from "next";

// GITHUB_PAGES=1 gera o site estático (pasta out/) para o GitHub Pages.
// PAGES_BASE_PATH é a subpasta do site, ex.: "/sitestestes-".
const pages = process.env.GITHUB_PAGES === "1";
const basePath = pages ? (process.env.PAGES_BASE_PATH ?? "") : "";

const nextConfig: NextConfig = {
  ...(pages ? { output: "export" as const, trailingSlash: true, basePath } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: pages ? { unoptimized: true } : { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
