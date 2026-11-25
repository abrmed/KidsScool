import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KidsSchool",
  description: "Anglais, français et mathématiques en mode jeu, pour la 2e secondaire",
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icone.svg` },
  applicationName: "KidsSchool",
  appleWebApp: { capable: true, title: "KidsSchool", statusBarStyle: "default" },
  robots: { index: false, follow: false }, // application privée : pas dans Google
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6d4aff" },
    { media: "(prefers-color-scheme: dark)", color: "#120f24" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr-CA">
      <body className="antialiased">{children}</body>
    </html>
  );
}
