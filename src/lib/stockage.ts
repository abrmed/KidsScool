"use client";
// Toutes les données restent dans le navigateur de l'appareil (aucun serveur, aucune base de données).
import { useSyncExternalStore } from "react";
import type { Commentaire, MatiereId, Niveau, Question } from "@/contenu/types";

export type CodeProtege = { sel: string; empreinte: string };
/** Un joueur. « code » : code secret de l'enfant (empreinte seulement, jamais le code lui-même). */
export type Profil = { id: string; prenom: string; avatar: string; code?: CodeProtege };

export type ReponseEleve = {
  question: Question;
  donnee: string;
  correcte: boolean;
  bonneReponse: string;
  /** 0, ½ ou 1 (réponses rédigées et dictée peuvent valoir ½). Absent = 1 si correcte, sinon 0. */
  points?: number;
  /** Commentaires automatiques (réponses rédigées, dictée). */
  commentaires?: Commentaire[];
};

/** Révision d'un parent : notes ajustées, mot pour l'enfant, publication. */
export type Revue = { ajustements: Record<number, number>; motParent: string; publieeLe?: number };

/** Ce que l'enfant voit après publication par un parent (jamais les réponses des choix multiples). */
export type Retour = {
  id: string;
  profilId: string;
  prenom: string;
  titre: string;
  date: number;
  scoreInitial: number;
  scoreRevise: number;
  total: number;
  motParent: string;
  items: { numero: number; consigne: string; enonce: string; texteId?: string; donnee: string; points: number; commentaires: Commentaire[]; modele: string }[];
  vu: boolean;
};

export type Resultat = {
  id: string;
  profilId: string;
  prenom: string;
  matiere: MatiereId;
  matiereNom: string;
  uniteId: string;
  uniteTitre: string;
  niveau: Niveau;
  debut: number;
  fin: number;
  score: number;
  total: number;
  reponses: ReponseEleve[];
  /** Fiche reçue d'un autre appareil (importée par un parent). */
  importee?: boolean;
  revue?: Revue;
};

type Progression = Record<string, Partial<Record<Niveau, number>>>; // « matiere/unite » → niveau → meilleures étoiles

export type Donnees = {
  version: 1;
  profils: Profil[];
  profilActif: string | null;
  progression: Record<string, Progression>; // profilId → …
  xp: Record<string, number>;
  serie: Record<string, { dernierJour: string; jours: number }>;
  resultats: Resultat[];
  parent: CodeProtege | null;
  /** Commentaires publiés par un parent, visibles par l'enfant. */
  retours: Retour[];
};

const CLE = "kidsschool.v1";
const VIDE: Donnees = { version: 1, profils: [], profilActif: null, progression: {}, xp: {}, serie: {}, resultats: [], parent: null, retours: [] };
const MAX_RESULTATS = 400;

let cache: Donnees | null = null;
const abonnes = new Set<() => void>();

function lire(): Donnees {
  if (cache) return cache;
  try {
    const brut = window.localStorage.getItem(CLE);
    cache = brut ? { ...VIDE, ...(JSON.parse(brut) as Donnees) } : VIDE;
  } catch {
    cache = VIDE;
  }
  return cache;
}

export function modifier(fn: (d: Donnees) => Donnees) {
  cache = fn(lire());
  try {
    window.localStorage.setItem(CLE, JSON.stringify(cache));
  } catch {
    // Stockage plein ou bloqué (navigation privée) : on garde au moins en mémoire.
  }
  abonnes.forEach((f) => f());
}

function abonner(f: () => void) {
  abonnes.add(f);
  const surStockage = (e: StorageEvent) => {
    if (e.key === CLE) {
      cache = null;
      f();
    }
  };
  window.addEventListener("storage", surStockage);
  return () => {
    abonnes.delete(f);
    window.removeEventListener("storage", surStockage);
  };
}

/** Données de l'appareil, ou null pendant le premier rendu (avant lecture du navigateur). */
export function useDonnees(): Donnees | null {
  return useSyncExternalStore(abonner, lire, () => null);
}

export const nouvelId = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now() + Math.random()));

const jourLocal = (t = Date.now()) => new Date(t).toLocaleDateString("fr-CA", { timeZone: "America/Toronto" });

/** Enregistre une leçon terminée : résultat détaillé, étoiles, points et série de jours. */
export function enregistrerResultat(r: Resultat, etoilesGagnees: number) {
  modifier((d) => {
    const cle = `${r.matiere}/${r.uniteId}`;
    const prog = { ...(d.progression[r.profilId] ?? {}) };
    const unite = { ...(prog[cle] ?? {}) };
    unite[r.niveau] = Math.max(unite[r.niveau] ?? 0, etoilesGagnees);
    prog[cle] = unite;

    const aujourdHui = jourLocal(r.fin);
    const hier = jourLocal(r.fin - 86_400_000);
    const s = d.serie[r.profilId];
    const serie =
      s?.dernierJour === aujourdHui ? s : { dernierJour: aujourdHui, jours: s?.dernierJour === hier ? s.jours + 1 : 1 };

    return {
      ...d,
      progression: { ...d.progression, [r.profilId]: prog },
      xp: { ...d.xp, [r.profilId]: (d.xp[r.profilId] ?? 0) + Math.round(10 + r.score * 2) },
      serie: { ...d.serie, [r.profilId]: serie },
      resultats: [r, ...d.resultats].slice(0, MAX_RESULTATS),
    };
  });
}

/** Série affichée : remise à 0 si le dernier jour joué est avant hier. */
export function serieActuelle(d: Donnees, profilId: string) {
  const s = d.serie[profilId];
  if (!s) return 0;
  return s.dernierJour === jourLocal() || s.dernierJour === jourLocal(Date.now() - 86_400_000) ? s.jours : 0;
}

export const niveauXp = (xp: number) => ({ niveau: Math.floor(xp / 100) + 1, dansNiveau: xp % 100 });

// ── Codes secrets (parent et enfants) ─────────────────────────
async function empreinte(sel: string, code: string) {
  const donnees = new TextEncoder().encode(`${sel}:${code}`);
  const h = await crypto.subtle.digest("SHA-256", donnees);
  return Array.from(new Uint8Array(h), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Transforme un code en empreinte salée (le code n'est jamais enregistré tel quel). */
export async function protegerCode(code: string): Promise<CodeProtege> {
  const sel = nouvelId();
  return { sel, empreinte: await empreinte(sel, code) };
}

export async function codeValide(protege: CodeProtege | null | undefined, code: string) {
  return !!protege && (await empreinte(protege.sel, code)) === protege.empreinte;
}

export const formatCodeValide = (code: string, min = 4) => new RegExp(`^\\d{${min},8}$`).test(code);

export async function definirCodeParent(code: string) {
  const parent = await protegerCode(code);
  modifier((d) => ({ ...d, parent }));
}

export async function verifierCodeParent(code: string) {
  return codeValide(lire().parent, code);
}

export async function ajouterJoueur(prenom: string, avatar: string, code: string) {
  const protege = await protegerCode(code);
  modifier((d) => ({ ...d, profils: [...d.profils, { id: nouvelId(), prenom: prenom.slice(0, 20), avatar, code: protege }] }));
}

export async function changerCodeJoueur(profilId: string, code: string) {
  const protege = await protegerCode(code);
  modifier((d) => ({ ...d, profils: d.profils.map((p) => (p.id === profilId ? { ...p, code: protege } : p)) }));
}

// ── Révision par un parent et commentaires pour l'enfant ─────
export const pointsDe = (r: ReponseEleve) => r.points ?? (r.correcte ? 1 : 0);

/** Points d'une réponse après ajustement éventuel du parent. */
export const pointsRevises = (res: Resultat, i: number) => res.revue?.ajustements[i] ?? pointsDe(res.reponses[i]);
export const scoreRevise = (res: Resultat) => res.reponses.reduce((t, _, i) => t + pointsRevises(res, i), 0);

/** Questions dont l'enfant peut voir les commentaires (jamais les choix multiples). */
export const estCommentable = (r: ReponseEleve) => r.question.type === "redaction" || r.question.type === "dictee";

export function enregistrerRevue(resultatId: string, revue: Revue, resultatImporte?: Resultat) {
  modifier((d) => {
    const existe = d.resultats.some((r) => r.id === resultatId);
    const resultats = existe
      ? d.resultats.map((r) => (r.id === resultatId ? { ...r, revue } : r))
      : resultatImporte ? [{ ...resultatImporte, revue }, ...d.resultats] : d.resultats;
    return { ...d, resultats };
  });
}

/** Prépare ce que l'enfant verra (sans les réponses des choix multiples). */
export function creerRetour(res: Resultat): Retour {
  const revue = res.revue ?? { ajustements: {}, motParent: "" };
  return {
    id: res.id,
    profilId: res.profilId,
    prenom: res.prenom,
    titre: `${res.matiereNom} · ${res.uniteTitre} · niveau ${res.niveau}`,
    date: res.fin,
    scoreInitial: res.score,
    scoreRevise: scoreRevise(res),
    total: res.total,
    motParent: revue.motParent,
    items: res.reponses
      .map((r, i) => ({ r, i }))
      .filter(({ r }) => estCommentable(r))
      .map(({ r, i }) => ({
        numero: i + 1,
        consigne: r.question.consigne,
        enonce: r.question.enonce,
        texteId: r.question.texteId,
        donnee: r.donnee,
        points: pointsRevises(res, i),
        commentaires: r.commentaires ?? [],
        modele: r.bonneReponse,
      })),
    vu: false,
  };
}

/** Ajoute (ou remplace) un retour sur cet appareil. */
export function ajouterRetour(retour: Retour) {
  modifier((d) => ({ ...d, retours: [retour, ...(d.retours ?? []).filter((x) => x.id !== retour.id)] }));
}

export function marquerRetourVu(id: string) {
  modifier((d) => ({ ...d, retours: (d.retours ?? []).map((x) => (x.id === id ? { ...x, vu: true } : x)) }));
}
