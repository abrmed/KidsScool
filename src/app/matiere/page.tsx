"use client";
// Chemin d'apprentissage d'une matière (style Duolingo) : unités et 5 niveaux à débloquer.
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Chargement, LienRetour, Page } from "@/components/ui";
import { NIVEAUX, trouverMatiere } from "@/contenu";
import { NOMS_NIVEAUX } from "@/contenu/types";
import { useDonnees } from "@/lib/stockage";

const BANNIERES = {
  bleu: "from-sky-500 to-blue-700",
  corail: "from-rose-500 to-orange-500",
  vert: "from-emerald-500 to-teal-700",
} as const;
const BULLES = {
  bleu: "from-sky-400 to-blue-600 shadow-blue-700/40",
  corail: "from-rose-400 to-orange-500 shadow-orange-700/40",
  vert: "from-emerald-400 to-teal-600 shadow-teal-700/40",
} as const;
// Décalage en zigzag des bulles, comme un chemin.
const DECALAGES = ["translate-x-0", "translate-x-14", "translate-x-20", "translate-x-8", "-translate-x-10"];

export default function PageMatiere() {
  return (
    <Suspense fallback={<Chargement />}>
      <Chemin />
    </Suspense>
  );
}

function Chemin() {
  const params = useSearchParams();
  const matiere = trouverMatiere(params.get("m"));
  const d = useDonnees();
  const router = useRouter();
  const profil = d?.profils.find((p) => p.id === d.profilActif);
  useEffect(() => {
    if (d && (!profil || !matiere)) router.replace(profil ? "/accueil/" : "/");
  }, [d, profil, matiere, router]);
  if (!d || !profil || !matiere) return <Chargement />;

  const progression = d.progression[profil.id] ?? {};

  return (
    <Page>
      <LienRetour href="/accueil/">← Mes matières</LienRetour>
      <header className="flex items-center gap-3">
        <span aria-hidden className="text-5xl">{matiere.icone}</span>
        <div>
          <h1 className="text-4xl font-bold">{matiere.nom}</h1>
          <p className="font-semibold text-texte-doux">Termine un niveau pour débloquer le suivant.</p>
        </div>
      </header>

      {matiere.unites.map((u, iu) => {
        const etoiles = progression[`${matiere.id}/${u.id}`] ?? {};
        return (
          <section key={u.id} aria-labelledby={`unite-${u.id}`} className="animate-apparaitre" style={{ animationDelay: `${iu * 70}ms` }}>
            <div className={`relative overflow-hidden rounded-3xl bg-linear-to-br p-5 text-white shadow-lg ${BANNIERES[matiere.couleur]}`}>
              <span aria-hidden className="absolute -right-1 -top-2 text-6xl opacity-90">{u.icone}</span>
              <p className="text-sm font-bold uppercase tracking-wide opacity-85">Unité {iu + 1}</p>
              <h2 id={`unite-${u.id}`} className="text-2xl font-semibold">{u.titre}</h2>
              <p className="text-sm font-semibold opacity-90">{u.description}</p>
            </div>

            <ol className="flex flex-col items-center gap-5 py-6">
              {NIVEAUX.map((n, i) => {
                const fait = etoiles[n] !== undefined;
                const ouvert = n === 1 || etoiles[(n - 1) as typeof n] !== undefined;
                const nbEtoiles = etoiles[n] ?? 0;
                const contenu = (
                  <>
                    <span className={`flex h-20 w-20 items-center justify-center rounded-full text-3xl shadow-[0_6px_0] transition ${ouvert ? `bg-linear-to-br text-white ${BULLES[matiere.couleur]} group-hover:scale-105 group-active:translate-y-1 group-active:shadow-[0_2px_0]` : "bg-bordure text-texte-doux shadow-black/10"}`}>
                      {!ouvert ? "🔒" : nbEtoiles === 3 ? "👑" : fait ? "✓" : "★"}
                    </span>
                    <span className="mt-1 text-center text-sm font-bold">
                      Niveau {n} · {NOMS_NIVEAUX[n]}
                    </span>
                    <span aria-label={`${nbEtoiles} étoile(s) sur 3`} className="text-lg leading-none">
                      {[1, 2, 3].map((k) => (k <= nbEtoiles ? "⭐" : "☆")).join("")}
                    </span>
                  </>
                );
                return (
                  <li key={n} className={DECALAGES[i]}>
                    {ouvert ? (
                      <Link href={`/lecon/?m=${matiere.id}&u=${u.id}&n=${n}`} className="group flex flex-col items-center">
                        {contenu}
                      </Link>
                    ) : (
                      <span className="flex flex-col items-center opacity-70" aria-disabled>
                        {contenu}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </Page>
  );
}
