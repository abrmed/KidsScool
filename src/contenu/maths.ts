// Mathématiques — 2e secondaire (PFEQ). Questions générées : toujours nouvelles, réponses calculées.
import { choisir, entier, melanger, nb, uniteGeneree } from "./outils";
import { uniteProblemes } from "./problemes";
import type { Matiere, Niveau, Question } from "./types";

const pgcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : pgcd(b, a % b));
const frac = (n: number, d: number) => {
  const g = pgcd(n, d) || 1;
  const s = d / g < 0 ? -1 : 1;
  return { n: (s * n) / g, d: (s * d) / g };
};
const ecrireFrac = (f: { n: number; d: number }) => (f.d === 1 ? String(f.n) : `${f.n}/${f.d}`);
const signe = (x: number) => (x < 0 ? `(${x})` : String(x));

/** Choix multiple avec distracteurs uniques. */
function qcm(consigne: string, enonce: string, bonne: string, pieges: string[], explication: string): Question {
  const autres = [...new Set(pieges.filter((p) => p !== bonne))].slice(0, 3);
  return { type: "choix", consigne, enonce, bonne, autres, explication };
}
const saisieNombre = (consigne: string, enonce: string, reponse: number, explication: string): Question => ({
  type: "saisie",
  format: "nombre",
  consigne,
  enonce,
  acceptees: [nb(reponse)],
  explication,
});

// ── 1. Nombres et opérations ─────────────────────────────────
function operations(niveau: Niveau, h: () => number): Question {
  // 2e secondaire : on commence directement aux entiers relatifs.
  if (niveau === 5) {
    const a = entier(h, 2, 6), b = entier(h, 2, 9), c = entier(h, 1, 9), d = entier(h, 2, 5);
    const r = (-a) ** 2 - d * (c - b) + (b - c) ** 2 / 1;
    return saisieNombre("Défi : priorité des opérations", `(−${a})² − ${d} × (${c} − ${b}) + (${b} − ${c})²`, r,
      `(−${a})² = ${a * a} ; ${d} × (${c - b}) = ${d * (c - b)} ; (${b - c})² = ${(b - c) ** 2} ; ${a * a} − ${signe(d * (c - b))} + ${(b - c) ** 2} = ${r}.`);
  }
  niveau = (niveau + 1) as Niveau;
  switch (niveau) {
    case 1: {
      const a = entier(h, 12, 99), b = entier(h, 2, 9), op = choisir(h, ["+", "−", "×"] as const);
      const r = op === "+" ? a + b : op === "−" ? a - b : a * b;
      return saisieNombre("Calcule", `${a} ${op} ${b} = ?`, r, `${a} ${op} ${b} = ${r}.`);
    }
    case 2: {
      const a = entier(h, -15, 15), b = entier(h, -15, 15), op = choisir(h, ["+", "−"] as const);
      const r = op === "+" ? a + b : a - b;
      return saisieNombre("Nombres entiers relatifs", `${a} ${op} ${signe(b)} = ?`, r,
        op === "−" ? `Soustraire ${signe(b)}, c'est additionner son opposé : ${a} + ${signe(-b)} = ${r}.` : `${a} + ${signe(b)} = ${r}.`);
    }
    case 3: {
      const a = entier(h, -9, 9) || 3, b = entier(h, -9, 9) || -4;
      const op = choisir(h, ["×", "÷"] as const);
      if (op === "×") return saisieNombre("Nombres entiers relatifs", `${signe(a)} × ${signe(b)} = ?`, a * b,
        `Règle des signes : ${a * b >= 0 ? "signes pareils → positif" : "signes différents → négatif"}. ${a} × ${b} = ${a * b}.`);
      const p = a * b;
      return saisieNombre("Nombres entiers relatifs", `${signe(p)} ÷ ${signe(a)} = ?`, b,
        `Règle des signes pour la division : ${p} ÷ ${a} = ${b}.`);
    }
    case 4: {
      const a = entier(h, 2, 12), b = entier(h, 2, 9), c = entier(h, 2, 9);
      const forme = choisir(h, [0, 1, 2]);
      if (forme === 0) { const r = a + b * c;
        return qcm("Priorité des opérations", `${a} + ${b} × ${c} = ?`, String(r), [String((a + b) * c), String(r + 1), String(a * b + c)],
          `On fait la multiplication avant l'addition : ${b} × ${c} = ${b * c}, puis ${a} + ${b * c} = ${r}.`); }
      if (forme === 1) { const r = (a + b) * c;
        return qcm("Priorité des opérations", `(${a} + ${b}) × ${c} = ?`, String(r), [String(a + b * c), String(r - c), String(a * c + b)],
          `Les parenthèses d'abord : ${a} + ${b} = ${a + b}, puis × ${c} = ${r}.`); }
      const r = a * a - b * c;
      return qcm("Priorité des opérations", `${a}² − ${b} × ${c} = ?`, String(r), [String((a * a - b) * c), String(2 * a - b * c), String(r + b)],
        `Exposant d'abord (${a}² = ${a * a}), puis la multiplication (${b * c}), puis la soustraction : ${r}.`);
    }
    default: {
      const a = entier(h, 2, 6), b = entier(h, -8, -2), c = entier(h, 2, 5), d = entier(h, 1, 9);
      const r = a * (b + c) * c - d;
      return saisieNombre("Défi : priorité et entiers", `${a} × (${b} + ${c}) × ${c} − ${d} = ?`, r,
        `Parenthèses : ${b} + ${c} = ${b + c}. Puis ${a} × ${b + c} × ${c} = ${a * (b + c) * c}. Enfin − ${d} = ${r}.`);
    }
  }
}

// ── 2. Fractions ─────────────────────────────────────────────
function fractions(niveau: Niveau, h: () => number): Question {
  switch (niveau) {
    case 1: {
      const k = entier(h, 2, 6), n = entier(h, 1, 7), d = entier(h, n + 1, 9);
      const f = frac(n, d);
      return qcm("Simplifie la fraction", `${n * k}/${d * k} = ?`, ecrireFrac(f), [`${n * k}/${d}`, `${n}/${d * k}`, ecrireFrac(frac(n + 1, d)), `${f.n + 1}/${f.d + 1}`],
        `On divise le numérateur et le dénominateur par ${k * pgcd(n, d)} : ${ecrireFrac(f)}.`);
    }
    case 2: {
      const d = entier(h, 5, 12), a = entier(h, 1, d - 2), b = entier(h, 1, d - a - 1);
      const f = frac(a + b, d);
      return qcm("Additionne", `${a}/${d} + ${b}/${d} = ?`, ecrireFrac(f), [`${a + b}/${2 * d}`, ecrireFrac(frac(a * b, d)), `${a + b + 1}/${d}`],
        `Même dénominateur : on additionne les numérateurs (${a} + ${b} = ${a + b}) et on garde ${d} → ${ecrireFrac(f)}.`);
    }
    case 3: {
      const d1 = choisir(h, [2, 3, 4, 5]), d2 = choisir(h, [3, 4, 6, 8, 10].filter((x) => x !== d1));
      const a = entier(h, 1, d1 - 1), b = entier(h, 1, d2 - 1);
      const f = frac(a * d2 + b * d1, d1 * d2);
      return qcm("Additionne", `${a}/${d1} + ${b}/${d2} = ?`, ecrireFrac(f), [`${a + b}/${d1 + d2}`, `${a + b}/${d1 * d2}`, ecrireFrac(frac(a * d2 + b * d1 + 1, d1 * d2))],
        `Dénominateur commun ${d1 * d2} : ${a * d2}/${d1 * d2} + ${b * d1}/${d1 * d2} = ${a * d2 + b * d1}/${d1 * d2} = ${ecrireFrac(f)}.`);
    }
    case 4: {
      const a = entier(h, 1, 5), b = entier(h, a + 1, 9), c = entier(h, 1, 5), d = entier(h, c + 1, 9);
      const div = h() < 0.5;
      const f = div ? frac(a * d, b * c) : frac(a * c, b * d);
      return qcm(div ? "Divise" : "Multiplie", `${a}/${b} ${div ? "÷" : "×"} ${c}/${d} = ?`, ecrireFrac(f),
        div ? [ecrireFrac(frac(a * c, b * d)), ecrireFrac(frac(b * c, a * d)), `${a + c}/${b + d}`] : [ecrireFrac(frac(a * d, b * c)), `${a + c}/${b + d}`, ecrireFrac(frac(a * c, b + d))],
        div ? `Diviser, c'est multiplier par l'inverse : ${a}/${b} × ${d}/${c} = ${a * d}/${b * c} = ${ecrireFrac(f)}.` : `On multiplie les numérateurs et les dénominateurs : ${a * c}/${b * d} = ${ecrireFrac(f)}.`);
    }
    default: {
      const d = choisir(h, [3, 4, 5, 6, 8]), n = entier(h, 1, d - 1), total = d * entier(h, 3, 12);
      const r = (total / d) * n;
      const objet = choisir(h, ["élèves", "billes", "pages", "dollars"]);
      return saisieNombre("Problème", `Les ${n}/${d} de ${total} ${objet}, c'est combien de ${objet} ?`, r,
        `${total} ÷ ${d} = ${total / d}, puis × ${n} = ${r}.`);
    }
  }
}

// ── 3. Pourcentages et proportions ───────────────────────────
function proportions(niveau: Niveau, h: () => number): Question {
  switch (niveau) {
    case 1: {
      const p = choisir(h, [10, 25, 50, 20]), x = entier(h, 2, 20) * 20;
      const r = (p * x) / 100;
      return saisieNombre("Pourcentage", `${p} % de ${x} = ?`, r, `${p} % = ${p}/100. ${x} × ${p} ÷ 100 = ${r}.`);
    }
    case 2: {
      const a = entier(h, 2, 6), b = entier(h, 2, 9), k = entier(h, 2, 6);
      return saisieNombre("Proportion", `Si ${a} cahiers coûtent ${a * b} $, combien coûtent ${a * k} cahiers ?`, a * k * b,
        `Un cahier coûte ${a * b} ÷ ${a} = ${b} $. ${a * k} cahiers : ${a * k} × ${b} = ${a * k * b} $.`);
    }
    case 3: {
      const prix = entier(h, 4, 30) * 5, p = choisir(h, [10, 15, 20, 25, 30, 40]);
      const r = prix * (1 - p / 100);
      return saisieNombre("Rabais", `Un chandail coûte ${prix} $. Il est en solde à −${p} %. Quel est son nouveau prix (en $) ?`, r,
        `Rabais : ${prix} × ${p}/100 = ${nb(prix * p / 100)} $. Nouveau prix : ${prix} − ${nb(prix * p / 100)} = ${nb(r)} $.`);
    }
    case 4: {
      const total = choisir(h, [20, 25, 40, 50, 80]), part = entier(h, 1, total - 1);
      const r = (part / total) * 100;
      return saisieNombre("Pourcentage", `${part} élèves sur ${total} ont choisi le soccer. Quel pourcentage (%) cela représente-t-il ?`, r,
        `${part} ÷ ${total} = ${nb(part / total)}, × 100 = ${nb(r)} %.`);
    }
    default: {
      const a = entier(h, 2, 9), b = entier(h, 2, 9), c = a * entier(h, 2, 6);
      const x = (b * c) / a;
      return saisieNombre("Règle de trois", `Trouve x : ${a}/${b} = ${c}/x`, x,
        `Produit croisé : x = ${b} × ${c} ÷ ${a} = ${nb(x)}.`);
    }
  }
}

// ── 4. Algèbre et équations ──────────────────────────────────
function equations(niveau: Niveau, h: () => number): Question {
  const x = entier(h, -6, 12) || 5;
  switch (niveau) {
    case 1: {
      const a = entier(h, 2, 15);
      return saisieNombre("Trouve x", `x + ${a} = ${x + a}`, x, `On enlève ${a} des deux côtés : x = ${x + a} − ${a} = ${x}.`);
    }
    case 2: {
      const a = entier(h, 2, 9);
      return saisieNombre("Trouve x", `${a}x = ${a * x}`, x, `On divise les deux côtés par ${a} : x = ${a * x} ÷ ${a} = ${x}.`);
    }
    case 3: {
      const a = entier(h, 2, 7), b = entier(h, -10, 10) || 4;
      return saisieNombre("Trouve x", `${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${a * x + b}`, x,
        `On isole x : ${a}x = ${a * x + b} ${b < 0 ? "+" : "−"} ${Math.abs(b)} = ${a * x}, donc x = ${x}.`);
    }
    case 4: {
      const a = entier(h, 3, 8), c = entier(h, 1, a - 1), b = entier(h, -9, 9);
      const d = a * x + b - c * x;
      return saisieNombre("Trouve x", `${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${c}x ${d < 0 ? "−" : "+"} ${Math.abs(d)}`, x,
        `On regroupe les x : ${a}x − ${c}x = ${a - c}x. Les nombres : ${d} − ${signe(b)} = ${d - b}. Donc ${a - c}x = ${d - b}, x = ${x}.`);
    }
    default: {
      const age = entier(h, 8, 16), ecart = entier(h, 20, 35), somme = 2 * age + ecart;
      return saisieNombre("Problème", `Un parent a ${ecart} ans de plus que son enfant. Ensemble, ils ont ${somme} ans. Quel âge a l'enfant ?`, age,
        `Si l'enfant a x ans : x + (x + ${ecart}) = ${somme}, donc 2x = ${somme - ecart} et x = ${age}.`);
    }
  }
}

// ── 5. Géométrie ─────────────────────────────────────────────
function geometrie(niveau: Niveau, h: () => number): Question {
  switch (niveau) {
    case 1: {
      const l = entier(h, 3, 15), w = entier(h, 2, l);
      return saisieNombre("Périmètre", `Quel est le périmètre d'un rectangle de ${l} cm sur ${w} cm (en cm) ?`, 2 * (l + w),
        `Périmètre = 2 × (longueur + largeur) = 2 × (${l} + ${w}) = ${2 * (l + w)} cm.`);
    }
    case 2: {
      const l = entier(h, 3, 15), w = entier(h, 2, 12);
      return qcm("Aire", `Quelle est l'aire d'un rectangle de ${l} m sur ${w} m ?`, `${l * w} m²`, [`${2 * (l + w)} m²`, `${l + w} m²`, `${l * w} m`],
        `Aire = longueur × largeur = ${l} × ${w} = ${l * w} m² (une aire s'exprime en unités carrées).`);
    }
    case 3: {
      const a = entier(h, 30, 90), b = entier(h, 20, 150 - a);
      return saisieNombre("Angles", `Dans un triangle, deux angles mesurent ${a}° et ${b}°. Combien mesure le troisième (en degrés) ?`, 180 - a - b,
        `La somme des angles d'un triangle vaut 180° : 180 − ${a} − ${b} = ${180 - a - b}°.`);
    }
    case 4: {
      const b = entier(h, 4, 20), hh = entier(h, 3, 15) * 2;
      return saisieNombre("Aire", `Quelle est l'aire d'un triangle de base ${b} cm et de hauteur ${hh} cm (en cm²) ?`, (b * hh) / 2,
        `Aire du triangle = base × hauteur ÷ 2 = ${b} × ${hh} ÷ 2 = ${(b * hh) / 2} cm².`);
    }
    default: {
      const B = entier(h, 8, 20), b = entier(h, 3, B - 2), hh = entier(h, 2, 10) * 2;
      return saisieNombre("Défi : trapèze", `Aire d'un trapèze : grande base ${B} cm, petite base ${b} cm, hauteur ${hh} cm (en cm²) ?`, ((B + b) * hh) / 2,
        `Aire = (grande base + petite base) × hauteur ÷ 2 = (${B} + ${b}) × ${hh} ÷ 2 = ${((B + b) * hh) / 2} cm².`);
    }
  }
}

export const maths: Matiere = {
  id: "maths",
  nom: "Mathématiques",
  icone: "🔢",
  couleur: "bleu",
  slogan: "Problèmes, fractions, équations",
  unites: [
    uniteProblemes,
    uniteGeneree({ id: "operations", titre: "Nombres et opérations", icone: "➕", description: "Entiers relatifs et priorité des opérations" }, operations),
    uniteGeneree({ id: "fractions", titre: "Fractions", icone: "🍕", description: "Simplifier, additionner, multiplier" }, fractions),
    uniteGeneree({ id: "proportions", titre: "Pourcentages et proportions", icone: "📊", description: "Rabais, règle de trois" }, proportions),
    uniteGeneree({ id: "equations", titre: "Équations", icone: "⚖️", description: "Trouver la valeur de x" }, equations),
    uniteGeneree({ id: "geometrie", titre: "Géométrie", icone: "📐", description: "Périmètre, aire, angles" }, geometrie),
  ],
};

// Évite l'avertissement « non utilisé » si on retire un jour un générateur.
void melanger;
