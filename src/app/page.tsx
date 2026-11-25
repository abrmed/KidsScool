"use client";
// Écran d'entrée : configuration par un parent (1re fois), puis « Qui joue ? ».
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Decor } from "@/components/Decor";
import { CreerCodeParent } from "@/components/CreerCodeParent";
import { FormulaireJoueur } from "@/components/FormulaireJoueur";
import { Avatar, Chargement, boutonPrincipal, boutonSecondaire, champ } from "@/components/ui";
import { decoderInstallation, type Installation } from "@/lib/fiche";
import { codeValide, installerProfils, modifier, useDonnees, type Profil } from "@/lib/stockage";

export default function Entree() {
  const d = useDonnees();
  const router = useRouter();
  const [choisi, setChoisi] = useState<string | null>(null);
  const [installation, setInstallation] = useState<Installation | null>(null);

  // Lien d'installation envoyé par un parent : …/#installer=…
  useEffect(() => {
    const lire = () => {
      const m = window.location.hash.match(/installer=([A-Za-z0-9_-]+)/);
      if (m) decoderInstallation(m[1]).then((inst) => inst && setInstallation(inst));
    };
    lire();
    // Le lien peut être ouvert alors que le site est déjà affiché dans l'onglet.
    window.addEventListener("hashchange", lire);
    return () => window.removeEventListener("hashchange", lire);
  }, []);

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
          {installation ? (
            <Installer
              installation={installation}
              dejaSurAppareil={d.profils.filter((p) => !installation.profils.some((n) => n.id === p.id))}
              onFait={(remplacer) => {
                installerProfils(installation.parent, installation.profils, remplacer);
                setInstallation(null);
                history.replaceState(null, "", window.location.pathname);
                if (installation.pour === "parent") router.push("/parents/");
                else if (installation.profils.length === 1) setChoisi(installation.profils[0].id);
              }}
            />
          ) : !d.parent || d.profils.length === 0 ? (
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

/** Installation reçue par lien : profil d'un enfant, ou famille complète pour l'autre parent. */
function Installer({ installation, dejaSurAppareil, onFait }: { installation: Installation; dejaSurAppareil: Profil[]; onFait: (remplacer: boolean) => void }) {
  const pourParent = installation.pour === "parent";
  const [remplacer, setRemplacer] = useState(pourParent && dejaSurAppareil.length > 0);
  const noms = installation.profils.map((p) => p.prenom).join(", ");
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex flex-wrap justify-center gap-3">
        {installation.profils.map((p, i) => <Avatar key={p.id} emoji={p.avatar} index={i} taille={installation.profils.length > 2 ? "md" : "lg"} />)}
      </div>
      {pourParent ? (
        <>
          <h2 className="text-3xl font-bold">Bienvenue dans la famille ! 👨‍👩‍👦</h2>
          <p className="text-texte-doux">
            L&apos;autre parent t&apos;invite. Cet appareil recevra <strong>le même code parent</strong> et les joueurs : <strong>{noms}</strong>.
          </p>
          {dejaSurAppareil.length > 0 && (
            <label className="flex items-start gap-3 rounded-2xl bg-accent-doux p-3 text-left font-semibold text-accent">
              <input type="checkbox" className="mt-1 h-5 w-5" checked={remplacer} onChange={(e) => setRemplacer(e.target.checked)} />
              <span>
                Effacer ce qui a déjà été créé sur cet appareil ({dejaSurAppareil.map((p) => p.prenom).join(", ")}) pour garder seulement la famille commune. <em>Recommandé.</em>
              </span>
            </label>
          )}
          <button type="button" onClick={() => onFait(remplacer)} className={`${boutonPrincipal} w-full`}>Rejoindre la famille 🚀</button>
          <p className="text-sm text-texte-doux">Ensuite, utilise le code parent de l&apos;autre parent pour ouvrir l&apos;Espace parents.</p>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold">Bienvenue {noms} ! 🎉</h2>
          <p className="text-texte-doux">Un parent t&apos;a préparé ton profil. Touche le bouton pour l&apos;installer sur cet appareil, puis entre ton code secret.</p>
          <button type="button" onClick={() => onFait(false)} className={`${boutonPrincipal} w-full`}>Installer mon profil 🚀</button>
        </>
      )}
    </div>
  );
}

/** Appareil pas encore prêt : un élève attend son lien ; un parent peut tout configurer ici. */
function Configuration({ aDejaUnCode }: { aDejaUnCode: boolean }) {
  const [role, setRole] = useState<"choix" | "eleve" | "parent">(aDejaUnCode ? "parent" : "choix");
  if (role === "choix") {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-center text-3xl font-bold">Bienvenue ! 👋</h2>
        <p className="text-center text-texte-doux">Cet appareil n&apos;est pas encore prêt. Qui es-tu ?</p>
        <button type="button" onClick={() => setRole("eleve")} className={`${boutonPrincipal} w-full`}>🎒 Je suis un élève</button>
        <button type="button" onClick={() => setRole("parent")} className={`${boutonSecondaire} w-full`}>👨‍👩‍👦 Je suis un parent</button>
      </div>
    );
  }
  if (role === "eleve") {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-6xl" aria-hidden>📲</p>
        <h2 className="text-2xl font-bold">Demande ton lien à un parent</h2>
        <p className="text-texte-doux">
          Ton parent va t&apos;envoyer un <strong>lien d&apos;installation</strong> (par message ou courriel). Ouvre-le sur cet appareil : ton profil
          apparaîtra tout seul. Ensuite, tu entreras avec ton code secret.
        </p>
        <p className="rounded-2xl bg-fond p-3 text-sm font-semibold text-texte-doux">
          Pour le parent : Espace parents → Joueurs → « 📲 Lien d&apos;installation ».
        </p>
        <button type="button" onClick={() => setRole("choix")} className="text-sm font-semibold text-texte-doux underline">← Retour</button>
      </div>
    );
  }
  return <ConfigurationParent aDejaUnCode={aDejaUnCode} />;
}

/** Première utilisation par un parent : code parent, puis premier joueur. */
function ConfigurationParent({ aDejaUnCode }: { aDejaUnCode: boolean }) {
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
