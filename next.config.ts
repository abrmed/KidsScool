import type { NextConfig } from "next";

// Site 100 % statique (aucun serveur, aucune base de données) pour GitHub Pages.
// En ligne, le site vit sous /KidsScool (adresse abrmed.github.io/KidsScool).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
