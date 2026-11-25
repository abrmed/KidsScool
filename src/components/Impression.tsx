"use client";
// Feuilles d'exercices à imprimer (feuille élève + corrigé), dans l'Espace parents.
import { useState } from "react";
import { MATIERES, NIVEAUX, QUESTIONS_PAR_LECON, trouverTexte } from "@/contenu";
import { creerHasard, melanger } from "@/contenu/outils";
import { NOMS_NIVEAUX, type Niveau, type Question } from "@/contenu/types";
import { bonneReponse } from "@/lib/correction";
import { boutonPrincipal, boutonSecondaire } from "./ui";

const selecteur = "h-12 rounded-2xl border-2 border-bordure bg-surface px-3 font-semibold";

function Lignes({ n }: { n: number }) {
  return (
    <div aria-hidden className="mt-2 flex flex-col">
      {Array.from({ length: n }, (_, i) => <div key={i} className="h-8 border-b border-dashed border-gray-400" />)}
    </div>
  );
}

export function Impression() {
  const [matiereId, setMatiereId] = useState(MATIERES.find((m) => m.id === "francais")?.id ?? MATIERES[0].id);
  const matiere = MATIERES.find((m) => m.id === matiereId)!;
  const [uniteId, setUniteId] = useState(matiere.unites[0].id);
  const unite = matiere.unites.find((u) => u.id === uniteId) ?? matiere.unites[0];
  const [niveau, setNiveau] = useState<Niveau>(1);
  const [graine, setGraine] = useState(() => Date.now());
  const [corrige, setCorrige] = useState(false);

  // Même graine = mêmes questions : la feuille et le corrigé correspondent toujours.
  const questions = unite.produire(niveau, unite.nombreQuestions ?? QUESTIONS_PAR_LECON, creerHasard(graine));
  const texte = trouverTexte(questions.find((q) => q.texteId)?.texteId);
  const dictee = questions.some((q) => q.type === "dictee");

  function imprimer(avecCorrige: boolean) {
    setCorrige(avecCorrige);
    setTimeout(() => window.print(), 100);
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="pas-imprimer flex flex-col gap-3 rounded-3xl bg-surface p-5 ring-1 ring-bordure">
        <h2 className="text-xl font-semibold">🖨️ Imprimer une feuille d&apos;exercices</h2>
        <p className="text-sm text-texte-doux">Choisis la matière, l&apos;unité et le niveau. Les questions changent à chaque nouvelle feuille. Imprime la feuille pour l&apos;enfant, puis le corrigé pour toi.</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm font-bold">Matière
            <select className={selecteur} value={matiereId} onChange={(e) => { const m = MATIERES.find((x) => x.id === e.target.value)!; setMatiereId(m.id); setUniteId(m.unites[0].id); }}>
              {MATIERES.map((m) => <option key={m.id} value={m.id}>{m.icone} {m.nom}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold">Unité
            <select className={selecteur} value={unite.id} onChange={(e) => setUniteId(e.target.value)}>
              {matiere.unites.map((u) => <option key={u.id} value={u.id}>{u.icone} {u.titre}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold">Niveau
            <select className={selecteur} value={niveau} onChange={(e) => setNiveau(Number(e.target.value) as Niveau)}>
              {NIVEAUX.map((n) => <option key={n} value={n}>{n} · {NOMS_NIVEAUX[n]}</option>)}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={`${boutonPrincipal} min-h-12 text-base`} onClick={() => imprimer(false)}>🖨️ Imprimer la feuille</button>
          <button type="button" className={`${boutonSecondaire} min-h-12 text-base`} onClick={() => imprimer(true)}>🖨️ Imprimer le corrigé</button>
          <button type="button" className={`${boutonSecondaire} min-h-12 text-base`} onClick={() => setGraine(Date.now())}>🔄 Autres questions</button>
        </div>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={corrige} onChange={(e) => setCorrige(e.target.checked)} className="h-5 w-5" /> Voir le corrigé à l&apos;écran
        </label>
      </div>

      {/* Zone imprimée : toujours en noir sur blanc. */}
      <article className="zone-impression rounded-3xl bg-white p-6 text-black shadow-sm ring-1 ring-bordure sm:p-8">
        <header className="border-b-2 border-black pb-3">
          <p className="text-sm font-bold uppercase tracking-wide">KidsSchool · {corrige ? "Corrigé (parents)" : "Feuille d'exercices"}</p>
          <h3 className="mt-1 text-2xl font-bold text-black">{matiere.nom} — {unite.titre}</h3>
          <p className="font-semibold">Niveau {niveau} · {NOMS_NIVEAUX[niveau]}</p>
          {!corrige && <p className="mt-3 flex flex-wrap gap-x-8 gap-y-2 font-semibold"><span>Nom : ____________________</span><span>Date : ______________</span><span>Score : ____ / {questions.length}</span></p>}
        </header>

        {texte && (
          <section className="mt-4 break-inside-avoid-page">
            <h4 className="text-xl font-bold text-black">📖 {texte.titre}</h4>
            <p className="text-sm italic">{texte.genre}</p>
            {texte.paragraphes.map((p, i) => (
              <p key={i} className="mt-2 leading-relaxed"><strong>{i + 1}.</strong> {p}</p>
            ))}
          </section>
        )}

        {dictee && !corrige && <p className="mt-4 rounded-lg border border-black p-2 text-sm font-semibold">Dictée : un parent lit chaque phrase à voix haute (les phrases sont dans le corrigé).</p>}

        <ol className="mt-5 flex flex-col gap-5">
          {questions.map((q, i) => (
            <li key={i} className="break-inside-avoid">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-600">Question {i + 1} · {q.consigne}</p>
              {q.type !== "dictee" && <p className="mt-0.5 text-lg font-semibold">{q.enonce}</p>}
              {corrige ? <Corrige q={q} /> : <Espace q={q} i={i} graine={graine} />}
            </li>
          ))}
        </ol>
      </article>
    </section>
  );
}

function Espace({ q, i, graine }: { q: Question; i: number; graine: number }) {
  switch (q.type) {
    case "choix":
      return (
        <ul className="mt-1 grid gap-1 sm:grid-cols-2">
          {melanger(creerHasard(graine + i), [q.bonne, ...q.autres]).map((o) => <li key={o}>☐ {o}</li>)}
        </ul>
      );
    case "saisie":
      return q.enonce.length > 60 ? <><p className="mt-1 text-sm">Démarche :</p><Lignes n={3} /><p className="mt-2 font-semibold">Réponse : ______________</p></> : <p className="mt-1 font-semibold">Réponse : ______________</p>;
    case "ordre":
      return <><p className="mt-1">Mots : {melanger(creerHasard(graine + i), [...q.mots, ...(q.intrus ?? [])]).map((m) => `[ ${m} ]`).join("  ")}</p><Lignes n={2} /></>;
    case "redaction":
      return <Lignes n={6} />;
    case "dictee":
      return <><p className="mt-1 font-semibold">Phrase {i + 1} :</p><Lignes n={2} /></>;
  }
}

function Corrige({ q }: { q: Question }) {
  return (
    <div className="mt-1 rounded-lg border border-gray-400 p-2">
      {q.type === "dictee" ? (
        <p><strong>Phrase à dicter :</strong> {q.phrase}</p>
      ) : (
        <p><strong>{q.type === "redaction" ? "Réponse modèle" : "Réponse"} :</strong> {bonneReponse(q)}</p>
      )}
      <p className="mt-1 text-sm">{q.explication}</p>
      {q.type === "redaction" && (
        <ul className="mt-1 list-disc pl-5 text-sm">
          {q.criteres.map((c) => <li key={c.idee}>À trouver : {c.idee}</li>)}
        </ul>
      )}
    </div>
  );
}
