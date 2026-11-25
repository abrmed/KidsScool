"use client";
// Une leçon : 8 questions, sans dire à l'élève si chaque réponse est bonne.
// À la fin : score, étoiles et points. La correction détaillée est réservée à l'Espace parents.
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

  useEffect(() => {
    if (d && (!profil || !trouve || !niveau)) router.replace(profil ? "/accueil/" : "/");
  }, [d, profil, trouve, niveau, router]);
  if (!d || !profil || !trouve || !niveau || questions.length === 0) return <Chargement />;

  const { matiere, unite } = trouve;
  const retour = `/matiere/?m=${matiere.id}`;

  if (resultat) return <EcranFin resultat={resultat} retour={retour} />;

  const index = reponses.length;
  const question = questions[index];

  function repondre(donnee: string) {
    const ev = evaluer(question, donnee);
    const nouvelles: ReponseEleve[] = [
      ...reponses,
      { question, donnee, correcte: ev.points === 1, points: ev.points, commentaires: ev.commentaires, bonneReponse: bonneReponse(question) },
    ];
    setReponses(nouvelles);
    if (nouvelles.length === questions.length && !enregistree) {
      const score = nouvelles.reduce((t, r) => t + (r.points ?? 0), 0);
      const r: Resultat = {
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
      enregistrerResultat(r, etoiles(score, r.total));
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
      <CarteQuestion key={index} question={question} graine={graine + index} onValider={repondre} derniere={index === questions.length - 1} />
    </main>
  );
}

function CarteQuestion({ question, graine, onValider, derniere }: { question: Question; graine: number; onValider: (r: string) => void; derniere: boolean }) {
  const [valeur, setValeur] = useState("");
  const [choisis, setChoisis] = useState<number[]>([]); // indices des tuiles (questions « ordre »)
  const [envoi, setEnvoi] = useState(false);

  const options = useMemo(() => (question.type === "choix" ? melanger(creerHasard(graine), [question.bonne, ...question.autres]) : []), [question, graine]);
  const tuiles = useMemo(() => (question.type === "ordre" ? melanger(creerHasard(graine), [...question.mots, ...(question.intrus ?? [])]) : []), [question, graine]);

  const reponse = question.type === "ordre" ? choisis.map((i) => tuiles[i]).join(" ") : valeur;
  const nbMots = valeur.trim().split(/\s+/).filter(Boolean).length;
  const pret = reponse.trim().length > 0 && !envoi;

  function valider() {
    if (!pret) return;
    setEnvoi(true);
    // Petite pause neutre : on confirme l'enregistrement, sans dire si c'est juste.
    setTimeout(() => onValider(reponse), 450);
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
              onClick={() => setValeur(o)}
              className={`min-h-16 rounded-2xl border-2 px-4 py-3 text-left text-lg font-bold shadow-[0_4px_0] transition active:translate-y-0.5 active:shadow-[0_1px_0] ${valeur === o ? "border-primaire bg-primaire-doux text-primaire shadow-primaire/40" : "border-bordure bg-surface shadow-bordure hover:bg-fond"}`}
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
            onChange={(e) => setValeur(e.target.value)}
            className={`${champ} h-auto min-h-36 py-3 text-lg leading-relaxed`}
          />
          <p className="text-sm font-semibold text-texte-doux">
            ✍️ {nbMots} mot{nbMots > 1 ? "s" : ""} · Appuie-toi sur le texte (tu peux le relire plus haut).
          </p>
        </div>
      )}

      {question.type === "dictee" && <Dictee phrase={question.phrase} valeur={valeur} onChange={setValeur} />}

      {question.type === "ordre" && (
        <div className="flex flex-col gap-4">
          <div className="flex min-h-20 flex-wrap content-start gap-2 border-b-2 border-dashed border-bordure pb-3" aria-label="Ta phrase">
            {choisis.length === 0 && <span className="py-2 text-texte-doux">Touche les mots dans le bon ordre…</span>}
            {choisis.map((i, pos) => (
              <button key={`${i}-${pos}`} type="button" onClick={() => setChoisis(choisis.filter((_, p) => p !== pos))} className="rounded-xl border-2 border-primaire bg-primaire-doux px-3 py-2 text-lg font-bold text-primaire shadow-[0_3px_0] shadow-primaire/30">
                {tuiles[i]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {tuiles.map((t, i) => {
              const utilise = choisis.includes(i);
              return (
                <button key={i} type="button" disabled={utilise} onClick={() => setChoisis([...choisis, i])} className={`rounded-xl border-2 px-3 py-2 text-lg font-bold shadow-[0_3px_0] transition ${utilise ? "border-bordure bg-bordure text-transparent shadow-transparent" : "border-bordure bg-surface shadow-bordure hover:bg-fond"}`}>
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-auto pt-4">
        <button type="button" onClick={valider} disabled={!pret} className={`${boutonPrincipal} w-full`}>
          {envoi ? "✓ Réponse enregistrée" : derniere ? "Terminer 🏁" : "Valider"}
        </button>
      </div>
    </section>
  );
}

const MESSAGES = [
  { titre: "Chaque essai te fait progresser ! 🌱", texte: "Continue, tu vas y arriver." },
  { titre: "Bien joué, continue ! 💪", texte: "Tu es sur la bonne voie." },
  { titre: "Super travail ! 🌟", texte: "Encore un petit effort pour la couronne." },
  { titre: "Parfait ! 👑", texte: "Tu maîtrises ce niveau !" },
];

function EcranFin({ resultat, retour }: { resultat: Resultat; retour: string }) {
  const nb = etoiles(resultat.score, resultat.total);
  const msg = MESSAGES[nb];
  const [etat, setEtat] = useState<string | null>(null);

  async function envoyer() {
    const lien = lienFiche(await encoderFiche(resultat));
    const texte = `${resultat.prenom} a terminé « ${resultat.uniteTitre} » (niveau ${resultat.niveau}) en ${resultat.matiereNom}. Fiche pour les parents :`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "KidsSchool : fiche de résultats", text: texte, url: lien });
        setEtat("Fiche envoyée ! 📨");
        return;
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
    }
    window.location.href = `mailto:?subject=${encodeURIComponent("KidsSchool : fiche de résultats")}&body=${encodeURIComponent(`${texte}\n\n${lien}`)}`;
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
          ? "📬 Tes parents vont lire tes réponses écrites et te laisser des commentaires."
          : "🔒 La correction détaillée est dans l'Espace parents."}
      </p>

      <div className="relative flex w-full flex-col gap-3">
        <button type="button" onClick={envoyer} className={boutonPrincipal}>📨 Envoyer ma fiche à un parent</button>
        <button type="button" onClick={copier} className={boutonSecondaire}>🔗 Copier le lien de la fiche</button>
        {etat && <p role="status" className="font-semibold text-succes">{etat}</p>}
        <div className="grid grid-cols-2 gap-3">
          <Link href={retour} className={boutonSecondaire}>🗺️ Mon chemin</Link>
          <button type="button" onClick={() => window.location.reload()} className={boutonSecondaire}>🔁 Rejouer</button>
        </div>
      </div>
    </main>
  );
}
