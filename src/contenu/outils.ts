import type { Niveau, Question, QuestionBanque, Unite } from "./types";

/** Générateur pseudo-aléatoire reproductible (même graine = mêmes questions). */
export function creerHasard(graine: number) {
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const entier = (h: () => number, min: number, max: number) => min + Math.floor(h() * (max - min + 1));
export const choisir = <T,>(h: () => number, liste: readonly T[]) => liste[Math.floor(h() * liste.length)];

export function melanger<T>(h: () => number, liste: readonly T[]): T[] {
  const copie = [...liste];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(h() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

/**
 * Unité basée sur une banque de questions écrites à la main.
 * Une leçon de niveau N prend surtout des questions de niveau N, complétées par le niveau voisin.
 */
export function uniteBanque(
  infos: Omit<Unite, "produire">,
  banque: QuestionBanque[],
): Unite {
  return {
    ...infos,
    produire(niveau, nombre, h) {
      // Priorité au niveau demandé, puis aux niveaux voisins ; un peu de hasard pour varier.
      const tries = banque
        .map((q) => ({ q, cle: Math.abs(q.niveau - niveau) + h() * 0.9 }))
        .sort((a, b) => a.cle - b.cle)
        .map((x) => x.q);
      return melanger(h, tries.slice(0, nombre)).map((q) => {
        const { niveau: _niveau, ...question } = q; // eslint-disable-line @typescript-eslint/no-unused-vars
        return question as Question;
      });
    },
  };
}

/** Unité basée sur un générateur (mathématiques) : questions toujours nouvelles et justes. */
export function uniteGeneree(
  infos: Omit<Unite, "produire">,
  generer: (niveau: Niveau, h: () => number) => Question,
): Unite {
  return {
    ...infos,
    produire(niveau, nombre, h) {
      const vues = new Set<string>();
      const resultat: Question[] = [];
      for (let essais = 0; resultat.length < nombre && essais < nombre * 20; essais++) {
        const q = generer(niveau, h);
        if (!vues.has(q.enonce)) {
          vues.add(q.enonce);
          resultat.push(q);
        }
      }
      return resultat;
    },
  };
}

/** Formate un nombre à la québécoise (virgule décimale). */
export const nb = (x: number) => String(Math.round(x * 1000) / 1000).replace(".", ",");
