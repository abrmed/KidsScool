import type { Commentaire, Question, QuestionDictee, QuestionRedaction } from "@/contenu/types";

/** Met une réponse tapée sous une forme comparable (majuscules, espaces, apostrophes, tirets). */
export function normaliser(texte: string) {
  return texte
    .trim()
    .toLowerCase()
    .replace(/[’`´]/g, "'")
    .replace(/[−–—]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/\s*([?!.])$/, "");
}

/** Sans accents ni majuscules (pour repérer des idées dans une réponse rédigée). */
export const sansAccents = (t: string) =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[’`´]/g, "'");

/** Lit un nombre tapé à la québécoise ou à l'anglaise (« 21,25 », « 21.25 », « 21,25 $ »). */
export function lireNombre(texte: string): number | null {
  const propre = texte.replace(/[−–—]/g, "-").replace(/\s/g, "").replace(",", ".").replace(/[^0-9.\-]/g, "");
  if (!propre || propre === "-" || propre === ".") return null;
  const n = Number(propre);
  return Number.isFinite(n) ? n : null;
}

/** La bonne réponse, telle qu'on l'affiche aux parents. */
export function bonneReponse(q: Question): string {
  switch (q.type) {
    case "choix": return q.bonne;
    case "saisie": return q.acceptees[0];
    case "ordre": return q.mots.join(" ");
    case "redaction": return q.modele;
    case "dictee": return q.phrase;
  }
}

export type Evaluation = { points: number; commentaires?: Commentaire[] };

/** Corrige une réponse : points (0, ½ ou 1) et, pour les réponses rédigées et la dictée, des commentaires. */
export function evaluer(q: Question, donnee: string): Evaluation {
  switch (q.type) {
    case "choix": return { points: donnee === q.bonne ? 1 : 0 };
    case "ordre": return { points: normaliser(donnee) === normaliser(q.mots.join(" ")) ? 1 : 0 };
    case "saisie": {
      if (q.format === "nombre") {
        const n = lireNombre(donnee);
        const ok = n !== null && q.acceptees.some((a) => { const att = lireNombre(a); return att !== null && Math.abs(att - n) < 0.005; });
        return { points: ok ? 1 : 0 };
      }
      return { points: q.acceptees.some((a) => normaliser(a) === normaliser(donnee)) ? 1 : 0 };
    }
    case "redaction": return evaluerRedaction(q, donnee);
    case "dictee": return evaluerDictee(q, donnee);
  }
}

export const estCorrecte = (q: Question, donnee: string) => evaluer(q, donnee).points === 1;

// ── Réponse rédigée ───────────────────────────────────────────
function evaluerRedaction(q: QuestionRedaction, donnee: string): Evaluation {
  const texte = ` ${sansAccents(donnee).replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ")} `;
  const commentaires: Commentaire[] = [];
  let trouvees = 0;
  for (const c of q.criteres) {
    const ok = c.mots.some((m) => texte.includes(sansAccents(m)));
    if (ok) trouvees++;
    commentaires.push(ok ? { ok: true, texte: `Bien vu : ${c.idee}` } : { ok: false, texte: c.siAbsent });
  }
  const mots = donnee.trim().split(/\s+/).filter(Boolean).length;
  const min = q.minMots ?? 8;
  if (mots > 0 && mots < min) commentaires.push({ ok: false, texte: `Ta réponse est courte (${mots} mots). Développe en une ou deux phrases complètes et appuie-toi sur le texte.` });
  const propre = donnee.trim();
  if (propre && (!/^[A-ZÀ-Ÿ«"]/.test(propre) || !/[.!?»"]$/.test(propre))) {
    commentaires.push({ ok: false, texte: "Pense à écrire une phrase complète : une majuscule au début et un point à la fin." });
  }
  const ratio = q.criteres.length ? trouvees / q.criteres.length : 0;
  const points = mots === 0 ? 0 : ratio >= 1 ? 1 : ratio >= 0.5 ? 0.5 : 0;
  return { points, commentaires };
}

// ── Dictée ────────────────────────────────────────────────────
const mots = (t: string) => t.replace(/[’`´]/g, "'").replace(/([.,;:!?«»"])/g, " ").split(/\s+/).filter(Boolean);

function evaluerDictee(q: QuestionDictee, donnee: string): Evaluation {
  const attendus = mots(q.phrase);
  const ecrits = mots(donnee);
  const A = attendus.map((m) => m.toLowerCase());
  const E = ecrits.map((m) => m.toLowerCase());

  // Alignement des mots (plus longue sous-suite commune).
  const L = Array.from({ length: A.length + 1 }, () => new Array<number>(E.length + 1).fill(0));
  for (let i = A.length - 1; i >= 0; i--) for (let j = E.length - 1; j >= 0; j--)
    L[i][j] = A[i] === E[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);

  const commentaires: Commentaire[] = [];
  let erreurs = 0;
  let i = 0, j = 0;
  const manquants: string[] = [], enTrop: string[] = [];
  const vider = () => {
    // Dans un « trou », on associe les mots deux à deux (substitutions), puis le reste est manquant ou en trop.
    while (manquants.length && enTrop.length) {
      const a = manquants.shift()!, e = enTrop.shift()!;
      erreurs++;
      commentaires.push({ ok: false, texte: expliquer(a, e, q.conseils) });
    }
    manquants.splice(0).forEach((a) => { erreurs++; commentaires.push({ ok: false, texte: `Il manque le mot « ${a} ».` }); });
    enTrop.splice(0).forEach((e) => { erreurs++; commentaires.push({ ok: false, texte: `Le mot « ${e} » est en trop.` }); });
  };
  while (i < A.length || j < E.length) {
    if (i < A.length && j < E.length && A[i] === E[j]) { vider(); i++; j++; }
    else if (j < E.length && (i === A.length || L[i][j + 1] >= L[i + 1][j])) { enTrop.push(ecrits[j]); j++; }
    else { manquants.push(attendus[i]); i++; }
  }
  vider();

  const propre = donnee.trim();
  if (propre && /^[a-zà-ÿ]/.test(propre)) { erreurs++; commentaires.push({ ok: false, texte: "Une phrase commence toujours par une majuscule." }); }
  if (propre && !/[.!?]$/.test(propre)) { erreurs++; commentaires.push({ ok: false, texte: "N'oublie pas le point à la fin de la phrase." }); }

  if (erreurs === 0 && propre) commentaires.push({ ok: true, texte: "Aucune faute : bravo !" });
  const points = !propre ? 0 : erreurs === 0 ? 1 : erreurs <= 2 ? 0.5 : 0;
  return { points, commentaires };
}

function expliquer(attendu: string, ecrit: string, conseils?: Record<string, string>) {
  const conseil = conseils?.[attendu.toLowerCase()];
  const base = `Tu as écrit « ${ecrit} », il fallait « ${attendu} ».`;
  if (sansAccents(attendu) === sansAccents(ecrit)) return `${base} Attention aux accents.`;
  if (conseil) return `${base} ${conseil}`;
  const racine = (m: string) => sansAccents(m).replace(/(ent|es|s|x|e)$/, "");
  if (racine(attendu) === racine(ecrit)) return `${base} Vérifie l'accord (masculin/féminin, singulier/pluriel ou terminaison du verbe).`;
  return base;
}

/** Étoiles gagnées selon le score (0 à 3). */
export function etoiles(score: number, total: number) {
  const ratio = total ? score / total : 0;
  return ratio >= 1 ? 3 : ratio >= 0.75 ? 2 : ratio >= 0.5 ? 1 : 0;
}

/** Affiche un score avec demi-points (« 6,5 »). */
export const afficherScore = (n: number) => String(Math.round(n * 2) / 2).replace(".", ",");
