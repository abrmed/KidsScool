"use client";
// Écran d'entrée : configuration par un parent (1re fois), puis « Qui joue ? ».
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Decor } from "@/components/Decor";
import { CreerCodeParent } from "@/components/CreerCodeParent";
import { FormulaireJoueur } from "@/components/FormulaireJoueur";
import { Avatar, Chargement, boutonPrincipal, boutonSecondaire, champ } from "@/components/ui";
import { codeValide, modifier, useDonnees, type Profil } from "@/lib/stockage";

export default function Entree() {
  const d = useDonnees();
  const [choisi, setChoisi] = useState<string | null>(null);
  if (!d) return <Chargement />;
  const profilChoisi = d.profils.find((p) => p.id === choisi);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-500 px-4 py-10">
      <Decor />
      <div className="relative w-full max-w-xl animate-apparaitre">
        <div className="mb-6 flex flex-col items-center gap-3 text-center text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icone.svg`} alt="" width={84} height={84} className="rounded-[1.6rem] shadow-2xl shadow-indigo-950/40 ring-4 ring-white/30" />
          <h1 className="text-5xl font-bold tracking-tight drop-shadow-sm">KidsSchool</h1>
          <p className="text-lg font-semibold text-white/90">Anglais · Français · Maths 🚀</p>
        </div>

        <section className="rounded-[2rem] bg-surface/95 p-6 shadow-2xl shadow-indigo-950/30 backdrop-blur sm:p-8">
          {!d.parent || d.profils.length === 0 ? (
            <Configuration aDejaUnCode={!!d.parent} />
          ) : profilChoisi ? (
            <CodeEnfant profil={profilChoisi} index={d.profils.indexOf(profilChoisi)} onAnnuler={() => setChoisi(null)} />
          ) : (
            <>
              <h2 className="text-center text-3xl font-bold">Qui joue ? 🎮</h2>
              <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {d.profils.map((p, i) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setChoisi(p.id)}
                      className="flex w-full flex-col items-center gap-2 rounded-3xl p-3 transition hover:-translate-y-1 hover:bg-primaire-doux focus-visible:bg-primaire-doux"
                    >
                      <Avatar emoji={p.avatar} index={i} taille="lg" />
                      <span className="font-titre text-xl font-semibold">{p.prenom}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-center">
                <Link href="/parents/" className={`${boutonSecondaire} min-h-12 text-base`}>
                  🔒 Espace parents
                </Link>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

/** Première utilisation : un parent choisit son code, puis ajoute un premier joueur. */
function Configuration({ aDejaUnCode }: { aDejaUnCode: boolean }) {
  const [etape, setEtape] = useState<"code" | "joueur">(aDejaUnCode ? "joueur" : "code");
  if (etape === "code") return <CreerCodeParent onFait={() => setEtape("joueur")} />;
  return (
    <FormulaireJoueur
      titre="🎒 Ajoute un premier joueur"
      intro="Tu pourras en ajouter d'autres dans l'Espace parents. Le prénom reste seulement sur cet appareil."
      bouton="C'est parti ! 🚀"
      apres={
        <Link href="/parents/" className="text-center text-sm font-semibold text-texte-doux underline">
          C&apos;est l&apos;appareil d&apos;un parent ? Aller directement à l&apos;Espace parents
        </Link>
      }
    />
  );
}

/** L'enfant tape son code secret pour ouvrir son profil. */
function CodeEnfant({ profil, index, onAnnuler }: { profil: Profil; index: number; onAnnuler: () => void }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState(false);
  return (
    <form
      className="flex flex-col items-center gap-4 text-center"
      onSubmit={async (e) => {
        e.preventDefault();
        // Un profil créé sans code (ancienne version) s'ouvre directement.
        if (profil.code && !(await codeValide(profil.code, code))) {
          setErreur(true);
          setCode("");
          return;
        }
        modifier((x) => ({ ...x, profilActif: profil.id }));
        router.push("/accueil/");
      }}
    >
      <Avatar emoji={profil.avatar} index={index} taille="lg" />
      <h2 className="text-3xl font-bold">Salut {profil.prenom} !</h2>
      <label htmlFor="code-secret" className="font-semibold">Tape ton code secret 🔑</label>
      <input id="code-secret" autoFocus type="password" inputMode="numeric" autoComplete="off" className={`${champ} text-center text-2xl tracking-[0.5em]`} value={code} onChange={(e) => setCode(e.target.value.trim())} />
      {erreur && <p role="alert" className="w-full rounded-2xl bg-accent-doux px-4 py-3 font-semibold text-accent">Oups, ce n&apos;est pas le bon code. Réessaie !</p>}
      <button type="submit" className={`${boutonPrincipal} w-full`}>Entrer 🚀</button>
      <button type="button" onClick={onAnnuler} className="text-sm font-semibold text-texte-doux underline">Ce n&apos;est pas moi</button>
    </form>
  );
}
