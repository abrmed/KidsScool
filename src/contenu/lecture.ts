// Lecture — compréhension de texte et roman. Tous les textes sont ORIGINAUX, écrits pour KidsSchool.
// Parcours progressifs : textes courts (≈200 mots) jusqu'à des textes longs (≈750 mots).
import { melanger } from "./outils";
import type { Niveau, Question, Texte, Unite } from "./types";

type Lecture = { niveau: Niveau; texte: Texte; questions: Question[] };

const c = (enonce: string, bonne: string, autres: string[], explication: string, consigne = "Choisis la bonne réponse"): Question =>
  ({ type: "choix", consigne, enonce, bonne, autres, explication });
const chrono = (evenements: string[], explication: string): Question =>
  ({ type: "ordre", consigne: "Remets les événements dans l'ordre", enonce: "Du premier au dernier.", mots: evenements, explication });

/** Une leçon = un texte du niveau demandé + ses questions (dans l'ordre de lecture). */
function uniteLecture(infos: Omit<Unite, "produire">, lectures: Lecture[]): Unite {
  return {
    ...infos,
    produire(niveau, nombre, h) {
      const candidates = lectures.filter((l) => l.niveau === niveau);
      const l = candidates[Math.floor(h() * candidates.length)] ?? lectures[0];
      const indices = melanger(h, l.questions.map((_, i) => i)).slice(0, nombre).sort((a, b) => a - b);
      return indices.map((i) => ({ ...l.questions[i], texteId: l.texte.id }));
    },
  };
}

// ════════════════════════════════════════════════════════════
// COMPRÉHENSION DE TEXTE
// ════════════════════════════════════════════════════════════

const tempete: Texte = {
  id: "tempete",
  titre: "Jour de tempête",
  genre: "Récit · environ 220 mots",
  paragraphes: [
    "Ce matin-là, Léa a ouvert les rideaux et n'a rien vu… sauf du blanc. Pendant la nuit, la neige était tombée sans arrêt. À la radio, l'animateur a annoncé que toutes les écoles de la région étaient fermées. Léa a crié de joie et réveillé son petit frère.",
    "Après le déjeuner, elle a enfilé son habit de neige pour aller jouer dehors. C'est alors qu'elle a aperçu M. Gagnon, le voisin d'en face, qui essayait de déneiger son entrée avec une vieille pelle. Il s'arrêtait souvent pour reprendre son souffle.",
    "Léa a traversé la rue. « Voulez-vous de l'aide ? » a-t-elle demandé. Le vieil homme a souri, un peu gêné, puis il a accepté. Ensemble, ils ont travaillé pendant près d'une heure.",
    "Pour la remercier, M. Gagnon l'a invitée à boire un chocolat chaud. Sur le mur du salon, Léa a remarqué une photo jaunie : un jeune joueur de hockey qui soulevait un trophée. « C'était moi, en 1972 », a dit M. Gagnon avec un clin d'œil.",
    "Ce soir-là, Léa a raconté sa journée à ses parents. Elle avait les bras fatigués, mais elle était fière. Elle n'aurait jamais cru qu'une tempête pouvait lui faire découvrir un champion.",
  ],
};

const castor: Texte = {
  id: "castor",
  titre: "Le castor, ingénieur de la forêt",
  genre: "Texte informatif · environ 310 mots",
  paragraphes: [
    "Le castor est le plus gros rongeur d'Amérique du Nord. Un adulte peut peser plus de 25 kilogrammes, soit à peu près le poids d'un enfant de huit ans. On le reconnaît à sa queue large et plate, recouverte d'écailles, qui lui sert de gouvernail quand il nage.",
    "Ce qui rend le castor célèbre, ce sont ses talents de constructeur. Avec ses incisives orange, qui poussent toute sa vie, il abat des arbres entiers. Il utilise ensuite les branches, la boue et les pierres pour bâtir des barrages sur les ruisseaux. Le barrage fait monter le niveau de l'eau et crée un étang.",
    "Au milieu de cet étang, le castor construit sa hutte. L'entrée se trouve sous l'eau : ainsi, les prédateurs comme le loup ou le coyote ne peuvent pas y pénétrer facilement. À l'intérieur, une plateforme au sec permet à la famille de se reposer et de rester au chaud, même en plein hiver.",
    "Les barrages de castors changent tout le paysage. Les étangs attirent des grenouilles, des canards, des poissons et des orignaux. Certains scientifiques disent que le castor est une « espèce ingénieure », car il transforme son milieu au profit de nombreux autres animaux. Par contre, ses barrages inondent parfois des routes ou des terrains, ce qui cause des problèmes aux humains.",
    "Le castor occupe une place spéciale au Canada. Il apparaît sur la pièce de cinq cents depuis 1937. Au temps de la traite des fourrures, sa peau était très recherchée pour fabriquer des chapeaux en Europe, si bien que l'espèce a failli disparaître. Aujourd'hui, grâce à la protection, les castors sont de nouveau nombreux dans nos lacs et nos rivières.",
  ],
};

const carnet: Texte = {
  id: "carnet",
  titre: "Le carnet oublié",
  genre: "Récit · environ 430 mots",
  paragraphes: [
    "Samuel détestait la bibliothèque de l'école. Trop silencieuse, trop sérieuse. Pourtant, ce mardi-là, il s'y était réfugié pour éviter de croiser Maxime et sa bande, qui se moquaient de lui depuis le début de l'année.",
    "Il s'est assis à la table du fond, près de la fenêtre. C'est là qu'il l'a vu : un petit carnet noir, coincé entre le mur et la chaise. Sur la couverture, quelqu'un avait écrit au crayon : « Ne pas ouvrir. Sérieusement. »",
    "Samuel a hésité longtemps. Il savait que ce n'était pas correct de lire le carnet de quelqu'un d'autre. Mais la curiosité a été la plus forte : il a soulevé la couverture, juste un peu. À l'intérieur, il n'y avait pas de secrets, seulement des dessins. Des dragons, des villes flottantes, des portraits d'élèves de l'école. Ils étaient si réussis que Samuel en a eu le souffle coupé.",
    "À la dernière page, il a reconnu son propre visage. Sous le portrait, une phrase : « Le garçon qui lit toujours seul. Il a l'air gentil. Un jour, je vais oser lui parler. » Le dessin n'était pas signé.",
    "Toute la semaine, Samuel a observé les élèves qui passaient près de la table du fond. Le vendredi, une fille de sa classe, Inès, est entrée en regardant partout, l'air inquiet. Elle s'est penchée sous la chaise, puis a soupiré.",
    "Samuel a pris une grande respiration. Il s'est approché et lui a tendu le carnet. « Je pense que c'est à toi. Je… j'ai regardé un peu. Je m'excuse. » Inès est devenue rouge comme une tomate. Pendant un instant, personne n'a parlé.",
    "Puis Samuel a ajouté : « Tes dragons sont incroyables. Tu pourrais m'apprendre ? » Inès a éclaté de rire, soulagée. À partir de ce jour-là, la table du fond n'a plus jamais été silencieuse.",
  ],
};

const cellulaire: Texte = {
  id: "cellulaire",
  titre: "Le cellulaire en classe : ami ou ennemi ?",
  genre: "Texte argumentatif · environ 480 mots",
  paragraphes: [
    "Dans plusieurs écoles du Québec, le cellulaire est maintenant interdit en classe. Cette règle fait beaucoup réagir. Certains élèves la trouvent injuste, alors que plusieurs enseignants disent qu'elle leur facilite la vie. À mon avis, interdire le cellulaire pendant les cours est une bonne décision, à condition de bien l'expliquer aux jeunes.",
    "D'abord, le cellulaire nuit à la concentration. Une simple notification suffit pour détourner l'attention d'un élève pendant plusieurs minutes. Même posé sur le bureau, écran fermé, l'appareil attire le regard et donne envie de vérifier s'il y a du nouveau. Or, pour comprendre une notion difficile en mathématiques ou pour lire un long texte, il faut pouvoir se concentrer sans interruption.",
    "Ensuite, l'interdiction favorise les relations entre les élèves. Quand les téléphones sont rangés, les jeunes se parlent davantage, travaillent en équipe plus facilement et se regardent dans les yeux. Plusieurs écoles ont d'ailleurs remarqué que les pauses étaient plus animées depuis l'entrée en vigueur de la règle.",
    "Enfin, cette mesure protège contre certains problèmes, comme la cyberintimidation pendant les heures de classe ou les photos prises sans permission. Lorsque les appareils sont hors de portée, ces situations deviennent beaucoup plus rares.",
    "Certains répondront que le cellulaire peut être un outil d'apprentissage : on peut y chercher une définition, utiliser une calculatrice ou consulter un horaire. C'est vrai. Cependant, l'école dispose déjà d'ordinateurs et de tablettes prévus pour ces usages, et l'enseignant peut décider à quel moment les utiliser. L'argument ne justifie donc pas qu'on garde son téléphone personnel en main toute la journée.",
    "D'autres parents s'inquiètent de ne pas pouvoir joindre leur enfant en cas d'urgence. Cette inquiétude est compréhensible, mais le secrétariat de l'école peut toujours transmettre rapidement un message important.",
    "En conclusion, interdire le cellulaire en classe aide les élèves à se concentrer, à mieux vivre ensemble et à se protéger. Pour que la règle soit acceptée, il faut toutefois la présenter comme un moyen d'aider les jeunes, et non comme une punition. Après tout, le meilleur réseau, en classe, c'est peut-être celui qu'on forme avec les autres.",
  ],
};

const portage: Texte = {
  id: "portage",
  titre: "Le dernier portage",
  genre: "Récit · environ 720 mots",
  paragraphes: [
    "Rosalie n'avait jamais aimé les surprises. Alors quand sa tante Anick lui avait annoncé, en juillet, qu'elles partiraient trois jours en canot dans le parc de la Mauricie, « sans cellulaire, sans réseau, juste nous deux et la forêt », Rosalie avait accepté du bout des lèvres. Elle aurait préféré passer l'été à la piscine avec ses amies.",
    "Les deux premiers jours lui avaient pourtant donné tort. Le lac était lisse comme un miroir, les huards lançaient leurs cris étranges au coucher du soleil, et le soir, autour du feu, Anick racontait des histoires de son enfance. Rosalie avait même appris à allumer un feu avec une seule allumette, ce dont elle n'était pas peu fière.",
    "Le troisième matin, tout a changé. Le ciel s'est couvert de nuages gris et lourds, et le vent s'est levé d'un coup. Pour rejoindre la voiture, il fallait traverser le grand lac, puis faire un dernier portage, c'est-à-dire porter le canot et les sacs sur un sentier jusqu'au lac suivant. Anick a observé longtemps les vagues qui se formaient au large.",
    "« On attend », a-t-elle dit enfin. Rosalie n'en croyait pas ses oreilles. Attendre ? Elle avait hâte de retrouver son lit, sa douche, son téléphone. « Mais on est presque arrivées ! On a juste à pagayer plus fort ! » Anick a secoué la tête calmement. « Sur un lac comme celui-là, avec un canot chargé, une vague de côté suffit pour chavirer. L'eau est froide. Je ne prends pas ce risque. »",
    "Rosalie s'est assise sur une roche, les bras croisés. Pendant une heure, elle a boudé en regardant le lac s'agiter. Puis la pluie est arrivée, si forte qu'on ne voyait plus l'autre rive. Des vagues blanches frappaient les rochers à l'endroit même où elles auraient dû passer. Rosalie a frissonné, et ce n'était pas seulement à cause du froid.",
    "Elles ont tendu une bâche entre deux arbres et se sont abritées dessous, serrées l'une contre l'autre. Pour passer le temps, Anick a sorti un jeu de cartes tout écorné. Elles ont joué, ri, mangé les dernières barres de céréales. Rosalie a été surprise de constater qu'elle ne s'ennuyait pas.",
    "En fin d'après-midi, le vent est tombé aussi vite qu'il s'était levé. Le lac est redevenu calme, presque innocent. Elles ont chargé le canot et traversé sans difficulté. Au moment du portage, Rosalie a insisté pour porter le canot elle-même, du moins sur une partie du sentier. Il était lourd, ses épaules brûlaient, mais elle n'a pas abandonné.",
    "Dans la voiture, en retrouvant enfin du réseau, son téléphone s'est mis à vibrer sans arrêt : messages, photos, vidéos. Rosalie l'a regardé un moment, puis l'a rangé dans son sac. « Tu sais, a-t-elle dit à sa tante, je pense que je vais revenir l'an prochain. Mais cette fois, c'est moi qui choisis la date de départ. » Anick a souri. « Marché conclu. Tant que c'est moi qui décide quand on attend. »",
  ],
};

const COMPREHENSION: Lecture[] = [
  {
    niveau: 1,
    texte: tempete,
    questions: [
      c("Pourquoi les écoles sont-elles fermées ?", "À cause d'une tempête de neige", ["Parce que c'est un jour férié", "À cause d'une panne d'électricité", "Parce que les enseignants sont malades"], "Paragraphe 1 : la neige est tombée toute la nuit et la radio annonce la fermeture des écoles."),
      c("Qui est M. Gagnon ?", "Le voisin d'en face", ["Le grand-père de Léa", "L'animateur de radio", "Le directeur de l'école"], "Paragraphe 2 : « M. Gagnon, le voisin d'en face »."),
      c("Pourquoi M. Gagnon s'arrête-t-il souvent ?", "Il est essoufflé par l'effort", ["Il parle au téléphone", "Il attend Léa", "Il cherche ses clés"], "Inférence : « pour reprendre son souffle » montre que l'effort le fatigue (il est âgé)."),
      c("Au paragraphe 3, pourquoi M. Gagnon est-il « un peu gêné » ?", "Il n'a pas l'habitude d'avoir besoin d'aide", ["Il ne connaît pas Léa", "Il a oublié son manteau", "Il est en retard"], "Inférence : accepter l'aide d'une jeune voisine peut gêner une personne âgée qui veut rester autonome."),
      c("Combien de temps travaillent-ils ensemble ?", "Près d'une heure", ["Dix minutes", "Toute la journée", "Deux heures"], "Paragraphe 3 : « pendant près d'une heure »."),
      c("Que montre la photo dans le salon ?", "M. Gagnon jeune, avec un trophée de hockey", ["Le père de Léa", "Une équipe de hockey actuelle", "Une tempête de neige"], "Paragraphe 4 : « C'était moi, en 1972 »."),
      c("Dans le texte, « une photo jaunie » veut dire…", "une photo vieillie par le temps", ["une photo peinte en jaune", "une photo très lumineuse", "une photo déchirée"], "Vocabulaire en contexte : avec le temps, le papier photo jaunit.", "Vocabulaire"),
      chrono(["Les écoles ferment.", "Léa aide M. Gagnon.", "Ils boivent un chocolat chaud.", "Léa raconte sa journée."], "Ordre du récit, paragraphe par paragraphe."),
      c("Comment Léa se sent-elle à la fin de la journée ?", "Fière", ["Déçue", "En colère", "Effrayée"], "Paragraphe 5 : « elle avait les bras fatigués, mais elle était fière »."),
      c("Quelle phrase résume le mieux le texte ?", "Une journée de tempête permet à Léa d'aider son voisin et de découvrir son passé.", ["Léa joue toute la journée dans la neige.", "M. Gagnon gagne un trophée de hockey pendant la tempête.", "Léa et son frère se disputent pendant la tempête."], "Idée principale : l'entraide et la découverte du passé de M. Gagnon.", "Idée principale"),
    ],
  },
  {
    niveau: 2,
    texte: castor,
    questions: [
      c("Selon le texte, le castor est…", "le plus gros rongeur d'Amérique du Nord", ["le plus petit mammifère du Canada", "un poisson d'eau douce", "un oiseau des marais"], "Paragraphe 1, première phrase."),
      c("Combien peut peser un castor adulte ?", "Plus de 25 kg", ["Environ 2 kg", "Environ 10 kg", "Plus de 100 kg"], "Paragraphe 1 : « plus de 25 kilogrammes »."),
      c("À quoi sert la queue du castor quand il nage ?", "De gouvernail", ["À respirer", "À attraper des poissons", "À creuser la boue"], "Paragraphe 1 : la queue « lui sert de gouvernail »."),
      c("Pourquoi les dents du castor ne s'usent-elles pas complètement ?", "Elles poussent toute sa vie", ["Il ne mange que des aliments mous", "Il les remplace chaque hiver", "Elles sont faites de pierre"], "Paragraphe 2 : « ses incisives orange, qui poussent toute sa vie »."),
      c("Pourquoi l'entrée de la hutte est-elle sous l'eau ?", "Pour empêcher les prédateurs d'entrer facilement", ["Pour garder la hutte au frais", "Parce que le castor ne sait pas marcher", "Pour attraper des poissons"], "Paragraphe 3 : le loup et le coyote ne peuvent pas y pénétrer facilement."),
      c("Dans le paragraphe 4, « au profit de » veut dire…", "pour le bien de", ["au détriment de", "à la place de", "en même temps que"], "Les étangs aident d'autres animaux : ils en profitent.", "Vocabulaire"),
      c("Quel est le sujet du paragraphe 4 ?", "Les effets des barrages sur le milieu", ["L'alimentation du castor", "La hutte du castor", "L'histoire de la pièce de cinq cents"], "Il parle des animaux attirés par les étangs et des inondations.", "Idée principale"),
      c("Quel problème les barrages causent-ils parfois aux humains ?", "Ils inondent des routes ou des terrains", ["Ils font fuir les poissons", "Ils polluent l'eau potable", "Ils bloquent les bateaux de croisière"], "Paragraphe 4, dernière phrase."),
      c("Pourquoi le castor a-t-il failli disparaître ?", "Sa fourrure servait à fabriquer des chapeaux", ["Les loups en mangeaient trop", "Les barrages se sont effondrés", "Il a manqué d'arbres"], "Paragraphe 5 : la traite des fourrures."),
      c("Quel est le but principal de ce texte ?", "Informer sur le castor", ["Raconter une aventure", "Convaincre d'adopter un castor", "Expliquer comment construire un barrage"], "C'est un texte informatif : il présente des faits.", "Type de texte"),
    ],
  },
  {
    niveau: 3,
    texte: carnet,
    questions: [
      c("Pourquoi Samuel va-t-il à la bibliothèque ce mardi-là ?", "Pour éviter Maxime et sa bande", ["Pour faire ses devoirs", "Pour rencontrer Inès", "Pour emprunter un livre de dragons"], "Paragraphe 1 : il s'y est « réfugié pour éviter de croiser Maxime et sa bande »."),
      c("Où Samuel trouve-t-il le carnet ?", "Coincé entre le mur et une chaise", ["Sur une étagère", "Dans son sac", "Au comptoir de prêt"], "Paragraphe 2."),
      c("Au paragraphe 3, quel sentiment pousse Samuel à ouvrir le carnet ?", "La curiosité", ["La colère", "La peur", "La jalousie"], "« la curiosité a été la plus forte »."),
      c("Que contient le carnet ?", "Des dessins", ["Des secrets", "Des devoirs de mathématiques", "Des lettres d'amour"], "Paragraphe 3 : « pas de secrets, seulement des dessins »."),
      c("D'après les indices du texte, qui a dessiné le portrait de Samuel ?", "Inès", ["Maxime", "Samuel lui-même", "La bibliothécaire"], "Inférence : Inès cherche le carnet sous la chaise et rougit quand Samuel le lui rend.", "Inférence"),
      c("« Samuel en a eu le souffle coupé » veut dire qu'il…", "était très impressionné", ["avait couru", "était malade", "retenait sa respiration sous l'eau"], "Expression : être très étonné, impressionné.", "Vocabulaire"),
      c("« Inès est devenue rouge comme une tomate » est…", "une comparaison", ["une métaphore", "une énumération", "une répétition"], "Le mot « comme » relie deux éléments comparés : c'est une comparaison.", "Figures de style"),
      c("Pourquoi Samuel s'excuse-t-il ?", "Il a regardé le carnet sans permission", ["Il a déchiré une page", "Il a perdu le carnet", "Il s'est moqué d'Inès"], "Paragraphe 6 : « j'ai regardé un peu. Je m'excuse »."),
      chrono(["Samuel trouve le carnet.", "Il découvre son portrait.", "Inès cherche son carnet.", "Samuel lui rend le carnet."], "Ordre des paragraphes 2, 4, 5 et 6."),
      c("Que signifie la dernière phrase : « la table du fond n'a plus jamais été silencieuse » ?", "Samuel et Inès sont devenus amis et y discutent", ["La bibliothèque a déménagé", "Maxime a pris la table", "La table a été réparée"], "Inférence : la table silencieuse de Samuel, seul, devient un lieu d'amitié.", "Inférence"),
    ],
  },
  {
    niveau: 4,
    texte: cellulaire,
    questions: [
      c("Quelle est la thèse (l'opinion) de l'auteur ?", "Interdire le cellulaire en classe est une bonne décision.", ["Le cellulaire est indispensable en classe.", "Chaque élève devrait décider lui-même.", "Il faut aussi interdire les tablettes."], "Paragraphe 1 : « À mon avis, interdire le cellulaire pendant les cours est une bonne décision ».", "Texte argumentatif"),
      c("Le premier argument de l'auteur porte sur…", "la concentration", ["la sécurité routière", "le coût des cellulaires", "les devoirs à la maison"], "Paragraphe 2 : « D'abord, le cellulaire nuit à la concentration »."),
      c("Quel organisateur textuel introduit le deuxième argument ?", "Ensuite", ["Cependant", "Or", "Donc"], "D'abord → Ensuite → Enfin : ces mots organisent les arguments.", "Organisateurs textuels"),
      c("Que présente le paragraphe 5 ?", "Un contre-argument, puis la réponse de l'auteur", ["Un nouvel argument en faveur de l'interdiction", "La conclusion du texte", "Une anecdote personnelle"], "« Certains répondront que… » annonce un contre-argument ; « Cependant… » le réfute.", "Texte argumentatif"),
      c("Dans « C'est vrai. Cependant, l'école dispose… », le mot « Cependant » marque…", "une opposition", ["une cause", "une conséquence", "un ajout"], "Cependant = mais, pourtant.", "Organisateurs textuels"),
      c("« L'entrée en vigueur de la règle » signifie…", "le moment où la règle commence à s'appliquer", ["la porte d'entrée de l'école", "la force physique de la règle", "la fin de la règle"], "Expression : entrer en vigueur = commencer à s'appliquer.", "Vocabulaire"),
      c("Que répond l'auteur aux parents qui craignent de ne pas joindre leur enfant ?", "Le secrétariat peut transmettre un message urgent.", ["Les enfants peuvent garder leur cellulaire.", "Les parents doivent venir à l'école.", "Il n'y a jamais d'urgence."], "Paragraphe 6."),
      c("Selon l'auteur, à quelle condition la règle sera-t-elle bien acceptée ?", "Si on la présente comme une aide, pas comme une punition", ["Si les enseignants la respectent aussi", "Si elle dure seulement un mois", "Si les élèves votent pour elle"], "Paragraphe 7."),
      c("Dans la dernière phrase, le mot « réseau » est employé…", "avec un double sens (réseau social et groupe d'amis)", ["seulement au sens informatique", "par erreur", "au sens de réseau routier"], "Jeu de mots : le « meilleur réseau » est celui qu'on forme avec les autres élèves.", "Inférence"),
      c("Ce texte est surtout…", "argumentatif", ["narratif", "descriptif", "poétique"], "Il défend une opinion avec des arguments.", "Type de texte"),
    ],
  },
  {
    niveau: 5,
    texte: portage,
    questions: [
      c("Comment Rosalie réagit-elle d'abord à l'idée du voyage ?", "Elle accepte sans enthousiasme", ["Elle saute de joie", "Elle refuse net", "Elle invite ses amies"], "Paragraphe 1 : elle accepte « du bout des lèvres » et aurait préféré la piscine."),
      c("« Accepter du bout des lèvres » signifie…", "accepter sans vraiment le vouloir", ["accepter en chuchotant", "accepter avec joie", "accepter en mangeant"], "Expression : accepter à contrecœur.", "Vocabulaire"),
      c("Qu'est-ce qu'un portage, selon le texte ?", "Porter le canot et les sacs sur un sentier jusqu'au lac suivant", ["Traverser un lac à la nage", "Camper au bord d'une rivière", "Pêcher depuis un canot"], "Paragraphe 3 : le texte en donne la définition (« c'est-à-dire »)."),
      c("Pourquoi Anick décide-t-elle d'attendre ?", "Elle craint que le canot chavire dans les vagues", ["Elle est trop fatiguée", "Elle veut finir sa partie de cartes", "Elle a perdu la carte"], "Paragraphe 4 : « une vague de côté suffit pour chavirer »."),
      c("« Ce n'était pas seulement à cause du froid » laisse comprendre que Rosalie…", "réalise le danger auquel elles ont échappé", ["est tombée malade", "a perdu son téléphone", "est fâchée contre sa tante"], "Inférence : elle voit les vagues là où elles auraient dû passer ; elle a peur après coup.", "Inférence"),
      c("« Le lac était lisse comme un miroir » est…", "une comparaison", ["une métaphore", "une énumération", "une hyperbole"], "Le mot « comme » relie le lac et le miroir.", "Figures de style"),
      chrono(["Le vent se lève.", "Anick décide d'attendre.", "Elles s'abritent sous une bâche.", "Elles traversent le lac calme.", "Rosalie porte le canot."], "Ordre des paragraphes 3 à 7."),
      c("Comment Rosalie change-t-elle au cours du récit ?", "Elle passe de l'impatience à la confiance envers sa tante", ["Elle devient de plus en plus peureuse", "Elle se fâche de plus en plus", "Elle ne change pas du tout"], "Évolution du personnage : au début elle boude, à la fin elle veut revenir.", "Personnages"),
      c("Pourquoi Rosalie range-t-elle son téléphone à la fin ?", "Le voyage lui a fait apprécier autre chose", ["La batterie est vide", "Sa tante le lui ordonne", "Elle n'a reçu aucun message"], "Inférence : elle a reçu beaucoup de messages, mais choisit de profiter du moment.", "Inférence"),
      c("Quel est le thème principal du récit ?", "La prudence et la confiance", ["La compétition sportive", "La peur des animaux", "L'amitié entre deux élèves"], "Anick choisit la prudence ; Rosalie apprend à lui faire confiance.", "Thème"),
    ],
  },
];

// ════════════════════════════════════════════════════════════
// ROMAN : « Le secret du phare » (5 chapitres, un par niveau)
// ════════════════════════════════════════════════════════════

const chapitre = (n: number, titre: string, paragraphes: string[]): Texte => ({
  id: `phare-${n}`,
  titre: `Chapitre ${n} — ${titre}`,
  genre: `Roman « Le secret du phare » · chapitre ${n} sur 5`,
  paragraphes,
});

const ROMAN: Lecture[] = [
  {
    niveau: 1,
    texte: chapitre(1, "L'île aux Brumes", [
      "Quand le traversier a accosté à l'île aux Brumes, Émile a tout de suite pensé que ses vacances allaient être les plus longues de sa vie. Pas de cinéma, pas d'arcade, un seul dépanneur et, au bout de la pointe, un vieux phare blanc et rouge qui ne fonctionnait plus depuis des années.",
      "Sa cousine Jade l'attendait sur le quai, les cheveux en bataille et un sac à dos rempli de jumelles, de cartes et de carnets. Elle avait quatorze ans, un an de plus que lui, et elle passait tous ses étés sur l'île chez leur grand-mère Huguette.",
      "Grand-maman Huguette s'occupait du petit musée installé au pied du phare. Son mari, grand-papa Albert, en avait été le gardien pendant quarante ans. Depuis sa mort, la lanterne était éteinte.",
      "Le premier soir, pendant le souper, Jade a raconté la légende de l'île. « Les vieux pêcheurs disent que, les nuits de brume, une lumière s'allume parfois au sommet du phare. Comme si quelqu'un veillait encore sur les bateaux. » Émile a levé les yeux au ciel. « Les fantômes, ça n'existe pas. » Grand-maman n'a rien dit. Elle a seulement regardé par la fenêtre, avec un petit sourire triste.",
      "Cette nuit-là, Émile n'arrivait pas à dormir. Vers minuit, il s'est levé pour boire un verre d'eau. C'est alors qu'il l'a vue, à travers la fenêtre de la cuisine : une faible lueur, tout en haut du phare.",
    ]),
    questions: [
      c("Où se passe l'histoire ?", "Sur l'île aux Brumes", ["Dans une grande ville", "Sur un bateau de croisière", "Dans un camp de vacances"], "Paragraphe 1."),
      c("Que pense Émile en arrivant sur l'île ?", "Qu'il va s'ennuyer", ["Qu'il va adorer ses vacances", "Qu'il a oublié ses bagages", "Qu'il a peur du phare"], "Il pense que ses vacances « allaient être les plus longues de sa vie » : il s'attend à s'ennuyer.", "Inférence"),
      c("Qui est Jade ?", "La cousine d'Émile, âgée de 14 ans", ["La sœur d'Émile, âgée de 12 ans", "Une voisine de la grand-mère", "La gardienne du phare"], "Paragraphe 2.", "Personnages"),
      c("Qui était grand-papa Albert ?", "Le gardien du phare pendant 40 ans", ["Un pêcheur de l'île", "Le capitaine du traversier", "Le propriétaire du dépanneur"], "Paragraphe 3.", "Personnages"),
      c("Depuis quand la lanterne du phare est-elle éteinte ?", "Depuis la mort de grand-papa Albert", ["Depuis une tempête", "Depuis l'arrivée d'Émile", "Depuis toujours"], "Paragraphe 3."),
      c("Pourquoi grand-maman a-t-elle « un petit sourire triste » ?", "La légende lui fait penser à son mari", ["Elle n'aime pas Émile", "Elle a mal aux dents", "Elle trouve la légende ridicule"], "Inférence : la lumière du phare est liée à Albert, son mari décédé.", "Inférence"),
      c("Que pense Émile de la légende ?", "Il n'y croit pas", ["Il y croit tout de suite", "Il en a très peur", "Il l'a déjà entendue"], "« Les fantômes, ça n'existe pas. »"),
      c("Dans le texte, « le traversier a accosté » veut dire qu'il…", "s'est arrêté le long du quai", ["a coulé", "est reparti", "a fait naufrage"], "Accoster = s'approcher d'un quai pour s'y arrêter.", "Vocabulaire"),
      c("Que voit Émile à la fin du chapitre ?", "Une faible lueur en haut du phare", ["Un bateau en feu", "Sa grand-mère dans le jardin", "Un fantôme dans la cuisine"], "Paragraphe 5."),
      c("La fin du chapitre sert surtout à…", "créer du suspense", ["conclure l'histoire", "décrire la cuisine", "présenter un nouveau personnage"], "Le chapitre s'arrête sur un mystère : on a envie de lire la suite.", "Structure du récit"),
    ],
  },
  {
    niveau: 2,
    texte: chapitre(2, "Les traces", [
      "Le lendemain matin, Émile a tout raconté à Jade. Il s'attendait à ce qu'elle se moque de lui, mais elle a plutôt sorti son carnet et noté l'heure, la couleur de la lumière et la météo de la nuit. « De la brume, comme dans la légende », a-t-elle murmuré, les yeux brillants.",
      "Jade voulait aller au phare sur-le-champ. Émile, lui, n'était pas pressé. « Si c'est quelqu'un, il n'a peut-être pas envie qu'on vienne fouiner. » Jade a haussé les épaules. « Si c'est quelqu'un, justement, il faut savoir qui. C'est le phare de grand-papa. »",
      "Ils ont pris leurs vélos et suivi le chemin de gravier jusqu'à la pointe. La porte du phare était fermée par un gros cadenas rouillé. Pourtant, en se penchant, Émile a remarqué quelque chose d'étrange : dans la poussière, devant la porte, il y avait des traces de bottes toutes fraîches. Et une petite flaque d'huile, qui sentait fort.",
      "« Quelqu'un est entré, a dit Jade. Mais par où ? » Ils ont fait le tour de la tour blanche. Derrière, cachée par des rosiers sauvages, une petite fenêtre du rez-de-chaussée était entrouverte.",
      "À ce moment, une voix grave les a fait sursauter. « Qu'est-ce que vous faites là, vous deux ? » Un homme se tenait sur le sentier, une casquette délavée sur la tête et un seau de poissons à la main. C'était M. Lavoie, le pêcheur qui habitait la maison verte près du quai. Tout le monde sur l'île disait qu'il était bourru et qu'il n'aimait pas les enfants.",
      "« On… on se promenait », a bafouillé Émile. M. Lavoie les a regardés un long moment, puis il a grogné : « Le phare, c'est dangereux. Les escaliers sont pourris. Restez loin de là. » Il est reparti sans ajouter un mot.",
      "Sur le chemin du retour, Jade pédalait en silence. Puis elle a dit : « Tu as vu ses mains ? Elles étaient pleines de graisse noire. Comme la flaque devant la porte. »",
    ]),
    questions: [
      c("Comment Jade réagit-elle au récit d'Émile ?", "Elle prend des notes dans son carnet", ["Elle se moque de lui", "Elle va le dire à grand-maman", "Elle refuse de le croire"], "Paragraphe 1."),
      c("Lequel des deux cousins est le plus prudent ?", "Émile", ["Jade", "Les deux autant", "Aucun des deux"], "Paragraphe 2 : Émile n'est « pas pressé » d'aller fouiner.", "Personnages"),
      c("Pourquoi Jade tient-elle à savoir qui est au phare ?", "C'est le phare de leur grand-père", ["Elle veut devenir gardienne", "Elle veut gagner un prix", "Elle a peur des fantômes"], "« C'est le phare de grand-papa. »", "Personnages"),
      c("Quels indices trouvent-ils devant la porte ?", "Des traces de bottes et une flaque d'huile", ["Une clé et une lampe", "Des plumes et du sable", "Une lettre et une photo"], "Paragraphe 3."),
      c("Par où quelqu'un a-t-il pu entrer ?", "Par une petite fenêtre cachée", ["Par la porte cadenassée", "Par le toit", "Par un tunnel"], "Paragraphe 4."),
      c("Qui est M. Lavoie ?", "Un pêcheur qui habite près du quai", ["Le gardien du phare", "Le père de Jade", "Le capitaine du traversier"], "Paragraphe 5.", "Personnages"),
      c("Dans le texte, « bourru » veut dire…", "peu aimable, brusque", ["très drôle", "très riche", "très timide"], "Vocabulaire : une personne bourrue est rude, de mauvaise humeur.", "Vocabulaire"),
      c("« Émile a bafouillé » veut dire qu'il a…", "parlé de façon hésitante", ["crié très fort", "chanté", "parlé avec assurance"], "Bafouiller = parler en hésitant, à cause de la gêne ou de la peur.", "Vocabulaire"),
      c("Pourquoi Jade remarque-t-elle les mains de M. Lavoie ?", "Elle pense qu'il est peut-être entré dans le phare", ["Elle trouve qu'il devrait se laver", "Elle veut l'aider à pêcher", "Elle a peur qu'il soit blessé"], "Inférence : la graisse noire ressemble à la flaque d'huile devant la porte.", "Inférence"),
      chrono(["Émile raconte ce qu'il a vu.", "Les cousins vont au phare.", "Ils trouvent des traces de bottes.", "M. Lavoie les surprend."], "Ordre des paragraphes 1, 3 et 5."),
    ],
  },
  {
    niveau: 3,
    texte: chapitre(3, "La clé", [
      "Les jours suivants, Jade a transformé sa chambre en quartier général. Sur le mur, elle avait collé une carte de l'île, une photo du phare et une feuille intitulée « SUSPECT : M. LAVOIE », avec une liste d'indices. Émile trouvait que sa cousine exagérait un peu, mais il devait admettre que les indices s'accumulaient.",
      "Le mercredi, au dépanneur, ils ont vu M. Lavoie acheter dix contenants d'huile et une grosse ampoule spéciale. La caissière, Mme Bérubé, a ri : « Vous ouvrez un phare, monsieur Lavoie ? » Le pêcheur est devenu tout rouge et a payé sans répondre.",
      "Le soir, pendant qu'ils aidaient grand-maman à fermer le musée, Émile a remarqué un clou vide sur le mur, à côté d'une vieille photo de grand-papa Albert. « Il y avait quelque chose, ici ? » Grand-maman a hésité. « La clé du phare. Elle a disparu au printemps. J'imagine que je l'ai égarée… La mémoire, à mon âge. » Mais Émile a remarqué qu'elle ne semblait pas vraiment inquiète. Elle semblait plutôt… amusée.",
      "Sur la photo, grand-papa Albert posait devant la lanterne avec un jeune homme aux larges épaules. Au dos, une inscription à l'encre bleue : « Avec Gilles, mon apprenti, été 1979. »",
      "« Gilles, a répété Jade. Tu sais comment s'appelle M. Lavoie, de son prénom ? » Émile a secoué la tête. Le lendemain, en passant devant la boîte aux lettres de la maison verte, ils ont eu la réponse : G. Lavoie.",
      "Ce soir-là, Jade était surexcitée. « Il était l'apprenti de grand-papa ! Il connaît le phare par cœur. C'est lui qui a pris la clé, c'est sûr. » Émile, lui, avait un doute. « Mais pourquoi grand-maman n'est-elle pas fâchée ? Si quelqu'un m'avait volé une clé, je serais furieux. »",
      "Jade n'a pas répondu. Par la fenêtre, la brume recommençait à monter de la mer, épaisse comme de la laine. « La lumière, a-t-elle dit doucement. Elle s'allume les nuits de brume. Si on veut savoir la vérité, c'est cette nuit qu'il faut y aller. »",
      "Émile a avalé sa salive. Il pensait aux escaliers pourris, à la voix grave de M. Lavoie, au cadenas rouillé. Puis il a pensé à grand-papa Albert, qu'il avait si peu connu. « D'accord, a-t-il dit. Mais on apporte une lampe de poche. Et on reste ensemble. »",
    ]),
    questions: [
      c("Que contient la feuille collée au mur de Jade ?", "Une liste d'indices contre M. Lavoie", ["Un plan du musée", "Une recette de gâteau", "Une liste de devoirs"], "Paragraphe 1 : « SUSPECT : M. LAVOIE »."),
      c("Qu'achète M. Lavoie au dépanneur ?", "De l'huile et une grosse ampoule spéciale", ["Du poisson et du pain", "Un cadenas neuf", "Des cartes de l'île"], "Paragraphe 2."),
      c("Pourquoi M. Lavoie devient-il « tout rouge » ?", "Il est gêné qu'on devine presque son projet", ["Il a trop chaud", "Il est fâché contre les enfants", "Il a attrapé un coup de soleil"], "Inférence : la blague de Mme Bérubé tombe juste ; il ne veut pas qu'on sache.", "Inférence"),
      c("Qu'est-ce qui a disparu du musée ?", "La clé du phare", ["La photo de grand-papa", "La lanterne", "Le carnet de Jade"], "Paragraphe 3."),
      c("Grand-maman semble « amusée » plutôt qu'inquiète. Que peut-on en déduire ?", "Elle sait peut-être qui a la clé", ["Elle a très peur", "Elle ne se souvient de rien", "Elle veut vendre le phare"], "Inférence : on n'est pas amusé par un vol… sauf si on sait ce qui se passe vraiment.", "Inférence"),
      c("Qui était Gilles en 1979 ?", "L'apprenti de grand-papa Albert", ["Le frère de grand-maman", "Le capitaine du traversier", "Un touriste"], "Paragraphe 4 : « Avec Gilles, mon apprenti »."),
      c("Quel indice montre que M. Lavoie s'appelle Gilles ?", "Le « G. » sur sa boîte aux lettres", ["Son nom sur sa casquette", "Mme Bérubé le dit", "Il le dit lui-même"], "Paragraphe 5.", "Inférence"),
      c("« La brume, épaisse comme de la laine » est…", "une comparaison", ["une métaphore", "une énumération", "une répétition"], "Le mot « comme » relie la brume et la laine.", "Figures de style"),
      c("Au dernier paragraphe, qu'est-ce qui décide Émile à y aller ?", "Il pense à son grand-père Albert", ["Il veut impressionner Jade", "Il n'a plus peur du tout", "M. Lavoie l'a invité"], "« Puis il a pensé à grand-papa Albert, qu'il avait si peu connu. »", "Personnages"),
      chrono(["M. Lavoie achète de l'huile.", "Émile remarque le clou vide.", "Les cousins lisent la boîte aux lettres.", "Ils décident d'aller au phare."], "Ordre des paragraphes 2, 3, 5 et 7–8."),
    ],
  },
  {
    niveau: 4,
    texte: chapitre(4, "Une nuit de brume", [
      "Vers minuit, Émile et Jade se sont glissés hors de la maison sans faire de bruit. La brume était si dense que le faisceau de la lampe de poche ressemblait à un bâton de lumière blanche. On n'entendait que le bruit des vagues et, de temps en temps, la corne de brume d'un bateau, très loin.",
      "Quand ils sont arrivés à la pointe, la lueur brillait déjà au sommet du phare. Le cadenas pendait, ouvert, à la porte. Jade a poussé doucement. La porte a grincé comme dans un film d'horreur, et Émile a senti son cœur battre jusque dans ses oreilles.",
      "L'escalier en colimaçon montait dans le noir. Contrairement à ce qu'avait dit M. Lavoie, les marches n'étaient pas pourries du tout : elles étaient neuves, en bois clair, et sentaient encore la scie. Quelqu'un les avait remplacées une à une. Jade a lancé un regard à Émile. Ils ont commencé à grimper, marche après marche, en retenant leur souffle.",
      "Tout en haut, la porte de la salle de la lanterne était entrouverte. Une lumière chaude en sortait, et un air de vieille chanson, fredonné par une voix grave. Émile a reconnu la voix avant même de voir l'homme. M. Lavoie était là, à genoux, en train de polir les grandes lentilles de verre avec un chiffon. Autour de lui, des outils, des pots d'huile et des plans jaunis étaient étalés sur le sol.",
      "Il a levé la tête et les a vus. Pendant une seconde, personne n'a bougé. Émile s'attendait à des cris. Au lieu de ça, M. Lavoie a soupiré et s'est assis lourdement sur une caisse. « Bon. Je suppose que mon secret ne tiendra pas longtemps. »",
      "Il leur a tout raconté. À dix-sept ans, il était un garçon perdu, toujours dans le trouble. Albert l'avait pris comme apprenti, lui avait appris à entretenir la lanterne, à lire le ciel, à respecter la mer. « Il m'a sauvé, a dit M. Lavoie. Sans lui, je ne sais pas ce que je serais devenu. » Avant de mourir, Albert lui avait confié un regret : la lanterne éteinte, après tant d'années. M. Lavoie s'était promis de la rallumer.",
      "« Mais pourquoi en secret ? a demandé Jade. — Parce que dans dix jours, votre grand-mère aura quatre-vingts ans. Je voulais lui faire la surprise : allumer le phare le soir de sa fête. Les essais de lumière, les nuits de brume, c'était pour vérifier que tout fonctionnait sans que personne ne le voie trop. » Il a eu un petit rire. « Raté, on dirait. »",
      "Émile a pensé à la feuille « SUSPECT » sur le mur de Jade et s'est senti un peu honteux. Jade, elle, avait les larmes aux yeux. « Et la clé ? a-t-elle demandé. — C'est Huguette qui me l'a prêtée, au printemps. Elle se doute de quelque chose, je crois, mais elle ne pose pas de questions. Elle me fait confiance. »",
      "M. Lavoie s'est levé et leur a tendu deux chiffons. « Bon. Puisque vous êtes là, autant vous rendre utiles. Il reste trois lentilles à polir, et je n'ai plus vingt ans. » Pour la première fois, Émile a vu le pêcheur bourru sourire pour de vrai.",
    ]),
    questions: [
      c("Pourquoi le faisceau de la lampe ressemble-t-il à « un bâton de lumière » ?", "À cause de la brume très épaisse", ["Parce que la lampe est neuve", "Parce qu'il fait jour", "Parce que Jade la secoue"], "Paragraphe 1 : la brume rend le faisceau visible et solide."),
      c("« Un escalier en colimaçon » est un escalier…", "en spirale", ["très large", "en pierre", "brisé"], "Vocabulaire : colimaçon = escargot ; l'escalier tourne en spirale.", "Vocabulaire"),
      c("Qu'y a-t-il d'étonnant dans l'escalier ?", "Les marches sont neuves", ["Les marches sont pourries", "Il n'y a pas de marches", "Il est rempli d'eau"], "Paragraphe 3 : elles « sentaient encore la scie »."),
      c("Pourquoi M. Lavoie avait-il dit que les escaliers étaient pourris ?", "Pour éloigner les enfants et protéger son secret", ["Parce qu'il ne le savait pas", "Parce qu'il voulait les vendre", "Parce qu'il avait peur des hauteurs"], "Inférence : les marches sont neuves, il a donc menti pour qu'on ne vienne pas.", "Inférence"),
      c("Que fait M. Lavoie quand les enfants arrivent ?", "Il polit les lentilles de la lanterne", ["Il dort sur une caisse", "Il répare le cadenas", "Il pêche par la fenêtre"], "Paragraphe 4."),
      c("Que s'est-il passé dans la jeunesse de M. Lavoie ?", "Albert l'a pris comme apprenti et l'a aidé à s'en sortir", ["Il a été gardien d'un autre phare", "Il a fait naufrage", "Il est parti vivre en ville"], "Paragraphe 6 : « Il m'a sauvé ».", "Personnages"),
      c("Pourquoi M. Lavoie veut-il rallumer le phare ?", "Pour tenir sa promesse à Albert et surprendre Huguette", ["Pour attirer les touristes", "Pour gagner de l'argent", "Pour faire peur aux enfants"], "Paragraphes 6 et 7 : la promesse faite à Albert et les 80 ans de Huguette.", "Personnages"),
      c("Pourquoi faisait-il ses essais les nuits de brume ?", "Pour que la lumière soit moins visible", ["Parce qu'il travaille le jour", "Parce que la légende l'exige", "Parce que la brume nettoie le verre"], "Paragraphe 7 : « sans que personne ne le voie trop »."),
      c("Pourquoi Émile se sent-il un peu honteux ?", "Ils avaient soupçonné M. Lavoie à tort", ["Il est sorti sans permission", "Il a cassé une lentille", "Il a eu peur dans l'escalier"], "Paragraphe 8 : il repense à la feuille « SUSPECT ».", "Inférence"),
      c("Comment M. Lavoie a-t-il obtenu la clé ?", "Huguette la lui a prêtée", ["Il l'a volée au musée", "Il en a fait une copie", "Il l'a trouvée sur la plage"], "Paragraphe 8."),
    ],
  },
  {
    niveau: 5,
    texte: chapitre(5, "La lumière d'Albert", [
      "Pendant dix jours, Émile et Jade ont vécu une double vie. Le jour, ils aidaient grand-maman au musée comme si de rien n'était. Le soir, ils rejoignaient M. Lavoie au phare pour polir, huiler, visser et vérifier. Émile, qui ne savait même pas changer une ampoule au début de l'été, connaissait maintenant le nom de chaque pièce de la lanterne.",
      "Jade avait remplacé sa feuille « SUSPECT » par une autre, intitulée « OPÉRATION ALBERT ». Elle y notait les tâches à accomplir et cochait chaque case avec un plaisir évident. Il avait aussi fallu organiser la fête en secret : Mme Bérubé s'occupait du gâteau, les pêcheurs du quai avaient promis de venir avec leurs bateaux, et même le capitaine du traversier avait accepté de retarder le dernier départ.",
      "Le soir de l'anniversaire, Jade a proposé à grand-maman une promenade « juste pour prendre l'air ». Grand-maman a enfilé son châle bleu sans poser de questions, mais Émile a cru voir une lueur malicieuse dans ses yeux.",
      "Arrivés à la pointe, ils ont trouvé une cinquantaine de personnes réunies dans le noir, en silence. Sur la mer, les lumières des bateaux de pêche dansaient doucement. Grand-maman s'est arrêtée net. « Mais qu'est-ce que… »",
      "À ce moment précis, M. Lavoie a abaissé le levier. Au sommet de la tour, la lanterne s'est allumée. Un grand faisceau blanc a balayé la mer, puis l'île, puis la mer encore, exactement comme autrefois. Les bateaux ont répondu en faisant sonner leurs cornes. Tout le monde s'est mis à applaudir.",
      "Grand-maman Huguette n'applaudissait pas. Elle regardait la lumière tourner, les mains serrées sur son châle, et des larmes coulaient sur ses joues ridées. M. Lavoie est descendu la rejoindre. « Il me l'avait demandé, Huguette. Je lui avais promis. » Elle a pris ses grosses mains dans les siennes. « Je le savais, Gilles. Je t'ai donné la clé, non ? »",
      "Plus tard, pendant qu'on servait le gâteau, Jade s'est approchée d'Émile. « Alors, monsieur « les fantômes, ça n'existe pas » ? » Émile a souri. « Il n'y avait pas de fantôme. Juste quelqu'un qui n'avait pas oublié. » Il a regardé M. Lavoie, qui riait avec les pêcheurs. « Et on l'avait mal jugé. »",
      "Ce soir-là, avant de dormir, Émile a ouvert le carnet que Jade lui avait offert. Sur la première page, il a écrit : « Ce que j'ai appris cet été : les gens bourrus ont parfois les plus grands cœurs. Les vacances les plus longues peuvent passer trop vite. Et une lumière, ça peut se rallumer. » Par la fenêtre, le faisceau du phare passait et repassait, comme un clin d'œil.",
    ]),
    questions: [
      c("Que veut dire « vivre une double vie », au paragraphe 1 ?", "Faire une chose en secret en plus de sa vie habituelle", ["Vivre dans deux maisons", "Avoir un jumeau", "Travailler deux fois plus vite"], "Le jour au musée, le soir au phare, en secret.", "Vocabulaire"),
      c("Que signifie le titre « OPÉRATION ALBERT » ?", "Le projet de rallumer le phare en l'honneur d'Albert", ["Une enquête contre M. Lavoie", "Une opération médicale", "Le nom d'un bateau"], "Inférence : la nouvelle feuille remplace « SUSPECT » ; ils travaillent maintenant avec M. Lavoie.", "Inférence"),
      c("Qui s'occupe du gâteau ?", "Mme Bérubé", ["Jade", "M. Lavoie", "Le capitaine du traversier"], "Paragraphe 2."),
      c("« Une lueur malicieuse dans ses yeux » laisse penser que grand-maman…", "se doute qu'on lui prépare une surprise", ["est fâchée", "est très fatiguée", "a perdu ses lunettes"], "Inférence : malicieux = qui s'amuse d'un secret.", "Inférence"),
      c("Comment les bateaux réagissent-ils quand le phare s'allume ?", "Ils font sonner leurs cornes", ["Ils rentrent au port", "Ils éteignent leurs lumières", "Ils lancent des feux d'artifice"], "Paragraphe 5."),
      c("Que révèle la phrase de grand-maman : « Je t'ai donné la clé, non ? »", "Elle savait depuis le début ce que préparait M. Lavoie", ["Elle veut récupérer sa clé", "Elle accuse M. Lavoie de vol", "Elle a oublié qu'elle avait une clé"], "Inférence : c'est elle qui a prêté la clé ; elle lui faisait confiance.", "Inférence"),
      c("Au chapitre 1, Émile disait : « Les fantômes, ça n'existe pas. » À la fin, comment explique-t-il la lumière ?", "Quelqu'un n'avait pas oublié Albert", ["C'était vraiment un fantôme", "C'était un reflet de la lune", "C'était un bateau perdu"], "Paragraphe 7 : « Juste quelqu'un qui n'avait pas oublié. »", "Lien entre les chapitres"),
      c("Au début du roman, Émile pensait que ses vacances seraient très longues. Qu'écrit-il à la fin ?", "Qu'elles peuvent passer trop vite", ["Qu'elles ont été ennuyantes", "Qu'il veut rentrer chez lui", "Qu'il n'aime pas l'île"], "Paragraphe 8 : le personnage a changé d'avis.", "Personnages"),
      c("« Le faisceau du phare passait et repassait, comme un clin d'œil » est…", "une comparaison", ["une métaphore", "une énumération", "une hyperbole"], "Le mot « comme » relie le faisceau et le clin d'œil.", "Figures de style"),
      c("Quel est le thème principal du roman ?", "Il ne faut pas juger les gens trop vite", ["Les fantômes existent", "Il faut toujours obéir aux adultes", "La pêche est un métier dangereux"], "Émile et Jade soupçonnaient M. Lavoie ; il était en fait généreux et fidèle.", "Thème"),
    ],
  },
];

export const TEXTES: Record<string, Texte> = Object.fromEntries(
  [...COMPREHENSION, ...ROMAN].map((l) => [l.texte.id, l.texte]),
);

export const uniteComprehension = uniteLecture(
  { id: "comprehension", titre: "Compréhension de texte", icone: "📖", description: "Récits, textes informatifs et argumentatifs" },
  COMPREHENSION,
);

export const uniteRoman = uniteLecture(
  { id: "roman", titre: "Roman : Le secret du phare", icone: "🏝️", description: "Un mini-roman en 5 chapitres, un par niveau" },
  ROMAN,
);
