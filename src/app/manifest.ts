import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const dynamic = "force-static";

// Fiche d'installation de l'application (PWA) : nom, couleurs, icône.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KidsSchool",
    short_name: "KidsSchool",
    description: "Anglais, français et mathématiques en mode jeu",
    start_url: `${base}/`,
    scope: `${base}/`,
    display: "standalone",
    background_color: "#f4f1ff",
    theme_color: "#6d4aff",
    lang: "fr-CA",
    icons: [{ src: `${base}/icone.svg`, sizes: "any", type: "image/svg+xml" }],
  };
}
