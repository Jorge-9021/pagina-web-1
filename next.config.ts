import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "true";
const basePath = githubPages ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";

const nextConfig: NextConfig = {
  ...(githubPages
    ? {
        output: "export" as const,
        basePath,
        assetPrefix: basePath,
        images: { unoptimized: true },
        trailingSlash: true,
        // El starter incluye tipos exclusivos de Cloudflare que no forman
        // parte de la versión estática. La página se revisa con ESLint antes.
        typescript: { ignoreBuildErrors: true },
      }
    : {}),
};

export default nextConfig;
