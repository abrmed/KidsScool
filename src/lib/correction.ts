import type { Question } from "@/contenu/types";

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

/** Lit un nombre tapé à la québécoise ou à l'anglaise (« 21,25 », « 21.25 », « 21,25 $ »). */
export function lireNombre(texte: string): number | null {
  const propre = texte.replace(/[−–—]/g, "-").replace(/\s/g, "").replace(",", ".").replace(/[^0-9.\-]/g, "");
  if (!propre || propre === "-" || propre === ".") return null;
  const n = Number(propre);
  return Number.isFinite(n) ? n : null;
}

/** La bonne réponse, telle qu'on l'affiche aux parents. */
export function bonneReponse(q: Question): string {
  if (q.type === "choix") return q.bonne;
  if (q.type === "saisie") return q.acceptees[0];
  return q.mots.join(" ");
}

/** Vérifie la réponse donnée par l'élève. */
export function estCorrecte(q: Question, donnee: string): boolean {
  if (q.type === "choix") return donnee === q.bonne;
  if (q.type === "ordre") return normaliser(donnee) === normaliser(q.mots.join(" "));
  if (q.format === "nombre") {
    const n = lireNombre(donnee);
    return n !== null && q.acceptees.some((a) => {
      const attendu = lireNombre(a);
      return attendu !== null && Math.abs(attendu - n) < 0.005;
    });
  }
  return q.acceptees.some((a) => normaliser(a) === normaliser(donnee));
}

/** Étoiles gagnées selon le score (0 à 3). */
export function etoiles(score: number, total: number) {
  const ratio = total ? score / total : 0;
  return ratio >= 1 ? 3 : ratio >= 0.75 ? 2 : ratio >= 0.5 ? 1 : 0;
}
