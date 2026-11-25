// Dictées — phrases originales lues à voix haute. Les « conseils » expliquent les mots difficiles
// (ils apparaissent dans la correction si l'élève se trompe sur ce mot).
import { uniteBanque } from "./outils";
import type { Niveau, QuestionBanque } from "./types";

const d = (niveau: Niveau, phrase: string, conseils: Record<string, string> = {}): QuestionBanque => ({
  type: "dictee",
  niveau,
  consigne: "Écoute et écris la phrase",
  enonce: "Écris exactement ce que tu entends, avec la ponctuation.",
  phrase,
  conseils,
  explication: `Dictée : « ${phrase} »`,
});

const PHRASES: QuestionBanque[] = [
  // Niveau 1 — présent, mots courants
  d(1, "Le chat dort sur le tapis du salon."),
  d(1, "Ma sœur aime lire des bandes dessinées.", { "sœur": "On écrit « sœur » avec un e dans l'o (œ).", dessinées: "« Bandes » est féminin pluriel : dessinées prend -ées." }),
  d(1, "Nous allons à la plage tous les étés.", { "à": "« à » est une préposition (on ne peut pas le remplacer par « avait »).", "étés": "Le nom « été » au pluriel : des étés." }),
  d(1, "Mon frère a perdu sa casquette bleue.", { a: "« a » est le verbe avoir (on peut dire « avait »).", bleue: "« Casquette » est féminin : bleue." }),
  d(1, "Les élèves écoutent la musique en classe.", { "écoutent": "Le sujet « les élèves » est pluriel : le verbe se termine par -ent." }),
  d(1, "Le soleil brille au-dessus des montagnes.", { "au-dessus": "« Au-dessus » s'écrit avec un trait d'union." }),
  // Niveau 2 — pluriels, accords, homophones
  d(2, "Les petites filles jouent dans le parc.", { petites: "« Filles » est féminin pluriel : petites.", jouent: "Sujet pluriel (les petites filles) : -ent." }),
  d(2, "Mes amis sont arrivés en retard ce matin.", { sont: "« sont » est le verbe être (on peut dire « étaient »).", "arrivés": "Avec être, le participe passé s'accorde avec le sujet « mes amis » : arrivés." }),
  d(2, "Ces gros chevaux mangent du foin.", { ces: "« ces » sert à montrer (ces chevaux-là).", chevaux: "Cheval fait « chevaux » au pluriel." }),
  d(2, "On a vu des oiseaux bleus près du lac.", { oiseaux: "Les noms en -eau prennent un x au pluriel.", bleus: "« Oiseaux » est masculin pluriel : bleus.", "près": "« près » (proche) prend un accent grave." }),
  d(2, "Elle est partie et elle a oublié son sac.", { est: "« est » est le verbe être (était).", et: "« et » relie deux actions (et puis).", son: "« son » est un déterminant (mon sac, ton sac, son sac)." }),
  d(2, "Ils ont acheté des journaux et des bijoux.", { journaux: "Journal fait « journaux » au pluriel.", bijoux: "Bijou fait partie des sept noms en -ou qui prennent un x." }),
  // Niveau 3 — imparfait, futur, passé composé
  d(3, "Quand j'étais petit, je jouais souvent dehors.", { "j'étais": "Imparfait du verbe être : j'étais.", jouais: "Imparfait avec « je » : terminaison -ais." }),
  d(3, "Demain, nous partirons tôt pour le chalet.", { partirons: "Futur simple avec « nous » : -rons.", "tôt": "« tôt » prend un accent circonflexe." }),
  d(3, "Les enfants regardaient les étoiles filantes.", { regardaient: "Imparfait avec un sujet pluriel : -aient.", filantes: "« Étoiles » est féminin pluriel : filantes." }),
  d(3, "Vous avez fini vos devoirs avant le souper.", { fini: "Participe passé de finir : fini (sans s ni t).", vos: "« vos » est un déterminant possessif pluriel." }),
  d(3, "Ma grand-mère racontait des histoires incroyables.", { "grand-mère": "« Grand-mère » s'écrit avec un trait d'union.", racontait: "Imparfait, 3e personne du singulier : -ait." }),
  d(3, "Ils iront au cinéma samedi prochain.", { iront: "Futur du verbe aller : ils iront." }),
  // Niveau 4 — participes passés, homophones difficiles
  d(4, "Les lettres que j'ai écrites sont sur la table.", { "écrites": "Avec avoir, le participe s'accorde avec le complément placé avant (« que » = les lettres) : écrites." }),
  d(4, "Elles se sont amusées toute la soirée.", { "amusées": "Verbe pronominal : ici, le participe s'accorde avec « elles » : amusées.", toute: "« toute » s'accorde avec « la soirée »." }),
  d(4, "C'est ici que mon père s'est arrêté.", { "c'est": "« c'est » = cela est.", "s'est": "« s'est » vient d'un verbe pronominal (s'arrêter)." }),
  d(4, "Leurs parents leur ont donné des conseils.", { leurs: "« leurs » devant un nom pluriel prend un s.", leur: "« leur » devant un verbe est un pronom : il ne prend jamais de s." }),
  d(4, "Quelques élèves ont lu tous les romans.", { quelques: "« quelques » (plusieurs) prend un s devant un nom pluriel.", tous: "« tous » s'accorde avec « les romans »." }),
  d(4, "Il faut que tu fasses attention en traversant.", { fasses: "Après « il faut que », on emploie le subjonctif : que tu fasses." }),
  // Niveau 5 — phrases complexes
  d(5, "Bien qu'il soit fatigué, Thomas a terminé son travail.", { soit: "Après « bien que », on emploie le subjonctif : qu'il soit.", "fatigué": "« fatigué » s'accorde avec « il » (masculin singulier)." }),
  d(5, "Les décisions qu'ils ont prises étaient courageuses.", { prises: "« qu' » remplace « les décisions » (féminin pluriel), placé avant avoir : prises.", courageuses: "« Décisions » est féminin pluriel : courageuses." }),
  d(5, "Nous nous sommes souvenus de cette aventure extraordinaire.", { souvenus: "Verbe pronominal « se souvenir » : accord avec « nous » (masculin pluriel ici)." }),
  d(5, "Les spectateurs, émerveillés, applaudissaient sans s'arrêter.", { "émerveillés": "« émerveillés » s'accorde avec « les spectateurs ».", applaudissaient: "Imparfait, sujet pluriel : -aient." }),
  d(5, "Les cent vingt participants ont reçu une médaille.", { cent: "« cent » ne prend pas de s quand il est suivi d'un autre nombre.", "reçu": "« reçu » prend une cédille devant le u." }),
  d(5, "Elle s'était promis de ne jamais abandonner.", { promis: "Ici, « s' » veut dire « à elle-même » (complément indirect) : le participe ne s'accorde pas." }),
];

export const uniteDictee = {
  ...uniteBanque({ id: "dictee", titre: "Dictée", icone: "🎧", description: "Écoute une phrase et écris-la sans faute" }, PHRASES),
  nombreQuestions: 5,
};
