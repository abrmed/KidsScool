import { anglais } from "./anglais";
import { francais } from "./francais";
import { maths } from "./maths";
import type { Matiere, MatiereId, Niveau, Unite } from "./types";

export const MATIERES: Matiere[] = [anglais, francais, maths];
export const NIVEAUX: Niveau[] = [1, 2, 3, 4, 5];
export const QUESTIONS_PAR_LECON = 8;

export const trouverMatiere = (id: string | null) => MATIERES.find((m) => m.id === id) ?? null;

export function trouverUnite(matiere: MatiereId | string | null, unite: string | null): { matiere: Matiere; unite: Unite } | null {
  const m = trouverMatiere(matiere);
  const u = m?.unites.find((x) => x.id === unite);
  return m && u ? { matiere: m, unite: u } : null;
}

export const estNiveau = (x: number): x is Niveau => NIVEAUX.includes(x as Niveau);
