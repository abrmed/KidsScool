import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export const AVATARS = ["🦊", "🐼", "🐯", "🦁", "🐸", "🐙", "🦄", "🐲", "🐧", "🦉", "🐨", "🚀", "⚽", "🎮", "🎸", "🏀"];

export const DEGRADES_AVATAR = [
  "from-sky-400 to-blue-600",
  "from-rose-400 to-orange-500",
  "from-emerald-400 to-teal-600",
  "from-fuchsia-400 to-violet-600",
  "from-amber-300 to-orange-500",
];

export const couleurAvatar = (index: number) => DEGRADES_AVATAR[index % DEGRADES_AVATAR.length];

export const bouton =
  "inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl px-6 font-titre text-lg font-semibold transition hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50";
export const boutonPrincipal = `${bouton} bg-linear-to-r from-orange-500 via-pink-500 to-fuchsia-600 text-white shadow-lg shadow-pink-500/30`;
export const boutonSecondaire = `${bouton} bg-surface text-texte shadow-sm ring-2 ring-bordure hover:bg-primaire-doux`;
export const champ =
  "h-14 w-full rounded-2xl border-2 border-bordure bg-fond px-4 text-lg font-semibold outline-none transition focus:border-primaire focus:bg-surface focus:ring-4 focus:ring-primaire-doux";

export function Chargement() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <span className="animate-flotter text-6xl" role="status" aria-label="Chargement">
        🚀
      </span>
    </main>
  );
}

export function Page({ children, large = false }: { children: ReactNode; large?: boolean }) {
  return (
    <main className={`mx-auto flex min-h-screen flex-col gap-6 px-4 py-6 sm:px-8 sm:py-10 ${large ? "max-w-4xl" : "max-w-3xl"}`}>
      {children}
    </main>
  );
}

export function LienRetour({ href, children }: { href: ComponentProps<typeof Link>["href"]; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-11 w-fit items-center gap-2 rounded-2xl bg-surface px-4 text-sm font-bold shadow-sm ring-1 ring-bordure transition hover:bg-primaire-doux"
    >
      {children}
    </Link>
  );
}

export function Avatar({ emoji, index, taille = "md" }: { emoji: string; index: number; taille?: "md" | "lg" }) {
  const t = taille === "lg" ? "h-24 w-24 text-5xl rounded-[1.75rem]" : "h-14 w-14 text-3xl rounded-2xl";
  return (
    <span aria-hidden className={`flex shrink-0 items-center justify-center bg-linear-to-br shadow-md ${t} ${couleurAvatar(index)}`}>
      {emoji}
    </span>
  );
}
