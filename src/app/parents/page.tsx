"use client";
// Espace parents : protégé par le code parent. Corrections détaillées, joueurs, réglages.
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CreerCodeParent } from "@/components/CreerCodeParent";
import { FormulaireJoueur } from "@/components/FormulaireJoueur";
import { Avatar, Chargement, LienRetour, Page, boutonPrincipal, boutonSecondaire, champ } from "@/components/ui";
import { NOMS_NIVEAUX } from "@/contenu/types";
import { decoderFiche } from "@/lib/fiche";
import { changerCodeJoueur, definirCodeParent, formatCodeValide, modifier, useDonnees, verifierCodeParent, type Donnees, type Resultat } from "@/lib/stockage";

const dateHeure = (t: number) =>
  new Date(t).toLocaleString("fr-CA", { timeZone: "America/Toronto", dateStyle: "medium", timeStyle: "short" });
const duree = (ms: number) => {
  const s = Math.max(1, Math.round(ms / 1000));
  return s < 60 ? `${s} s` : `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s`;
};

export default function EspaceParents() {
  const d = useDonnees();
  const [ouvert, setOuvert] = useState(false);
  if (!d) return <Chargement />;

  if (!d.parent) {
    return (
      <Page>
        <LienRetour href="/">← Accueil</LienRetour>
        <div className="rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-bordure">
          <CreerCodeParent onFait={() => setOuvert(true)} />
        </div>
      </Page>
    );
  }
  if (!ouvert) return <Verrou onOuvrir={() => setOuvert(true)} />;
  return <Contenu d={d} onFermer={() => setOuvert(false)} />;
}

function Verrou({ onOuvrir }: { onOuvrir: () => void }) {
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState(false);
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-700 via-indigo-800 to-violet-800 px-4">
      <form
        className="w-full max-w-sm animate-apparaitre rounded-[2rem] bg-surface p-6 shadow-2xl sm:p-8"
        onSubmit={async (e) => {
          e.preventDefault();
          if (await verifierCodeParent(code)) onOuvrir();
          else {
            setErreur(true);
            setCode("");
          }
        }}
      >
        <p className="text-center text-5xl" aria-hidden>🔒</p>
        <h1 className="mt-2 text-center text-3xl font-bold">Espace parents</h1>
        <label htmlFor="code" className="mt-6 block font-semibold">Code parent</label>
        <input id="code" autoFocus type="password" inputMode="numeric" autoComplete="current-password" className={`${champ} mt-2 text-center text-2xl tracking-[0.5em]`} value={code} onChange={(e) => setCode(e.target.value.trim())} />
        {erreur && <p role="alert" className="mt-3 rounded-2xl bg-accent-doux px-4 py-3 font-semibold text-accent">Code incorrect.</p>}
        <button type="submit" className={`${boutonPrincipal} mt-5 w-full`}>Ouvrir</button>
        <Link href="/" className="mt-4 block text-center text-sm font-semibold text-texte-doux underline">Retour à l&apos;accueil</Link>
      </form>
    </main>
  );
}

function Contenu({ d, onFermer }: { d: Donnees; onFermer: () => void }) {
  const [onglet, setOnglet] = useState<"resultats" | "importer" | "joueurs" | "reglages">("resultats");
  const [ficheRecue, setFicheRecue] = useState<Resultat | null>(null);

  // Fiche reçue par lien (…/parents/#fiche=…)
  useEffect(() => {
    const m = window.location.hash.match(/fiche=([A-Za-z0-9_-]+)/);
    if (m) decoderFiche(m[1]).then((r) => r && setFicheRecue(r));
  }, []);

  const onglets = [
    ["resultats", "📊 Résultats"],
    ["importer", "📥 Importer une fiche"],
    ["joueurs", "🎒 Joueurs"],
    ["reglages", "⚙️ Réglages"],
  ] as const;

  return (
    <Page large>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">🔒 Espace parents</h1>
          <p className="font-semibold text-texte-doux">Corrections détaillées, invisibles pour les enfants.</p>
        </div>
        <div className="flex gap-2">
          <LienRetour href="/">🏠 Accueil</LienRetour>
          <button type="button" onClick={onFermer} className="h-11 rounded-2xl bg-surface px-4 text-sm font-bold shadow-sm ring-1 ring-bordure hover:bg-primaire-doux">🔐 Verrouiller</button>
        </div>
      </header>

      {ficheRecue && (
        <section className="rounded-3xl bg-primaire-doux p-4 ring-2 ring-primaire sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-semibold">📨 Fiche reçue</h2>
            <div className="flex gap-2">
              {!d.resultats.some((r) => r.id === ficheRecue.id) ? (
                <button type="button" className={`${boutonSecondaire} min-h-11 text-base`} onClick={() => modifier((x) => ({ ...x, resultats: [ficheRecue, ...x.resultats] }))}>
                  ➕ Garder dans l&apos;historique
                </button>
              ) : (
                <span className="font-bold text-succes">✓ Dans l&apos;historique</span>
              )}
              <button type="button" className="rounded-xl px-3 font-bold text-texte-doux" onClick={() => { setFicheRecue(null); history.replaceState(null, "", window.location.pathname); }}>
                Fermer
              </button>
            </div>
          </div>
          <DetailResultat r={ficheRecue} ouvertParDefaut />
        </section>
      )}

      <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Sections">
        {onglets.map(([id, nom]) => (
          <button key={id} type="button" aria-current={onglet === id} onClick={() => setOnglet(id)} className={`shrink-0 rounded-2xl px-4 py-2.5 font-bold transition ${onglet === id ? "bg-primaire text-white dark:text-fond" : "bg-surface ring-1 ring-bordure hover:bg-primaire-doux"}`}>
            {nom}
          </button>
        ))}
      </nav>

      {onglet === "resultats" && <Resultats d={d} />}
      {onglet === "importer" && <Importer onFiche={setFicheRecue} />}
      {onglet === "joueurs" && <Joueurs d={d} />}
      {onglet === "reglages" && <Reglages />}
    </Page>
  );
}

function Resultats({ d }: { d: Donnees }) {
  const [filtre, setFiltre] = useState<string>("tous");
  const liste = useMemo(() => [...d.resultats].sort((a, b) => b.fin - a.fin).filter((r) => filtre === "tous" || r.profilId === filtre), [d.resultats, filtre]);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {[{ id: "tous", prenom: "Tous", avatar: "👨‍👩‍👦" }, ...d.profils].map((p) => (
          <button key={p.id} type="button" aria-pressed={filtre === p.id} onClick={() => setFiltre(p.id)} className={`rounded-full px-4 py-2 font-bold ${filtre === p.id ? "bg-texte text-fond" : "bg-surface ring-1 ring-bordure"}`}>
            {p.avatar} {p.prenom}
          </button>
        ))}
      </div>
      {liste.length === 0 ? (
        <p className="rounded-3xl bg-surface p-6 text-center font-semibold text-texte-doux ring-1 ring-bordure">
          Aucun résultat pour l&apos;instant sur cet appareil. Les leçons terminées apparaîtront ici, ainsi que les fiches importées.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {liste.map((r) => (
            <li key={r.id}><DetailResultat r={r} /></li>
          ))}
        </ul>
      )}
    </section>
  );
}

function DetailResultat({ r, ouvertParDefaut = false }: { r: Resultat; ouvertParDefaut?: boolean }) {
  const pct = Math.round((r.score / r.total) * 100);
  const couleur = pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-rose-500";
  return (
    <details open={ouvertParDefaut} className="group overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-bordure">
      <summary className="flex cursor-pointer list-none items-center gap-4 p-4 hover:bg-fond">
        <span className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl font-titre font-bold text-white ${couleur}`}>
          <span className="text-xl leading-none">{r.score}/{r.total}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-titre text-lg font-semibold">{r.prenom} · {r.matiereNom}</span>
          <span className="block text-sm font-semibold text-texte-doux">
            {r.uniteTitre} · Niveau {r.niveau} ({NOMS_NIVEAUX[r.niveau]}) · {dateHeure(r.fin)} · {duree(r.fin - r.debut)}
            {r.importee ? " · 📨 fiche reçue" : ""}
          </span>
        </span>
        <span aria-hidden className="text-xl transition group-open:rotate-180">⌄</span>
      </summary>
      <ol className="flex flex-col gap-3 border-t border-bordure p-4">
        {r.reponses.map((rep, i) => (
          <li key={i} className={`rounded-2xl p-4 ring-2 ${rep.correcte ? "bg-emerald-50 ring-emerald-300 dark:bg-emerald-950/40 dark:ring-emerald-800" : "bg-rose-50 ring-rose-300 dark:bg-rose-950/40 dark:ring-rose-800"}`}>
            <p className="text-sm font-bold text-texte-doux">
              {rep.correcte ? "✅" : "❌"} Question {i + 1} · {rep.question.consigne}
            </p>
            <p className="mt-1 text-lg font-semibold">{rep.question.enonce}</p>
            {rep.question.type === "choix" && (
              <p className="mt-1 text-sm text-texte-doux">Choix proposés : {[rep.question.bonne, ...rep.question.autres].join(" · ")}</p>
            )}
            <dl className="mt-2 grid gap-1 text-base sm:grid-cols-[auto_1fr] sm:gap-x-3">
              <dt className="font-bold">Réponse donnée :</dt>
              <dd className={rep.correcte ? "font-semibold" : "font-semibold text-rose-700 line-through decoration-2 dark:text-rose-300"}>{rep.donnee || "(vide)"}</dd>
              {!rep.correcte && (
                <>
                  <dt className="font-bold">Bonne réponse :</dt>
                  <dd className="font-semibold text-emerald-700 dark:text-emerald-300">{rep.bonneReponse}</dd>
                </>
              )}
              <dt className="font-bold">Explication :</dt>
              <dd>{rep.question.explication}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </details>
  );
}

function Importer({ onFiche }: { onFiche: (r: Resultat) => void }) {
  const [texte, setTexte] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  return (
    <form
      className="flex flex-col gap-3 rounded-3xl bg-surface p-5 ring-1 ring-bordure"
      onSubmit={async (e) => {
        e.preventDefault();
        const code = texte.match(/fiche=([A-Za-z0-9_-]+)/)?.[1] ?? texte.trim();
        const r = await decoderFiche(code);
        if (!r) return setErreur("Ce lien ou ce code n'est pas une fiche KidsSchool valide.");
        setErreur(null);
        setTexte("");
        onFiche(r);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <h2 className="text-xl font-semibold">📥 Importer une fiche de résultats</h2>
      <p className="text-texte-doux">Colle ici le lien que l&apos;enfant t&apos;a envoyé (par courriel ou message). Tu peux aussi simplement ouvrir ce lien : il arrive directement ici.</p>
      <textarea className={`${champ} h-28 py-3 text-base`} value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="https://…/parents/#fiche=…" />
      {erreur && <p role="alert" className="rounded-2xl bg-accent-doux px-4 py-3 font-semibold text-accent">{erreur}</p>}
      <button type="submit" className={boutonPrincipal}>Voir la correction</button>
    </form>
  );
}

function Joueurs({ d }: { d: Donnees }) {
  const [edition, setEdition] = useState<string | null>(null);
  const [nouveauCode, setNouveauCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  return (
    <section className="flex flex-col gap-4">
      {message && <p role="status" className="rounded-2xl bg-primaire-doux px-4 py-3 font-semibold">{message}</p>}
      <ul className="grid gap-3 sm:grid-cols-2">
        {d.profils.map((p, i) => (
          <li key={p.id} className="flex flex-col gap-3 rounded-3xl bg-surface p-4 ring-1 ring-bordure">
            <div className="flex items-center gap-3">
              <Avatar emoji={p.avatar} index={i} />
              <div className="flex-1">
                <p className="font-titre text-xl font-semibold">{p.prenom}</p>
                <p className="text-sm font-semibold text-texte-doux">
                  ⭐ {d.xp[p.id] ?? 0} points · {d.resultats.filter((r) => r.profilId === p.id).length} leçon(s) · {p.code ? "🔑 code défini" : "⚠️ sans code"}
                </p>
              </div>
            </div>
            {edition === p.id ? (
              <form
                className="flex gap-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!formatCodeValide(nouveauCode)) return setMessage("Le code doit contenir de 4 à 8 chiffres.");
                  await changerCodeJoueur(p.id, nouveauCode);
                  setEdition(null);
                  setNouveauCode("");
                  setMessage(`Nouveau code enregistré pour ${p.prenom} ✓`);
                }}
              >
                <input aria-label={`Nouveau code de ${p.prenom}`} placeholder="Nouveau code" autoFocus type="password" inputMode="numeric" className={`${champ} h-12`} value={nouveauCode} onChange={(e) => setNouveauCode(e.target.value.trim())} />
                <button type="submit" className="rounded-2xl bg-primaire px-4 font-bold text-white dark:text-fond">OK</button>
                <button type="button" onClick={() => setEdition(null)} className="rounded-2xl px-3 font-bold text-texte-doux">✕</button>
              </form>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => { setEdition(p.id); setNouveauCode(""); setMessage(null); }} className="rounded-xl px-3 py-2 text-sm font-bold ring-1 ring-bordure hover:bg-primaire-doux">
                  🔑 {p.code ? "Changer son code" : "Définir son code"}
                </button>
                <button
                  type="button"
                  className="rounded-xl px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  onClick={() => {
                    if (!confirm(`Supprimer ${p.prenom} et toute sa progression sur cet appareil ?`)) return;
                    modifier((x) => ({
                      ...x,
                      profils: x.profils.filter((y) => y.id !== p.id),
                      profilActif: x.profilActif === p.id ? null : x.profilActif,
                      resultats: x.resultats.filter((r) => r.profilId !== p.id),
                    }));
                  }}
                >
                  Supprimer
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="rounded-3xl bg-surface p-5 ring-1 ring-bordure">
        <FormulaireJoueur titre="➕ Ajouter un joueur" intro="Chaque enfant a son profil, ses points et son code secret." bouton="Ajouter" />
      </div>
    </section>
  );
}

function Reglages() {
  const [actuel, setActuel] = useState("");
  const [nouveau, setNouveau] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  return (
    <section className="flex flex-col gap-4">
      <form
        className="flex flex-col gap-3 rounded-3xl bg-surface p-5 ring-1 ring-bordure"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!(await verifierCodeParent(actuel))) return setMessage("Le code actuel est incorrect.");
          if (!/^\d{4,8}$/.test(nouveau)) return setMessage("Le nouveau code doit contenir de 4 à 8 chiffres.");
          await definirCodeParent(nouveau);
          setActuel("");
          setNouveau("");
          setMessage("Code parent modifié ✓");
        }}
      >
        <h2 className="text-xl font-semibold">🔑 Changer le code parent</h2>
        <input aria-label="Code actuel" placeholder="Code actuel" type="password" inputMode="numeric" className={champ} value={actuel} onChange={(e) => setActuel(e.target.value.trim())} />
        <input aria-label="Nouveau code" placeholder="Nouveau code (4 à 8 chiffres)" type="password" inputMode="numeric" className={champ} value={nouveau} onChange={(e) => setNouveau(e.target.value.trim())} />
        {message && <p role="status" className="font-semibold">{message}</p>}
        <button type="submit" className={boutonSecondaire}>Enregistrer</button>
      </form>

      <div className="rounded-3xl bg-surface p-5 ring-1 ring-bordure">
        <h2 className="text-xl font-semibold">ℹ️ Où sont les données ?</h2>
        <p className="mt-1 text-texte-doux">
          Tout reste dans le navigateur de cet appareil : aucun compte, aucun serveur. Si on efface les données du navigateur, la progression est perdue.
          Pour voir les résultats faits sur un autre appareil, utilise les fiches envoyées par l&apos;enfant.
        </p>
        <button
          type="button"
          className="mt-4 rounded-2xl px-4 py-3 font-bold text-rose-600 ring-2 ring-rose-200 hover:bg-rose-50 dark:ring-rose-900 dark:hover:bg-rose-950/40"
          onClick={() => {
            if (!confirm("Effacer TOUTES les données de KidsSchool sur cet appareil (joueurs, progression, résultats, code parent) ?")) return;
            modifier(() => ({ version: 1, profils: [], profilActif: null, progression: {}, xp: {}, serie: {}, resultats: [], parent: null }));
            window.location.href = (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + "/";
          }}
        >
          🗑️ Tout effacer sur cet appareil
        </button>
      </div>
    </section>
  );
}
