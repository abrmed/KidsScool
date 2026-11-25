"use client";
// Accueil de l'élève : niveau, série, et les 3 matières.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Avatar, Chargement, LienRetour, Page } from "@/components/ui";
import { MATIERES, NIVEAUX } from "@/contenu";
import { niveauXp, serieActuelle, useDonnees } from "@/lib/stockage";

const DEGRADES = {
  bleu: "from-sky-500 to-blue-700",
  corail: "from-rose-500 to-orange-500",
  vert: "from-emerald-500 to-teal-700",
} as const;

export default function AccueilEleve() {
  const d = useDonnees();
  const router = useRouter();
  const profil = d?.profils.find((p) => p.id === d.profilActif);
  useEffect(() => {
    if (d && !profil) router.replace("/");
  }, [d, profil, router]);
  if (!d || !profil) return <Chargement />;

  const index = d.profils.indexOf(profil);
  const xp = d.xp[profil.id] ?? 0;
  const { niveau, dansNiveau } = niveauXp(xp);
  const serie = serieActuelle(d, profil.id);
  const progression = d.progression[profil.id] ?? {};

  return (
    <Page>
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar emoji={profil.avatar} index={index} />
          <div>
            <p className="font-titre text-xl font-bold leading-tight">{profil.prenom}</p>
            <p className="text-sm font-semibold text-texte-doux">⭐ {xp} points</p>
          </div>
        </div>
        <LienRetour href="/">🔄 Changer</LienRetour>
      </header>

      <section className="relative animate-apparaitre overflow-hidden rounded-[2rem] bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-500 p-6 text-white shadow-xl shadow-violet-500/25 sm:p-8">
        <span aria-hidden className="absolute -right-4 -top-6 animate-flotter text-8xl sm:text-9xl">🚀</span>
        <h1 className="relative max-w-[75%] text-4xl font-bold sm:text-5xl">Salut {profil.prenom} !</h1>
        <p className="relative mt-2 font-semibold text-white/90">Choisis ta matière et lance une mission.</p>
        <div className="relative mt-6 rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-sm font-bold">
            <span>⚡ Niveau {niveau}</span>
            <span>🔥 Série : {serie} jour{serie > 1 ? "s" : ""}</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/25" role="progressbar" aria-valuenow={dansNiveau} aria-valuemin={0} aria-valuemax={100} aria-label="Points vers le prochain niveau">
            <div className="h-full rounded-full bg-linear-to-r from-amber-300 to-yellow-200 transition-all" style={{ width: `${Math.max(3, dansNiveau)}%` }} />
          </div>
          <p className="mt-2 text-xs font-semibold text-white/80">{100 - dansNiveau} points avant le niveau {niveau + 1}</p>
        </div>
      </section>

      <section aria-labelledby="titre-matieres">
        <h2 id="titre-matieres" className="mb-3 text-2xl font-semibold">🎮 Mes matières</h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {MATIERES.map((m, i) => {
            const max = m.unites.length * NIVEAUX.length * 3;
            const gagnees = m.unites.reduce(
              (t, u) => t + Object.values(progression[`${m.id}/${u.id}`] ?? {}).reduce((a, b) => a + (b ?? 0), 0),
              0,
            );
            return (
              <li key={m.id} className="animate-apparaitre" style={{ animationDelay: `${i * 90}ms` }}>
                <Link
                  href={`/matiere/?m=${m.id}`}
                  className={`group relative flex min-h-44 flex-col justify-end overflow-hidden rounded-3xl bg-linear-to-br p-5 text-white shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-1 hover:shadow-xl ${DEGRADES[m.couleur]}`}
                >
                  <span aria-hidden className="absolute -right-2 -top-2 text-7xl transition duration-300 group-hover:rotate-6 group-hover:scale-110">{m.icone}</span>
                  <span aria-hidden className="absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-white/15" />
                  <h3 className="relative text-3xl font-semibold">{m.nom}</h3>
                  <p className="relative text-sm font-semibold opacity-90">{m.slogan}</p>
                  <div className="relative mt-3 h-2.5 overflow-hidden rounded-full bg-white/25" aria-hidden>
                    <div className="h-full rounded-full bg-white" style={{ width: `${(gagnees / max) * 100}%` }} />
                  </div>
                  <p className="relative mt-1 text-xs font-bold">⭐ {gagnees} / {max} étoiles</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </Page>
  );
}
