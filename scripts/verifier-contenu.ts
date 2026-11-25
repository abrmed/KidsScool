// Vérifie toutes les unités et tous les niveaux : nombre de questions, doublons,
// bonnes réponses acceptées par le correcteur, textes sans « NaN » ni « undefined ».
// Usage : npx tsx scripts/verifier-contenu.ts
import { MATIERES, NIVEAUX, QUESTIONS_PAR_LECON, trouverTexte } from "../src/contenu";
import { creerHasard } from "../src/contenu/outils";
import { bonneReponse, estCorrecte, evaluer } from "../src/lib/correction";
import type { QuestionDictee, QuestionRedaction } from "../src/contenu/types";

let erreurs = 0;
let verifiees = 0;
const vus = new Set<string>();
const signaler = (m: string) => { erreurs++; if (!vus.has(m) && vus.size < 40) { vus.add(m); console.log("✗", m); } };

for (const m of MATIERES) for (const u of m.unites) for (const n of NIVEAUX) for (let graine = 1; graine <= 200; graine++) {
  const attendu = u.nombreQuestions ?? QUESTIONS_PAR_LECON;
  const qs = u.produire(n, attendu, creerHasard(graine));
  const ou = `${m.id}/${u.id}/niveau ${n}`;
  if (qs.length !== attendu) signaler(`${ou} : ${qs.length} questions`);
  if (new Set(qs.map((q) => JSON.stringify(q))).size !== qs.length) signaler(`${ou} : doublon`);
  for (const q of qs) {
    verifiees++;
    const texte = JSON.stringify(q);
    if (/NaN|undefined|Infinity/.test(texte)) signaler(`${ou} : ${q.enonce}`);
    if (q.texteId && !trouverTexte(q.texteId)) signaler(`${ou} : texte introuvable ${q.texteId}`);
    if (!estCorrecte(q, bonneReponse(q))) signaler(`${ou} : bonne réponse refusée → ${q.enonce} (${bonneReponse(q)})`);
    if (q.type === "choix") {
      if (q.autres.length < 1) signaler(`${ou} : pas de distracteur → ${q.enonce}`);
      if (q.autres.includes(q.bonne)) signaler(`${ou} : distracteur = bonne réponse → ${q.enonce}`);
      if (new Set(q.autres).size !== q.autres.length) signaler(`${ou} : distracteurs en double → ${q.enonce}`);
      for (const a of q.autres) if (estCorrecte(q, a)) signaler(`${ou} : distracteur accepté → ${a}`);
    }
    if (q.type === "ordre" && (q.intrus ?? []).some((i) => q.mots.includes(i))) signaler(`${ou} : intrus présent dans la phrase`);
  }
}
// ── Cas de correction typiques (réponses rédigées et dictée) ──
const dictee: QuestionDictee = { type: "dictee", consigne: "", enonce: "", explication: "", phrase: "Mes amis sont arrivés en retard ce matin.", conseils: { "arrivés": "Accord avec « mes amis »." } };
const cas = (nom: string, ok: boolean) => { if (!ok) signaler(`correction : ${nom}`); };
cas("dictée parfaite = 1 point", evaluer(dictee, "Mes amis sont arrivés en retard ce matin.").points === 1);
const e1 = evaluer(dictee, "Mes amis sont arriver en retard ce matin.");
cas("dictée 1 faute = ½ point + conseil", e1.points === 0.5 && !!e1.commentaires?.some((c) => c.texte.includes("Accord avec")));
const e2 = evaluer(dictee, "mes ami son arrive en retar ce matin");
cas("dictée beaucoup de fautes = 0", e2.points === 0 && (e2.commentaires?.length ?? 0) >= 4);
cas("dictée accent manquant expliqué", !!evaluer(dictee, "Mes amis sont arrives en retard ce matin.").commentaires?.some((c) => c.texte.includes("accents")));
const red: QuestionRedaction = { type: "redaction", consigne: "", enonce: "", explication: "", modele: "", criteres: [
  { idee: "A", mots: ["barrage"], siAbsent: "Manque A" }, { idee: "B", mots: ["animaux"], siAbsent: "Manque B" }] };
cas("rédaction vide = 0", evaluer(red, "").points === 0);
cas("rédaction 1 idée sur 2 = ½ + commentaire", (() => { const e = evaluer(red, "Le castor construit des barrages dans les ruisseaux."); return e.points === 0.5 && !!e.commentaires?.some((c) => c.texte === "Manque B"); })());
cas("rédaction complète = 1", evaluer(red, "Le castor construit des barrages qui aident les animaux.").points === 1);
cas("rédaction sans accents reconnue", evaluer(red, "Le castor fait des BARRAGES pour les animaux.").points === 1);

console.log(`${verifiees} questions vérifiées, ${erreurs} problème(s).`);
process.exit(erreurs ? 1 : 0);
