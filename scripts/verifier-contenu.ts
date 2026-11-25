// Vérifie toutes les unités et tous les niveaux : nombre de questions, doublons,
// bonnes réponses acceptées par le correcteur, textes sans « NaN » ni « undefined ».
// Usage : npx tsx scripts/verifier-contenu.ts
import { MATIERES, NIVEAUX, QUESTIONS_PAR_LECON } from "../src/contenu";
import { creerHasard } from "../src/contenu/outils";
import { bonneReponse, estCorrecte } from "../src/lib/correction";

let erreurs = 0;
let verifiees = 0;
const vus = new Set<string>();
const signaler = (m: string) => { erreurs++; if (!vus.has(m) && vus.size < 40) { vus.add(m); console.log("✗", m); } };

for (const m of MATIERES) for (const u of m.unites) for (const n of NIVEAUX) for (let graine = 1; graine <= 200; graine++) {
  const qs = u.produire(n, QUESTIONS_PAR_LECON, creerHasard(graine));
  const ou = `${m.id}/${u.id}/niveau ${n}`;
  if (qs.length !== QUESTIONS_PAR_LECON) signaler(`${ou} : ${qs.length} questions`);
  if (new Set(qs.map((q) => JSON.stringify(q))).size !== qs.length) signaler(`${ou} : doublon`);
  for (const q of qs) {
    verifiees++;
    const texte = JSON.stringify(q);
    if (/NaN|undefined|Infinity/.test(texte)) signaler(`${ou} : ${q.enonce}`);
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
console.log(`${verifiees} questions vérifiées, ${erreurs} problème(s).`);
process.exit(erreurs ? 1 : 0);
