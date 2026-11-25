// Français — 2e secondaire (PFEQ). Questions originales écrites pour KidsSchool.
import { uniteComprehension, uniteRoman } from "./lecture";
import { uniteBanque } from "./outils";
import type { Matiere, QuestionBanque } from "./types";

const c = (niveau: QuestionBanque["niveau"], enonce: string, bonne: string, autres: string[], explication: string, consigne = "Choisis le bon mot"): QuestionBanque =>
  ({ type: "choix", niveau, consigne, enonce, bonne, autres, explication });
const s = (niveau: QuestionBanque["niveau"], consigne: string, enonce: string, acceptees: string[], explication: string): QuestionBanque =>
  ({ type: "saisie", niveau, consigne, enonce, acceptees, explication });
const o = (niveau: QuestionBanque["niveau"], mots: string[], explication: string, intrus: string[] = []): QuestionBanque =>
  ({ type: "ordre", niveau, consigne: "Remets les mots dans l'ordre", enonce: "Forme une phrase correcte.", mots, intrus, explication });

const homophones: QuestionBanque[] = [
  c(1, "Mon frère ___ un nouveau vélo.", "a", ["à"], "« a » est le verbe avoir (on peut dire « avait »)."),
  c(1, "Nous allons ___ la piscine samedi.", "à", ["a"], "« à » est une préposition (on ne peut pas dire « avait »)."),
  c(1, "Le chat ___ le chien dorment.", "et", ["est"], "« et » relie deux éléments (on peut dire « et puis »)."),
  c(1, "Ma sœur ___ en vacances.", "est", ["et"], "« est » est le verbe être (on peut dire « était »)."),
  c(2, "Les élèves ___ fini leur projet.", "ont", ["on"], "« ont » est le verbe avoir (on peut dire « avaient »)."),
  c(2, "Ce soir, ___ mange de la pizza.", "on", ["ont"], "« on » est un pronom (on peut le remplacer par « il »)."),
  c(2, "Mes amis ___ arrivés en retard.", "sont", ["son"], "« sont » est le verbe être (on peut dire « étaient »)."),
  c(2, "Julie a oublié ___ sac à dos.", "son", ["sont"], "« son » est un déterminant possessif (on peut dire « mon »)."),
  c(3, "Tu veux du jus ___ du lait ?", "ou", ["où"], "« ou » sans accent veut dire « ou bien »."),
  c(3, "Dis-moi ___ tu as caché la clé.", "où", ["ou"], "« où » avec accent indique un lieu."),
  c(3, "Thomas a rangé ___ cahiers dans son casier.", "ses", ["ces", "c'est", "s'est"], "« ses » = les siens (possessif ; on peut dire « les cahiers à lui »)."),
  c(3, "Regarde ___ nuages noirs dans le ciel !", "ces", ["ses", "c'est", "s'est"], "« ces » montre quelque chose (on peut dire « ces … -là »)."),
  c(4, "___ vraiment une belle journée.", "C'est", ["S'est", "Ses", "Ces"], "« c'est » = cela est (on peut dire « cela est »)."),
  c(4, "Elle ___ trompée de chemin.", "s'est", ["c'est", "ses", "ces"], "« s'est » vient d'un verbe pronominal (se tromper) : elle s'est trompée."),
  c(4, "Il ___ lave les mains avant de manger.", "se", ["ce"], "« se » accompagne un verbe pronominal (se laver)."),
  c(4, "___ livre est passionnant.", "Ce", ["Se"], "« ce » est un déterminant démonstratif devant un nom."),
  c(5, "Je ne sais pas ___ il va venir.", "s'il", ["si'l", "cil"], "« s'il » = si + il."),
  c(5, "___ à moi, je préfère rester ici.", "Quant", ["Quand", "Qu'en"], "« quant à » = en ce qui concerne. « quand » indique le temps, « qu'en » = que + en."),
  c(5, "___ que tu as dit est vrai.", "Ce", ["Se", "Ceux"], "« ce » est un pronom démonstratif (= cela)."),
  c(5, "Quelle que soit la météo, nous irons. → « Quelle » s'accorde avec…", "la météo", ["nous", "rien, c'est invariable"], "« quel que » s'accorde avec le sujet du verbe être : la météo (féminin singulier).", "Réfléchis"),
];

const conjugaison: QuestionBanque[] = [
  s(1, "Conjugue au présent", "Nous (finir) ___ nos devoirs.", ["finissons"], "Verbe du 2e groupe : nous finissons."),
  s(1, "Conjugue au présent", "Tu (être) ___ en retard.", ["es"], "Être au présent : tu es."),
  s(1, "Conjugue au présent", "Ils (avoir) ___ faim.", ["ont"], "Avoir au présent : ils ont."),
  c(1, "Je (aller) ___ à l'école à pied.", "vais", ["vas", "va", "allons"], "Aller au présent : je vais.", "Choisis la bonne forme"),
  s(2, "Conjugue à l'imparfait", "Quand j'étais petit, je (jouer) ___ dehors.", ["jouais"], "Imparfait : radical + -ais pour « je »."),
  s(2, "Conjugue à l'imparfait", "Vous (faire) ___ du ski chaque hiver.", ["faisiez"], "Faire à l'imparfait : vous faisiez."),
  c(2, "Demain, nous (partir) ___ tôt.", "partirons", ["partons", "partirions", "partions"], "Futur simple : nous partirons.", "Choisis la bonne forme"),
  s(2, "Conjugue au futur simple", "Elle (pouvoir) ___ venir demain.", ["pourra"], "Pouvoir est irrégulier au futur : elle pourra (avec deux r)."),
  s(3, "Conjugue au passé composé", "Hier, nous (manger) ___ des crêpes.", ["avons mangé"], "Passé composé : avoir au présent + participe passé (mangé)."),
  s(3, "Conjugue au passé composé", "Elles (arriver) ___ à midi.", ["sont arrivées"], "Arriver se conjugue avec être : le participe s'accorde avec le sujet (féminin pluriel)."),
  c(3, "Si j'avais le temps, je (lire) ___ ce roman.", "lirais", ["lirai", "lisais", "lis"], "Après « si + imparfait », on utilise le conditionnel présent : je lirais.", "Choisis la bonne forme"),
  c(3, "Tu (voir) ___ ce film la semaine prochaine.", "verras", ["voiras", "verra", "vois"], "Voir au futur : tu verras (radical irrégulier « verr- »).", "Choisis la bonne forme"),
  s(4, "Conjugue au futur simple", "Nous (envoyer) ___ la lettre lundi.", ["enverrons"], "Envoyer est irrégulier au futur : nous enverrons."),
  c(4, "Il faut que tu (faire) ___ ton lit.", "fasses", ["fais", "faisais", "feras"], "Après « il faut que », on emploie le subjonctif : que tu fasses.", "Choisis la bonne forme"),
  s(4, "Conjugue au passé composé", "Ils (prendre) ___ l'autobus.", ["ont pris"], "Prendre : participe passé « pris »."),
  c(4, "Quand le téléphone a sonné, je (dormir) ___.", "dormais", ["ai dormi", "dormirai", "dors"], "Action en cours dans le passé (décor) → imparfait.", "Choisis la bonne forme"),
  c(5, "Je souhaite qu'il (venir) ___ à ma fête.", "vienne", ["vient", "viendra", "venait"], "Après « souhaiter que », subjonctif : qu'il vienne.", "Choisis la bonne forme"),
  s(5, "Conjugue au conditionnel présent", "Vous (devoir) ___ vous reposer.", ["devriez"], "Devoir au conditionnel : vous devriez."),
  c(5, "Lorsqu'elle (finir) ___ ses devoirs, elle sortira.", "aura fini", ["finira", "a fini", "finissait"], "Action future terminée avant une autre action future → futur antérieur : aura fini.", "Choisis la bonne forme"),
  s(5, "Conjugue au passé simple", "Le chevalier (saisir) ___ son épée.", ["saisit"], "Passé simple, 2e groupe, 3e personne : il saisit."),
];

const accords: QuestionBanque[] = [
  c(1, "Des fleurs ___.", "rouges", ["rouge", "rougent"], "L'adjectif s'accorde avec le nom : fleurs (féminin pluriel) → rouges.", "Choisis le bon accord"),
  c(1, "Une ___ maison.", "petite", ["petit", "petites"], "Maison est féminin singulier → petite.", "Choisis le bon accord"),
  s(1, "Écris le pluriel", "un cheval → des ___", ["chevaux"], "Les noms en -al font souvent -aux au pluriel."),
  s(1, "Écris le pluriel", "un bijou → des ___", ["bijoux"], "Bijou fait partie des 7 noms en -ou qui prennent un x."),
  c(2, "Mes cousines sont ___.", "gentilles", ["gentils", "gentille", "gentiles"], "Gentil → gentille au féminin, puis s au pluriel.", "Choisis le bon accord"),
  c(2, "Les élèves ___ réussi l'examen.", "ont", ["a", "on"], "Le sujet « les élèves » est pluriel : ils ont.", "Choisis le bon accord"),
  s(2, "Écris le pluriel", "un travail → des ___", ["travaux"], "Travail fait partie des noms en -ail qui font -aux."),
  c(2, "La plupart des joueurs ___ fatigués.", "étaient", ["était"], "« La plupart des » + nom pluriel → verbe au pluriel.", "Choisis le bon accord"),
  c(3, "Elle est ___ tôt ce matin.", "partie", ["parti", "partis", "parties"], "Avec être, le participe passé s'accorde avec le sujet (elle → féminin singulier).", "Choisis le bon accord"),
  c(3, "Les pommes que j'ai ___ étaient délicieuses.", "mangées", ["mangé", "mangés", "manger"], "Avec avoir, le participe s'accorde avec le complément direct placé avant (« que » = les pommes).", "Choisis le bon accord"),
  c(3, "Nous avons ___ nos amis au parc.", "rencontré", ["rencontrés", "rencontrées", "rencontrer"], "Avec avoir, le complément « nos amis » est placé après : pas d'accord.", "Choisis le bon accord"),
  c(3, "Des chandails ___.", "bleu foncé", ["bleus foncés", "bleus foncé"], "Adjectif de couleur composé : il reste invariable.", "Choisis le bon accord"),
  c(4, "Ils se sont ___ dans le parc.", "promenés", ["promené", "promenées"], "Verbe pronominal : ici le participe s'accorde avec le sujet (ils).", "Choisis le bon accord"),
  c(4, "Elle s'est ___ les cheveux.", "lavé", ["lavée", "lavés"], "Le complément direct « les cheveux » est après le verbe : pas d'accord.", "Choisis le bon accord"),
  c(4, "___ les filles étaient présentes.", "Toutes", ["Tous", "Toute", "Tout"], "« Tout » déterminant s'accorde avec le nom : les filles → toutes.", "Choisis le bon accord"),
  c(4, "Des chandails ___.", "orange", ["oranges", "orangés"], "Les couleurs venant d'un nom (orange, marron) restent invariables.", "Choisis le bon accord"),
  c(5, "Les efforts qu'il a ___ ont porté fruit.", "fallu", ["fallus", "fallues"], "Le participe passé de « falloir » est toujours invariable.", "Choisis le bon accord"),
  c(5, "Quelle chaleur il a ___ hier !", "fait", ["faite", "faits"], "Verbe impersonnel (il fait chaud) : participe invariable.", "Choisis le bon accord"),
  c(5, "Les chansons que j'ai entendu ___ étaient belles.", "chanter", ["chantées", "chanté"], "Après « entendu », on met l'infinitif « chanter ». Le participe reste invariable, car ce ne sont pas les chansons qui font l'action de chanter.", "Choisis la bonne forme"),
  c(5, "Elles se sont ___ des cadeaux.", "offert", ["offertes", "offerts"], "Complément direct « des cadeaux » placé après : pas d'accord.", "Choisis le bon accord"),
];

const vocabulaire: QuestionBanque[] = [
  c(1, "Un synonyme de « content » :", "heureux", ["triste", "fâché", "fatigué"], "Content et heureux ont le même sens.", "Trouve le synonyme"),
  c(1, "Le contraire de « rapide » :", "lent", ["vite", "pressé", "léger"], "Rapide ≠ lent.", "Trouve l'antonyme"),
  c(1, "Dans « Le chien noir court », quel mot est un adjectif ?", "noir", ["chien", "court", "le"], "L'adjectif décrit le nom : noir.", "Classe de mots"),
  o(1, ["Le", "chat", "dort", "sur", "le", "sofa."], "Groupe sujet + verbe + complément."),
  c(2, "Un synonyme de « commencer » :", "débuter", ["terminer", "continuer", "arrêter"], "Commencer = débuter.", "Trouve le synonyme"),
  c(2, "Le contraire de « généreux » :", "avare", ["gentil", "riche", "poli"], "Généreux ≠ avare.", "Trouve l'antonyme"),
  c(2, "Dans « Elle chante doucement », quel mot est un adverbe ?", "doucement", ["elle", "chante"], "L'adverbe modifie le verbe : doucement.", "Classe de mots"),
  o(2, ["Mes", "amis", "jouent", "au", "hockey", "le", "samedi."], "Phrase de base : sujet + verbe + compléments."),
  c(3, "« Avoir la tête dans les nuages » veut dire…", "être distrait", ["avoir mal à la tête", "être en avion", "être très grand"], "Expression : rêvasser, ne pas être attentif.", "Expression"),
  c(3, "Quel mot est de la même famille que « terre » ?", "terrain", ["tard", "terreur", "tirer"], "Terre, terrain, terrestre, enterrer…", "Famille de mots"),
  c(3, "Un synonyme de « méfiant » :", "soupçonneux", ["confiant", "naïf", "joyeux"], "Méfiant = soupçonneux.", "Trouve le synonyme"),
  o(3, ["Pourquoi", "as-tu", "oublié", "ton", "manteau", "?"], "Phrase interrogative avec inversion du sujet.", ["est-ce"]),
  c(4, "« Prendre ses jambes à son cou » veut dire…", "s'enfuir rapidement", ["s'étirer", "tomber", "danser"], "Expression : partir très vite.", "Expression"),
  c(4, "Le préfixe « in- » dans « invisible » signifie…", "le contraire", ["à l'intérieur", "encore", "avant"], "In- = négation : invisible = qui n'est pas visible.", "Formation des mots"),
  c(4, "Quel est le sens de « éphémère » ?", "qui dure peu de temps", ["très ancien", "très lourd", "très bruyant"], "Éphémère = de courte durée.", "Vocabulaire"),
  o(4, ["Bien", "qu'il", "pleuve,", "nous", "irons", "au", "parc."], "Subordonnée de concession (bien que + subjonctif) suivie de la principale."),
  c(5, "Dans « Le roman que tu m'as prêté est captivant », « que tu m'as prêté » est…", "une subordonnée relative", ["une subordonnée complétive", "un complément de phrase", "un groupe adjectival"], "« que » est un pronom relatif qui reprend « le roman ».", "Grammaire"),
  c(5, "Quelle phrase contient une figure de style (comparaison) ?", "Ses yeux brillaient comme des étoiles.", ["Ses yeux étaient bleus.", "Il ouvrit les yeux.", "Elle ferma les yeux."], "La comparaison utilise un outil (comme) pour rapprocher deux éléments.", "Figures de style"),
  c(5, "Un synonyme de « pérenne » :", "durable", ["fragile", "rapide", "ancien"], "Pérenne = qui dure longtemps.", "Trouve le synonyme"),
  o(5, ["Après", "avoir", "terminé", "son", "roman,", "elle", "a", "écrit", "un", "résumé."], "Complément de phrase en tête, suivi d'une virgule."),
];

export const francais: Matiere = {
  id: "francais",
  nom: "Français",
  icone: "📝",
  couleur: "corail",
  slogan: "Lecture, roman, grammaire",
  unites: [
    uniteComprehension,
    uniteRoman,
    uniteBanque({ id: "homophones", titre: "Homophones", icone: "🎭", description: "a/à, et/est, ses/ces…" }, homophones),
    uniteBanque({ id: "conjugaison", titre: "Conjugaison", icone: "⏳", description: "Présent, imparfait, futur, passé composé" }, conjugaison),
    uniteBanque({ id: "accords", titre: "Accords", icone: "🧩", description: "Adjectifs, pluriels, participes passés" }, accords),
    uniteBanque({ id: "vocabulaire", titre: "Vocabulaire et phrases", icone: "💬", description: "Synonymes, expressions, phrases" }, vocabulaire),
  ],
};
