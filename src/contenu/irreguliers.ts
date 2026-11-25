// Anglais — verbes irréguliers (questions générées à partir d'une liste de 65 verbes).
import { choisir, melanger, uniteGeneree } from "./outils";
import type { Niveau, Question } from "./types";

/** [base, prétérit, participe passé, sens en français, complément pour une phrase, groupe de difficulté 1-3] */
type Verbe = [string, string, string, string, string, 1 | 2 | 3];

const VERBES: Verbe[] = [
  ["be", "was/were", "been", "être", "very happy", 1],
  ["go", "went", "gone", "aller", "to the park", 1],
  ["have", "had", "had", "avoir", "a great idea", 1],
  ["do", "did", "done", "faire", "my homework", 1],
  ["make", "made", "made", "fabriquer, faire", "a cake", 1],
  ["see", "saw", "seen", "voir", "a movie", 1],
  ["come", "came", "come", "venir", "home late", 1],
  ["get", "got", "got/gotten", "obtenir, recevoir", "a new phone", 1],
  ["say", "said", "said", "dire", "hello", 1],
  ["take", "took", "taken", "prendre", "the bus", 1],
  ["eat", "ate", "eaten", "manger", "a big sandwich", 1],
  ["drink", "drank", "drunk", "boire", "some orange juice", 1],
  ["buy", "bought", "bought", "acheter", "new shoes", 1],
  ["give", "gave", "given", "donner", "a present", 1],
  ["find", "found", "found", "trouver", "a lost wallet", 1],
  ["think", "thought", "thought", "penser", "about the test", 1],
  ["write", "wrote", "written", "écrire", "a long letter", 1],
  ["read", "read", "read", "lire", "a mystery novel", 1],
  ["run", "ran", "run", "courir", "in the race", 1],
  ["sleep", "slept", "slept", "dormir", "for ten hours", 1],
  ["swim", "swam", "swum", "nager", "in the lake", 2],
  ["speak", "spoke", "spoken", "parler", "to the teacher", 2],
  ["know", "knew", "known", "savoir, connaître", "the answer", 2],
  ["tell", "told", "told", "raconter, dire", "a funny story", 2],
  ["teach", "taught", "taught", "enseigner", "us a new song", 2],
  ["bring", "brought", "brought", "apporter", "snacks to school", 2],
  ["catch", "caught", "caught", "attraper", "the ball", 2],
  ["break", "broke", "broken", "casser", "a glass", 2],
  ["begin", "began", "begun", "commencer", "the project", 2],
  ["choose", "chose", "chosen", "choisir", "a blue shirt", 2],
  ["fall", "fell", "fallen", "tomber", "off the bike", 2],
  ["feel", "felt", "felt", "ressentir, se sentir", "tired", 2],
  ["fly", "flew", "flown", "voler (dans les airs)", "to Vancouver", 2],
  ["forget", "forgot", "forgotten", "oublier", "my keys", 2],
  ["grow", "grew", "grown", "grandir, faire pousser", "tomatoes", 2],
  ["hear", "heard", "heard", "entendre", "a strange noise", 2],
  ["keep", "kept", "kept", "garder", "the secret", 2],
  ["leave", "left", "left", "partir, quitter", "the house early", 2],
  ["lose", "lost", "lost", "perdre", "the game", 2],
  ["meet", "met", "met", "rencontrer", "a new friend", 2],
  ["pay", "paid", "paid", "payer", "for the tickets", 2],
  ["put", "put", "put", "mettre", "the books on the shelf", 2],
  ["ride", "rode", "ridden", "monter (vélo, cheval)", "a horse", 2],
  ["sell", "sold", "sold", "vendre", "lemonade", 2],
  ["send", "sent", "sent", "envoyer", "a text message", 2],
  ["sing", "sang", "sung", "chanter", "a song", 2],
  ["sit", "sat", "sat", "s'asseoir", "next to me", 2],
  ["spend", "spent", "spent", "dépenser, passer (du temps)", "all my money", 2],
  ["understand", "understood", "understood", "comprendre", "the lesson", 2],
  ["win", "won", "won", "gagner", "the championship", 2],
  ["become", "became", "become", "devenir", "a doctor", 3],
  ["bite", "bit", "bitten", "mordre", "the apple", 3],
  ["build", "built", "built", "construire", "a snow fort", 3],
  ["cost", "cost", "cost", "coûter", "twenty dollars", 3],
  ["draw", "drew", "drawn", "dessiner", "a dragon", 3],
  ["drive", "drove", "driven", "conduire", "to Quebec City", 3],
  ["fight", "fought", "fought", "se battre", "for his rights", 3],
  ["hide", "hid", "hidden", "cacher", "the gift", 3],
  ["hold", "held", "held", "tenir", "the baby", 3],
  ["lend", "lent", "lent", "prêter", "me a pencil", 3],
  ["ring", "rang", "rung", "sonner", "the bell", 3],
  ["steal", "stole", "stolen", "voler (dérober)", "a cookie", 3],
  ["throw", "threw", "thrown", "lancer", "the ball", 3],
  ["wake", "woke", "woken", "se réveiller", "up early", 3],
  ["wear", "wore", "worn", "porter (un vêtement)", "a costume", 3],
];

const SUJETS = ["I", "My sister", "We", "They", "My best friend", "The teacher", "You", "My parents"];
const MOMENTS = ["Yesterday", "Last weekend", "Last summer", "Two days ago", "Last night"];

/** Toutes les formes acceptées (« was/were » → « was » ou « were »). */
const formes = (f: string) => f.split("/");

/** Prétérit correct selon le sujet (be : was ou were). */
const PLURIELS = ["we", "they", "you", "my parents"];
function preterit(v: Verbe, sujet: string) {
  if (v[0] !== "be") return formes(v[1])[0];
  return PLURIELS.includes(sujet.toLowerCase()) ? "were" : "was";
}

/** Fausse forme régulière (piège : « goed », « buyed ») pour les choix multiples. */
const faussesFormes = (base: string) => {
  const ed = base.endsWith("e") ? `${base}d` : `${base}ed`;
  return [ed, base, `${base}ing`];
};

function question(niveau: Niveau, h: () => number): Question {
  const groupe = niveau <= 2 ? [1] : niveau === 3 ? [1, 2] : niveau === 4 ? [1, 2, 3] : [2, 3];
  const v = choisir(h, VERBES.filter((x) => groupe.includes(x[5])));
  const [base, pret, pp, sens, cplt] = v;
  const sujetDebut = choisir(h, SUJETS);
  // Après « Yesterday, … » : « my sister », mais toujours « I ».
  const sujet = sujetDebut === "I" ? "I" : sujetDebut.charAt(0).toLowerCase() + sujetDebut.slice(1);
  const moment = choisir(h, MOMENTS);

  const types = {
    1: ["preterit", "sens"],
    2: ["phrase", "preterit", "choix"],
    3: ["participe", "phrase", "choix"],
    4: ["phrase", "didnt", "parfait", "choix"],
    5: ["trois", "parfait", "didnt", "phrase"],
  }[niveau];
  // « be » ne se prête ni à « didn't … » ni à « have already … » dans nos phrases.
  const type = choisir(h, base === "be" ? types.filter((t) => t !== "didnt" && t !== "parfait") : types);
  const expl = `${base} – ${pret} – ${pp} (${sens}).`;

  switch (type) {
    case "sens":
      return {
        type: "choix",
        consigne: "What does it mean?",
        enonce: `« to ${base} » means…`,
        bonne: sens,
        autres: melanger(h, VERBES.filter((x) => x[3] !== sens).map((x) => x[3])).slice(0, 3),
        explication: expl,
      };
    case "preterit":
      return { type: "saisie", consigne: "Write the past simple", enonce: `${base} → ___`, acceptees: formes(pret), explication: expl };
    case "participe":
      return { type: "saisie", consigne: "Write the past participle", enonce: `${base} → (I have) ___`, acceptees: formes(pp), explication: expl };
    case "phrase":
      return {
        type: "saisie",
        consigne: "Complete in the past simple",
        enonce: `${moment}, ${sujet} ___ (${base}) ${cplt}.`,
        acceptees: [preterit(v, sujet)],
        explication: `Past simple : ${expl}${base === "be" ? " « was » avec I/he/she/it, « were » avec we/you/they." : ""}`,
      };
    case "choix": {
      const bonne = preterit(v, sujet);
      return {
        type: "choix",
        consigne: "Choose the right form",
        enonce: `${moment}, ${sujet} ___ ${cplt}.`,
        bonne,
        autres: base === "be"
          ? [bonne === "was" ? "were" : "was", "been", "be"]
          : faussesFormes(base).filter((f) => f !== bonne && !formes(pret).includes(f)).slice(0, 3),
        explication: `Verbe irrégulier : ${expl} On ne dit pas « ${base.endsWith("e") ? base + "d" : base + "ed"} ».`,
      };
    }
    case "didnt":
      return {
        type: "choix",
        consigne: "Choose the right form",
        enonce: `${sujetDebut} didn't ___ ${cplt}.`,
        bonne: base,
        autres: [formes(pret)[0], formes(pp)[0], `${base}ing`].filter((f, i, t) => f !== base && t.indexOf(f) === i),
        explication: `Après « didn't » (ou « did » dans une question), on utilise la forme de base : ${base}.`,
      };
    case "parfait":
      return {
        type: "saisie",
        consigne: "Complete in the present perfect",
        enonce: `${sujetDebut} ${sujetDebut === "I" || PLURIELS.includes(sujet.toLowerCase()) ? "have" : "has"} already ___ (${base}) ${cplt}.`,
        acceptees: formes(pp),
        explication: `Present perfect = have/has + participe passé : ${pp}. ${expl}`,
      };
    default:
      return {
        type: "saisie",
        consigne: "Write the three forms",
        enonce: `« ${sens} » → base form, past simple, past participle`,
        acceptees: formes(pret).flatMap((p) => formes(pp).flatMap((q) => [`${base} ${p} ${q}`, `${base}, ${p}, ${q}`, `${base} - ${p} - ${q}`, `${base}-${p}-${q}`])),
        explication: expl,
      };
  }
}

export const uniteIrreguliers = uniteGeneree(
  { id: "irregular", titre: "Irregular verbs", icone: "🔥", description: "65 verbes irréguliers : past simple, past participle" },
  question,
);
