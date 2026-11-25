"use client";
// Une leçon : après chaque réponse, l'élève voit tout de suite si c'est juste, avec une explication.
// À la fin : score, étoiles et points. Les parents retrouvent tout dans l'Espace parents.
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { BlocTexte } from "@/components/BlocTexte";
import { Dictee } from "@/components/Dictee";
import { Chargement, boutonPrincipal, boutonSecondaire, champ } from "@/components/ui";
import { QUESTIONS_PAR_LECON, estNiveau, trouverTexte, trouverUnite } from "@/contenu";
import { creerHasard, melanger } from "@/contenu/outils";
import { NOMS_NIVEAUX, type Niveau, type Question } from "@/contenu/types";
import { afficherScore, bonneReponse, etoiles, evaluer } from "@/lib/correction";
import { encoderFiche, lienFiche } from "@/lib/fiche";
import { enregistrerResultat, nouvelId, useDonnees, type ReponseEleve, type Resultat } from "@/lib/stockage";

export default function PageLecon() {
  return (
    <Suspense fallback={<Chargement />}>
      <Lecon />
    </Suspense>
  );
}

function Lecon() {
  const params = useSearchParams();
  const router = useRouter();
  const d = useDonnees();
  const trouve = trouverUnite(params.get("m"), params.get("u"));
  const n = Number(params.get("n"));
  const niveau: Niveau | null = estNiveau(n) ? n : null;
  const profil = d?.profils.find((p) => p.id === d.profilActif);

  // Questions tirées une seule fois au début de la leçon.
  const [graine] = useState(() => Date.now());
  const [debut] = useState(() => Date.now());
  const questions = useMemo(
    () => (trouve && niveau ? trouve.unite.produire(niveau, trouve.unite.nombreQuestions ?? QUESTIONS_PAR_LECON, creerHasard(graine)) : []),
    [trouve, niveau, graine],
  );
  const [reponses, setReponses] = useState<ReponseEleve[]>([]);
  const [resultat, setResultat] = useState<Resultat | null>(null);
  const [enregistree, setEnregistree] = useState(false);
  const [pret, setPret] = useState<{ resultat: Resultat; lien: string } | null>(null);
  const [envoi, setEnvoi] = useState<"envoyee" | "annulee" | "impossible" | null>(null);

  useEffect(() => {
    if (d && (!profil || !trouve || !niveau)) router.replace(profil ? "/accueil/" : "/");
  }, [d, profil, trouve, niveau, router]);
  if (!d || !profil || !trouve || !niveau || questions.length === 0) return <Chargement />;

  const { matiere, unite } = trouve;
  const retour = `/matiere/?m=${matiere.id}`;

  if (resultat) return <EcranFin resultat={resultat} retour={retour} envoi={envoi} />;

  const index = reponses.length;
  const question = questions[index];

  function avecReponse(donnee: string): ReponseEleve[] {
    const ev = evaluer(question, donnee);
    return [
      ...reponses,
      { question, donnee, correcte: ev.points === 1, points: ev.points, commentaires: ev.commentaires, bonneReponse: bonneReponse(question) },
    ];
  }

  function construireResultat(nouvelles: ReponseEleve[]): Resultat {
    const score = nouvelles.reduce((t, r) => t + (r.points ?? 0), 0);
    return {
      id: nouvelId(),
      profilId: profil!.id,
      prenom: profil!.prenom,
      matiere: matiere.id,
      matiereNom: matiere.nom,
      uniteId: unite.id,
      uniteTitre: unite.titre,
      niveau: niveau!,
      debut,
      fin: Date.now(),
      score,
      total: nouvelles.length,
      reponses: nouvelles,
    };
  }

  /** Dernière question corrigée : on prépare déjà la fiche, pour que l'envoi s'ouvre au toucher suivant. */
  function preparerFiche(donnee: string) {
    const r = construireResultat(avecReponse(donnee));
    encoderFiche(r).then((code) => setPret({ resultat: r, lien: lienFiche(code) }));
  }

  function repondre(donnee: string) {
    const nouvelles = avecReponse(donnee);
    setReponses(nouvelles);
    if (nouvelles.length === questions.length && !enregistree) {
      const r = pret?.resultat ?? construireResultat(nouvelles);
      // Envoi automatique aux parents : la fenêtre de partage s'ouvre avec la fiche (le téléphone exige un dernier « Envoyer »).
      if (pret && typeof navigator !== "undefined" && navigator.share) {
        navigator
          .share({ title: "KidsSchool : fiche de résultats", text: texteFiche(r), url: pret.lien })
          .then(() => setEnvoi("envoyee"))
          .catch((e: Error) => setEnvoi(e.name === "AbortError" ? "annulee" : "impossible"));
      } else {
        setEnvoi("impossible");
      }
      enregistrerResultat(r, etoiles(r.score, r.total));
      setEnregistree(true);
      setResultat(r);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-4 py-6 sm:py-10">
      <div className="flex items-center gap-3">
        <Link href={retour} aria-label="Quitter la leçon" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface text-xl font-bold shadow-sm ring-1 ring-bordure hover:bg-primaire-doux">
          ✕
        </Link>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-bordure" role="progressbar" aria-valuenow={index} aria-valuemin={0} aria-valuemax={questions.length} aria-label="Progression de la leçon">
          <div className="h-full rounded-full bg-linear-to-r from-amber-400 via-orange-500 to-pink-500 transition-all duration-500" style={{ width: `${(index / questions.length) * 100}%` }} />
        </div>
        <span className="font-titre font-semibold text-texte-doux">{index + 1}/{questions.length}</span>
      </div>

      <p className="text-sm font-bold text-texte-doux">
        {matiere.icone} {unite.titre} · Niveau {niveau} ({NOMS_NIVEAUX[niveau]})
      </p>

      {/* La clé force un nouvel affichage (et l'animation) à chaque question. */}
      <CarteQuestion
        key={index}
        question={question}
        graine={graine + index}
        onValider={repondre}
        onCorrige={index === questions.length - 1 ? preparerFiche : undefined}
        derniere={index === questions.length - 1}
      />
    </main>
  );
}

function CarteQuestion({
  question,
  graine,
  onValider,
  onCorrige,
  derniere,
}: {
  question: Question;
  graine: number;
  onValider: (r: string) => void;
  onCorrige?: (r: string) => void;
  derniere: boolean;
}) {
  const [valeur, setValeur] = useState("");
  const [choisis, setChoisis] = useState<number[]>([]); // indices des tuiles (questions « ordre »)
  const [correction, setCorrection] = useState<ReturnType<typeof evaluer> | null>(null);

  const options = useMemo(() => (question.type === "choix" ? melanger(creerHasard(graine), [question.bonne, ...question.autres]) : []), [question, graine]);
  const tuiles = useMemo(() => (question.type === "ordre" ? melanger(creerHasard(graine), [...question.mots, ...(question.intrus ?? [])]) : []), [question, graine]);

  const reponse = question.type === "ordre" ? choisis.map((i) => tuiles[i]).join(" ") : valeur;
  const nbMots = valeur.trim().split(/\s+/).filter(Boolean).length;
  const pret = reponse.trim().length > 0 && !correction;

  function valider() {
    if (!pret) return;
    setCorrection(evaluer(question, reponse));
    onCorrige?.(reponse);
  }

  const texte = trouverTexte(question.texteId);

  return (
    <section className="flex flex-1 animate-apparaitre flex-col gap-5">
      {texte && <BlocTexte texte={texte} />}
      <div>
        <p className="font-bold uppercase tracking-wide text-primaire">{question.consigne}</p>
        <h1 className={`mt-1 font-semibold leading-snug ${texte ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}>{question.enonce}</h1>
      </div>

      {question.type === "choix" && (
        <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Réponses possibles">
          {options.map((o) => (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={valeur === o}
              onClick={() => !correction && setValeur(o)}
              disabled={!!correction}
              className={`min-h-16 rounded-2xl border-2 px-4 py-3 text-left text-lg font-bold shadow-[0_4px_0] transition active:translate-y-0.5 active:shadow-[0_1px_0] ${
                correction && o === question.bonne
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-emerald-600/40 dark:bg-emerald-950 dark:text-emerald-100"
                  : correction && valeur === o
                    ? "border-rose-500 bg-rose-50 text-rose-800 shadow-rose-600/40 dark:bg-rose-950 dark:text-rose-100"
                    : valeur === o
                      ? "border-primaire bg-primaire-doux text-primaire shadow-primaire/40"
                      : "border-bordure bg-surface shadow-bordure hover:bg-fond"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      )}

      {question.type === "saisie" && (
        <form onSubmit={(e) => { e.preventDefault(); valider(); }}>
          <label htmlFor="reponse" className="sr-only">Ta réponse</label>
          <input
            id="reponse"
            autoFocus
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            inputMode={question.format === "nombre" ? "decimal" : "text"}
            placeholder="Écris ta réponse ici"
            value={valeur}
            readOnly={!!correction}
            onChange={(e) => setValeur(e.target.value)}
            className={`${champ} h-16 text-2xl`}
          />
        </form>
      )}

      {question.type === "redaction" && (
        <div className="flex flex-col gap-2">
          <label htmlFor="redaction" className="sr-only">Ta réponse écrite</label>
          <textarea
            id="redaction"
            rows={5}
            spellCheck
            autoCapitalize="sentences"
            placeholder="Écris ta réponse en phrases complètes…"
            value={valeur}
            readOnly={!!correction}
            onChange={(e) => setValeur(e.target.value)}
            className={`${champ} h-auto min-h-36 py-3 text-lg leading-relaxed`}
          />
          <p className="text-sm font-semibold text-texte-doux">
            ✍️ {nbMots} mot{nbMots > 1 ? "s" : ""} · Appuie-toi sur le texte (tu peux le relire plus haut).
          </p>
        </div>
      )}

      {question.type === "dictee" && <Dictee phrase={question.phrase} valeur={valeur} onChange={(v) => !correction && setValeur(v)} />}

      {question.type === "ordre" && (
        <div className="flex flex-col gap-4">
          <div className="flex min-h-20 flex-wrap content-start gap-2 border-b-2 border-dashed border-bordure pb-3" aria-label="Ta phrase">
            {choisis.length === 0 && <span className="py-2 text-texte-doux">Touche les mots dans le bon ordre…</span>}
            {choisis.map((i, pos) => (
              <button key={`${i}-${pos}`} type="button" disabled={!!correction} onClick={() => setChoisis(choisis.filter((_, p) => p !== pos))} className="rounded-xl border-2 border-primaire bg-primaire-doux px-3 py-2 text-lg font-bold text-primaire shadow-[0_3px_0] shadow-primaire/30">
                {tuiles[i]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {tuiles.map((t, i) => {
              const utilise = choisis.includes(i);
              return (
                <button key={i} type="button" disabled={utilise || !!correction} onClick={() => setChoisis([...choisis, i])} className={`rounded-xl border-2 px-3 py-2 text-lg font-bold shadow-[0_3px_0] transition ${utilise ? "border-bordure bg-bordure text-transparent shadow-transparent" : "border-bordure bg-surface shadow-bordure hover:bg-fond"}`}>
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {correction && <Retroaction question={question} correction={correction} />}

      <div className="sticky bottom-0 mt-auto bg-fond/90 pb-2 pt-4 backdrop-blur">
        {correction ? (
          <button type="button" autoFocus onClick={() => onValider(reponse)} className={`${boutonPrincipal} w-full`}>
            {derniere ? "Voir mon score et l'envoyer 🏁" : "Continuer →"}
          </button>
        ) : (
          <button type="button" onClick={valider} disabled={!pret} className={`${boutonPrincipal} w-full`}>
            Valider
          </button>
        )}
      </div>
    </section>
  );
}

const BRAVO = ["Bravo, c'est juste ! 🎉", "Excellent ! ⭐", "Super, bonne réponse ! 💪", "Parfait ! 🙌"];

/** Correction immédiate : juste ou non, la bonne réponse et l'explication pour comprendre. */
function Retroaction({ question, correction }: { question: Question; correction: ReturnType<typeof evaluer> }) {
  const p = correction.points;
  const ecrit = question.type === "redaction" || question.type === "dictee";
  const style =
    p >= 1
      ? "bg-emerald-50 ring-emerald-400 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-50"
      : p > 0
        ? "bg-amber-50 ring-amber-400 text-amber-950 dark:bg-amber-950/60 dark:text-amber-50"
        : "bg-rose-50 ring-rose-400 text-rose-950 dark:bg-rose-950/60 dark:text-rose-50";
  const titre = p >= 1 ? BRAVO[question.enonce.length % BRAVO.length] : p > 0 ? "Presque ! 🟡" : "Pas tout à fait… 💡";
  return (
    <div role="status" className={`animate-apparaitre rounded-3xl p-5 ring-2 ${style}`}>
      <p className="font-titre text-2xl font-bold">{titre}</p>
      {p < 1 && !ecrit && (
        <p className="mt-2 text-lg"><span className="font-bold">La bonne réponse : </span>{bonneReponse(question)}</p>
      )}
      {!ecrit && <p className="mt-2"><span className="font-bold">Pourquoi ? </span>{question.explication}</p>}
      {ecrit && (
        <>
          <ul className="mt-2 flex flex-col gap-1.5">
            {(correction.commentaires ?? []).map((c, k) => (
              <li key={k} className="rounded-xl bg-white/70 px-3 py-2 font-semibold dark:bg-black/20">{c.ok ? "✅ " : "💡 "}{c.texte}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm font-bold">{question.type === "dictee" ? "La phrase était :" : "Un exemple de bonne réponse :"}</p>
          <p className="rounded-xl bg-white/70 p-3 text-lg font-semibold dark:bg-black/20">{bonneReponse(question)}</p>
          {question.type === "redaction" && <p className="mt-2 text-sm font-semibold">📬 Tes parents vont aussi lire ta réponse.</p>}
        </>
      )}
    </div>
  );
}

const MESSAGES = [
  { titre: "Chaque essai te fait progresser ! 🌱", texte: "Continue, tu vas y arriver." },
  { titre: "Bien joué, continue ! 💪", texte: "Tu es sur la bonne voie." },
  { titre: "Super travail ! 🌟", texte: "Encore un petit effort pour la couronne." },
  { titre: "Parfait ! 👑", texte: "Tu maîtrises ce niveau !" },
];

const texteFiche = (r: Resultat) =>
  `${r.prenom} a terminé « ${r.uniteTitre} » (niveau ${r.niveau}) en ${r.matiereNom} : ${afficherScore(r.score)}/${r.total}. Fiche pour les parents :`;

function EcranFin({ resultat, retour, envoi }: { resultat: Resultat; retour: string; envoi: "envoyee" | "annulee" | "impossible" | null }) {
  const nb = etoiles(resultat.score, resultat.total);
  const msg = MESSAGES[nb];
  const [etat, setEtat] = useState<string | null>(null);

  async function envoyer() {
    const lien = lienFiche(await encoderFiche(resultat));
    try {
      if (navigator.share) {
        await navigator.share({ title: "KidsSchool : fiche de résultats", text: texteFiche(resultat), url: lien });
        setEtat("Fiche envoyée ! 📨");
        return;
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
    }
    await copier();
  }

  async function copier() {
    try {
      await navigator.clipboard.writeText(lienFiche(await encoderFiche(resultat)));
      setEtat("Lien copié ✓ Colle-le dans un message à un parent.");
    } catch {
      setEtat("Impossible de copier sur cet appareil.");
    }
  }

  return (
    <main className="relative mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6 overflow-hidden px-4 py-10 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {["🎉", "✨", "⭐", "🎊", "💫", "🌟"].map((e, i) => (
          <span key={i} className="absolute animate-flotter text-4xl" style={{ left: `${8 + i * 16}%`, top: `${6 + (i % 3) * 9}%`, animationDelay: `${i * 0.4}s` }}>{e}</span>
        ))}
      </div>
      <div className="relative animate-apparaitre">
        <p className="text-6xl" aria-hidden>{["🌱", "💪", "🌟", "👑"][nb]}</p>
        <h1 className="mt-2 text-4xl font-bold">{msg.titre}</h1>
        <p className="mt-1 text-lg font-semibold text-texte-doux">{msg.texte}</p>
      </div>

      <div className="relative w-full animate-apparaitre rounded-[2rem] bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-500 p-6 text-white shadow-xl" style={{ animationDelay: "120ms" }}>
        <p className="font-semibold text-white/85">Ton score</p>
        <p className="font-titre text-7xl font-bold">
          {afficherScore(resultat.score)}<span className="text-4xl text-white/80">/{resultat.total}</span>
        </p>
        <p className="mt-1 text-4xl" aria-label={`${nb} étoile(s) sur 3`}>{[1, 2, 3].map((k) => (k <= nb ? "⭐" : "☆")).join(" ")}</p>
        <p className="mt-2 font-bold">+{Math.round(10 + resultat.score * 2)} points ⚡</p>
      </div>

      <p className="relative text-sm font-semibold text-texte-doux">
        {resultat.reponses.some((r) => r.question.type === "redaction" || r.question.type === "dictee")
          ? "📬 Tes parents vont lire tes réponses écrites et pourront te laisser un mot."
          : "👨‍👩‍👦 Tes parents peuvent revoir ta leçon dans l'Espace parents."}
      </p>

      <div className="relative flex w-full flex-col gap-3">
        {envoi === "envoyee" || etat === "Fiche envoyée ! 📨" ? (
          <p role="status" className="rounded-2xl bg-emerald-100 px-4 py-3 font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">✅ Ta fiche est partie chez tes parents !</p>
        ) : (
          <>
            {envoi === "annulee" && <p className="font-semibold text-accent">La fiche n&apos;a pas été envoyée. Touche le bouton pour l&apos;envoyer à tes parents :</p>}
            <button type="button" onClick={envoyer} className={boutonPrincipal}>📨 Envoyer ma fiche à mes parents</button>
            <button type="button" onClick={copier} className={boutonSecondaire}>🔗 Copier le lien de la fiche</button>
          </>
        )}
        {etat && etat !== "Fiche envoyée ! 📨" && <p role="status" className="font-semibold text-succes">{etat}</p>}
        <div className="grid grid-cols-2 gap-3">
          <Link href={retour} className={boutonSecondaire}>🗺️ Mon chemin</Link>
          <button type="button" onClick={() => window.location.reload()} className={boutonSecondaire}>🔁 Rejouer</button>
        </div>
      </div>
    </main>
  );
}
