// Modèle des exercices. Tout est original (aucun contenu copié d'Alloprof ou d'ailleurs).

export type MatiereId = "anglais" | "francais" | "maths";

/** 1 Débutant · 2 Facile · 3 Intermédiaire · 4 Avancé · 5 Défi */
export type Niveau = 1 | 2 | 3 | 4 | 5;

export const NOMS_NIVEAUX: Record<Niveau, string> = {
  1: "Débutant",
  2: "Facile",
  3: "Intermédiaire",
  4: "Avancé",
  5: "Défi",
};

type Base = {
  /** Consigne affichée en haut (ex. « Choisis la bonne réponse »). */
  consigne: string;
  /** Énoncé de la question. */
  enonce: string;
  /** Explication pour les parents (jamais montrée à l'enfant). */
  explication: string;
  /** Texte à lire (compréhension de lecture, roman), affiché au-dessus de la question. */
  texteId?: string;
};

/** Texte de lecture original, découpé en paragraphes numérotés. */
export type Texte = {
  id: string;
  titre: string;
  /** Ex. « Récit », « Texte informatif », « Roman · Chapitre 2 » */
  genre: string;
  paragraphes: string[];
};

/** Question à choix multiple (la première option est la bonne ; l'ordre est mélangé à l'affichage). */
export type QuestionChoix = Base & { type: "choix"; bonne: string; autres: string[] };

/** Réponse à taper. Plusieurs réponses acceptées possibles. */
export type QuestionSaisie = Base & {
  type: "saisie";
  acceptees: string[];
  /** « nombre » : clavier numérique et comparaison tolérante (virgule ou point). */
  format?: "texte" | "nombre";
};

/** Remettre des mots dans l'ordre pour former la phrase. */
export type QuestionOrdre = Base & { type: "ordre"; mots: string[]; /** mots pièges ajoutés */ intrus?: string[] };

export type Question = QuestionChoix | QuestionSaisie | QuestionOrdre;

/** Question de la banque, avec son niveau. */
export type QuestionBanque = Question & { niveau: Niveau };

export type Unite = {
  id: string;
  titre: string;
  icone: string;
  description: string;
  /** Produit les questions d'une leçon (niveau donné, nombre voulu, hasard reproductible). */
  produire: (niveau: Niveau, nombre: number, hasard: () => number) => Question[];
};

export type Matiere = {
  id: MatiereId;
  nom: string;
  icone: string;
  couleur: "bleu" | "corail" | "vert";
  slogan: string;
  unites: Unite[];
};
