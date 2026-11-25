// Mathématiques — résolution de problèmes, 2e secondaire (PFEQ).
// Situations de la vie courante en plusieurs étapes. Les données changent à chaque leçon ;
// les réponses et la démarche (pour les parents) sont calculées.
import { choisir, entier, nb, uniteGeneree } from "./outils";
import type { Niveau, Question } from "./types";

const PRENOMS = ["Alex", "Mia", "Léo", "Zoé", "Sami", "Inès", "Jules", "Rosalie", "Malik", "Chloé"];
const arrondi = (x: number, d = 2) => Math.round(x * 10 ** d) / 10 ** d;
const $ = (x: number) => `${nb(arrondi(x))} $`;

const probleme = (enonce: string, reponse: number, demarche: string): Question => ({
  type: "saisie",
  format: "nombre",
  consigne: "Résous le problème",
  enonce,
  acceptees: [nb(arrondi(reponse))],
  explication: `Démarche : ${demarche}`,
});

type Gabarit = (h: () => number) => Question;

const NIVEAU_1: Gabarit[] = [
  (h) => {
    const p = choisir(h, PRENOMS), n = entier(h, 3, 6), prix = entier(h, 5, 15) * 0.25 + 1, regle = choisir(h, [1.25, 1.5, 2.25]);
    const total = n * prix + regle, billet = total < 20 ? 20 : 50;
    return probleme(`${p} achète ${n} cahiers à ${$(prix)} chacun et une règle à ${$(regle)}. ${p} paie avec un billet de ${billet} $. Combien d'argent lui rend-on (en $) ?`,
      billet - total, `${n} × ${nb(prix)} = ${nb(n * prix)} $ ; + ${nb(regle)} = ${nb(arrondi(total))} $ ; ${billet} − ${nb(arrondi(total))} = ${nb(arrondi(billet - total))} $.`);
  },
  (h) => {
    const eleves = choisir(h, [24, 25, 28, 30, 32]), bus = entier(h, 30, 60) * 10, entree = entier(h, 6, 15);
    const parEleve = (bus + entree * eleves) / eleves;
    return probleme(`Pour une sortie, l'autobus coûte ${bus} $ au total et l'entrée au musée coûte ${entree} $ par élève. Il y a ${eleves} élèves. Combien chaque élève doit-il payer (en $) ?`,
      parEleve, `Entrées : ${entree} × ${eleves} = ${entree * eleves} $ ; total : ${bus} + ${entree * eleves} = ${bus + entree * eleves} $ ; par élève : ${bus + entree * eleves} ÷ ${eleves} = ${nb(arrondi(parEleve))} $.`);
  },
  (h) => {
    const pages = entier(h, 12, 30) * 10, parJour = entier(h, 15, 30), deja = entier(h, 2, 5);
    const reste = pages - parJour * deja;
    return probleme(`Un roman compte ${pages} pages. Jules lit ${parJour} pages par jour depuis ${deja} jours. Combien de pages lui reste-t-il à lire ?`,
      reste, `Pages lues : ${parJour} × ${deja} = ${parJour * deja} ; reste : ${pages} − ${parJour * deja} = ${reste}.`);
  },
];

const NIVEAU_2: Gabarit[] = [
  (h) => {
    const prix = entier(h, 4, 16) * 5, rabais = choisir(h, [10, 20, 25, 30, 40]);
    const apres = prix * (1 - rabais / 100), final = apres * 1.15;
    return probleme(`Un jeu vidéo coûte ${prix} $. Il est en solde à −${rabais} %. On ajoute ensuite 15 % de taxes. Quel est le prix final (en $, arrondi au cent) ?`,
      final, `Rabais : ${prix} × ${rabais} % = ${nb(prix * rabais / 100)} $ ; prix réduit : ${nb(apres)} $ ; avec taxes : ${nb(apres)} × 1,15 = ${nb(arrondi(final))} $.`);
  },
  (h) => {
    const pers = choisir(h, [4, 6]), farine = choisir(h, [240, 300, 360, 480]), cible = choisir(h, [2, 3, 9, 10, 12, 15].filter((x) => x !== pers));
    const r = (farine / pers) * cible;
    return probleme(`Une recette de crêpes pour ${pers} personnes demande ${farine} g de farine. Combien de grammes faut-il pour ${cible} personnes ?`,
      r, `Pour 1 personne : ${farine} ÷ ${pers} = ${nb(farine / pers)} g ; pour ${cible} : ${nb(farine / pers)} × ${cible} = ${nb(r)} g.`);
  },
  (h) => {
    const v = choisir(h, [12, 15, 18, 20, 24]), heures = choisir(h, [1.5, 2.5, 0.75, 1.25, 3.5]);
    const hh = Math.floor(heures), mm = Math.round((heures - hh) * 60);
    return probleme(`Une cycliste roule à ${v} km/h pendant ${hh ? `${hh} h ` : ""}${mm} min. Quelle distance parcourt-elle (en km) ?`,
      v * heures, `${hh} h ${mm} min = ${nb(heures)} h ; distance = vitesse × temps = ${v} × ${nb(heures)} = ${nb(v * heures)} km.`);
  },
];

const NIVEAU_3: Gabarit[] = [
  (h) => {
    const l = entier(h, 6, 20), ecart = entier(h, 2, 9), L = l + ecart, per = 2 * (l + L);
    return probleme(`Le périmètre d'un rectangle est de ${per} cm. Sa longueur mesure ${ecart} cm de plus que sa largeur. Quelle est sa largeur (en cm) ?`,
      l, `Si la largeur est x : 2(x + x + ${ecart}) = ${per} → 4x + ${2 * ecart} = ${per} → 4x = ${per - 2 * ecart} → x = ${l} cm.`);
  },
  (h) => {
    const fixeA = choisir(h, [10, 15, 20]), parMin = choisir(h, [0.1, 0.2, 0.25]), minutes = choisir(h, [40, 60, 80, 100, 120]);
    const fixeB = fixeA + parMin * minutes;
    return probleme(`Forfait A : ${fixeA} $ par mois + ${nb(parMin)} $ par minute d'appel. Forfait B : ${nb(fixeB)} $ par mois, appels illimités. Pour combien de minutes les deux forfaits coûtent-ils le même prix ?`,
      minutes, `${fixeA} + ${nb(parMin)}x = ${nb(fixeB)} → ${nb(parMin)}x = ${nb(fixeB - fixeA)} → x = ${minutes} minutes. Au-delà, le forfait B est plus avantageux.`);
  },
  (h) => {
    const premier = entier(h, 8, 60), somme = 3 * premier + 3;
    return probleme(`La somme de trois nombres entiers consécutifs est ${somme}. Quel est le plus petit de ces nombres ?`,
      premier, `x + (x + 1) + (x + 2) = ${somme} → 3x + 3 = ${somme} → 3x = ${somme - 3} → x = ${premier}.`);
  },
  (h) => {
    const p = choisir(h, PRENOMS), billets = entier(h, 8, 20), prixE = choisir(h, [5, 6, 8]), prixA = prixE + choisir(h, [4, 6, 7]);
    const enfants = entier(h, 2, billets - 2), total = enfants * prixE + (billets - enfants) * prixA;
    return probleme(`${p} vend ${billets} billets pour un spectacle de l'école : ${prixE} $ pour un enfant et ${prixA} $ pour un adulte. La vente rapporte ${total} $. Combien de billets pour enfants ont été vendus ?`,
      enfants, `Si x billets enfants : ${prixE}x + ${prixA}(${billets} − x) = ${total} → ${prixA * billets} − ${prixA - prixE}x = ${total} → x = ${enfants}.`);
  },
];

const NIVEAU_4: Gabarit[] = [
  (h) => {
    const L = entier(h, 6, 12), l = entier(h, 3, 6), prof = choisir(h, [1.2, 1.5, 1.8, 2]);
    const v = L * l * prof;
    return probleme(`Une piscine rectangulaire mesure ${L} m de long, ${l} m de large et ${nb(prof)} m de profondeur. Combien de litres d'eau faut-il pour la remplir ? (1 m³ = 1000 L)`,
      v * 1000, `Volume : ${L} × ${l} × ${nb(prof)} = ${nb(v)} m³ ; en litres : ${nb(v)} × 1000 = ${nb(v * 1000)} L.`);
  },
  (h) => {
    const notes = [entier(h, 60, 95), entier(h, 60, 95), entier(h, 60, 95)], visee = choisir(h, [75, 80, 85]);
    const besoin = 4 * visee - notes.reduce((a, b) => a + b, 0);
    if (besoin < 40 || besoin > 100) return NIVEAU_4[1](h);
    return probleme(`Aux trois premiers examens, Zoé a obtenu ${notes.join(" %, ")} %. Quelle note doit-elle obtenir au 4e examen pour avoir une moyenne de ${visee} % ?`,
      besoin, `Total visé : 4 × ${visee} = ${4 * visee} ; déjà obtenu : ${notes.join(" + ")} = ${notes.reduce((a, b) => a + b, 0)} ; il manque ${besoin} %.`);
  },
  (h) => {
    const r = entier(h, 2, 12);
    return probleme(`Quelle est l'aire d'un disque de ${r} cm de rayon ? (Utilise π ≈ 3,14 ; réponse en cm²)`,
      3.14 * r * r, `Aire = π × r² = 3,14 × ${r}² = 3,14 × ${r * r} = ${nb(arrondi(3.14 * r * r))} cm².`);
  },
  (h) => {
    const L = entier(h, 15, 30), l = entier(h, 10, 20), c = entier(h, 3, 6);
    const reste = L * l - c * c;
    return probleme(`Un terrain rectangulaire de ${L} m sur ${l} m contient un potager carré de ${c} m de côté. Le reste est couvert de gazon. Quelle est l'aire du gazon (en m²) ?`,
      reste, `Terrain : ${L} × ${l} = ${L * l} m² ; potager : ${c} × ${c} = ${c * c} m² ; gazon : ${L * l} − ${c * c} = ${reste} m².`);
  },
];

const NIVEAU_5: Gabarit[] = [
  (h) => {
    const avant = entier(h, 8, 30) * 5, pct = choisir(h, [10, 15, 20, 25, 40]), apres = avant * (1 + pct / 100);
    return probleme(`Le prix d'un abonnement passe de ${avant} $ à ${nb(apres)} $. Quel est le pourcentage d'augmentation (en %) ?`,
      pct, `Augmentation : ${nb(apres)} − ${avant} = ${nb(apres - avant)} $ ; ${nb(apres - avant)} ÷ ${avant} = ${nb(pct / 100)} = ${pct} %.`);
  },
  (h) => {
    const echelle = choisir(h, [25000, 50000, 100000]), cm = entier(h, 3, 15);
    const km = (cm * echelle) / 100000;
    return probleme(`Sur une carte à l'échelle 1 : ${echelle.toLocaleString("fr-CA")}, deux villages sont à ${cm} cm l'un de l'autre. Quelle est la distance réelle (en km) ?`,
      km, `${cm} cm × ${echelle} = ${cm * echelle} cm = ${nb(km)} km (100 000 cm = 1 km).`);
  },
  (h) => {
    const r = entier(h, 2, 8), b = entier(h, 1, 6), v = entier(h, 1, 6), total = r + b + v;
    return probleme(`Un sac contient ${r} billes rouges, ${b} billes bleues et ${v} billes vertes. On tire une bille au hasard. Quelle est la probabilité de tirer une bille bleue (en %, arrondie à l'unité) ?`,
      Math.round((b / total) * 100), `Probabilité = cas favorables ÷ cas possibles = ${b} ÷ ${total} ≈ ${nb(arrondi(b / total, 3))} ≈ ${Math.round((b / total) * 100)} %.`);
  },
  (h) => {
    const litres = choisir(h, [8, 10, 12, 15]), min = choisir(h, [2, 3, 4, 5]), bassin = entier(h, 8, 30) * 10;
    const t = bassin / (litres / min);
    return probleme(`Un robinet remplit ${litres} L d'eau en ${min} minutes. Combien de minutes faut-il pour remplir un bassin de ${bassin} L ? (arrondi au dixième)`,
      arrondi(t, 1), `Débit : ${litres} ÷ ${min} = ${nb(litres / min)} L/min ; temps : ${bassin} ÷ ${nb(litres / min)} ≈ ${nb(arrondi(t, 1))} min.`);
  },
];

const PAR_NIVEAU: Record<Niveau, Gabarit[]> = { 1: NIVEAU_1, 2: NIVEAU_2, 3: NIVEAU_3, 4: NIVEAU_4, 5: NIVEAU_5 };

export const uniteProblemes = uniteGeneree(
  { id: "problemes", titre: "Résolution de problèmes", icone: "🧩", description: "Situations en plusieurs étapes : argent, recettes, équations, aires, probabilités" },
  (niveau, h) => choisir(h, PAR_NIVEAU[niveau])(h),
);
