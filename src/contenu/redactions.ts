// Questions à réponse rédigée pour chaque texte de lecture.
// Chaque question liste les idées attendues : si une idée manque, le commentaire explique quoi ajouter
// et où la trouver dans le texte. Les « mots » sont cherchés sans tenir compte des accents ni des majuscules.
import type { Critere, QuestionRedaction } from "./types";

const r = (enonce: string, criteres: Critere[], modele: string, minMots = 8): QuestionRedaction => ({
  type: "redaction",
  consigne: "Réponds par écrit, en phrases complètes",
  enonce,
  criteres,
  modele,
  minMots,
  explication: `Idées attendues : ${criteres.map((c) => c.idee).join(" ; ")}.`,
});

/** Idées communes aux questions d'opinion : un choix clair + une justification. */
const choixClair = (siAbsent = "Commence par donner clairement ton avis : « Oui, … » ou « Non, … »."): Critere => ({
  idee: "tu donnes clairement ton avis",
  mots: [" oui", " non", "d'accord", "daccord", "j'aurais", "jaurais", "je pense", "a mon avis", "selon moi", "j'ai aime", "jai aime", "je n'ai pas aime", "il a bien fait", "il a eu raison", "il a eu tort", "il n'a pas bien fait"],
  siAbsent,
});
const justification = (siAbsent = "Justifie ton avis avec une raison : utilise « parce que » ou « car »."): Critere => ({
  idee: "tu justifies avec une raison",
  mots: ["parce", " car ", "puisque", "en effet", "c'est pourquoi"],
  siAbsent,
});

export const REDACTIONS: Record<string, QuestionRedaction[]> = {
  tempete: [
    r("Pourquoi Léa est-elle fière à la fin de la journée ? Explique avec tes mots.", [
      { idee: "elle a aidé son voisin à déneiger", mots: ["aide", "pellet", "deneig", "coup de main"], siAbsent: "Explique ce que Léa a fait de bien : elle a aidé M. Gagnon à déneiger son entrée (paragraphe 3)." },
      { idee: "elle a découvert que M. Gagnon était un champion", mots: ["champion", "hockey", "trophee", "photo"], siAbsent: "Parle aussi de sa découverte : la photo montre que M. Gagnon a été un champion de hockey (paragraphe 4)." },
    ], "Léa est fière parce qu'elle a aidé M. Gagnon à déneiger son entrée et qu'elle a découvert qu'il avait été un champion de hockey."),
    r("Aurais-tu aidé M. Gagnon à la place de Léa ? Pourquoi ?", [
      choixClair(),
      justification(),
    ], "Oui, j'aurais aidé M. Gagnon parce qu'il avait de la difficulté à pelleter et qu'il est important d'aider ses voisins."),
  ],
  castor: [
    r("Explique pourquoi on dit que le castor est une « espèce ingénieure ».", [
      { idee: "il construit des barrages qui transforment son milieu", mots: ["barrage", "construit", "transforme", "modifie", "change le paysage", "change son milieu", "etang"], siAbsent: "Explique ce que fait le castor : il construit des barrages qui transforment son milieu (paragraphes 2 et 4)." },
      { idee: "cela profite à d'autres animaux", mots: ["animaux", "grenouille", "canard", "poisson", "orignal", "orignaux", "especes"], siAbsent: "Ajoute que ses étangs profitent à beaucoup d'autres animaux : grenouilles, canards, poissons, orignaux (paragraphe 4)." },
    ], "On dit que le castor est une espèce ingénieure parce qu'il construit des barrages qui transforment son milieu et créent des étangs utiles à beaucoup d'autres animaux."),
    r("Nomme un avantage et un inconvénient des barrages de castors.", [
      { idee: "un avantage (habitat pour d'autres animaux)", mots: ["animaux", "grenouille", "canard", "poisson", "orignal", "orignaux", "habitat", "etang"], siAbsent: "Il manque un avantage : les étangs attirent et abritent beaucoup d'animaux (paragraphe 4)." },
      { idee: "un inconvénient (inondations)", mots: ["inond", "route", "terrain", "probleme"], siAbsent: "Il manque un inconvénient : les barrages inondent parfois des routes ou des terrains (paragraphe 4)." },
    ], "Un avantage est que les étangs créés par les barrages attirent beaucoup d'animaux. Un inconvénient est qu'ils inondent parfois des routes ou des terrains."),
  ],
  carnet: [
    r("Comment sais-tu que le carnet appartient à Inès ? Donne deux indices du texte.", [
      { idee: "elle cherche quelque chose sous la chaise, l'air inquiet", mots: ["cherch", "sous la chaise", "pench", "inquiet", "regardait partout", "regarde partout"], siAbsent: "Premier indice à trouver : Inès cherche sous la chaise, l'air inquiet (paragraphe 5)." },
      { idee: "elle rougit quand Samuel lui rend le carnet", mots: ["rouge", "rougi", "tomate", "gene", "soulag"], siAbsent: "Deuxième indice à trouver : elle devient rouge comme une tomate quand Samuel lui tend le carnet (paragraphe 6)." },
    ], "Je le sais parce qu'Inès cherche quelque chose sous la chaise avec un air inquiet, puis elle devient rouge comme une tomate quand Samuel lui rend le carnet."),
    r("Samuel a-t-il bien fait d'ouvrir le carnet ? Donne ton avis et justifie-le.", [
      choixClair(),
      justification(),
      { idee: "tu t'appuies sur un élément du texte", mots: ["excuse", "amitie", "ami", "prive", "permission", "ne pas ouvrir", "dragon", "dessin", "ines"], siAbsent: "Appuie-toi sur le texte : par exemple, le carnet disait « Ne pas ouvrir », Samuel s'est excusé, ou leur amitié a commencé grâce au carnet." },
    ], "Non, il n'aurait pas dû l'ouvrir, car le carnet disait « Ne pas ouvrir » et c'était privé. Par contre, il s'est excusé et cela a permis à Samuel et Inès de devenir amis."),
  ],
  cellulaire: [
    r("Résume les trois arguments de l'auteur en une ou deux phrases.", [
      { idee: "la concentration", mots: ["concentr", "attention", "distrai", "notification"], siAbsent: "Il manque le 1er argument : le cellulaire nuit à la concentration (paragraphe 2)." },
      { idee: "les relations entre les élèves", mots: ["relation", "se parlent", "parler", "equipe", "ensemble", "social", "amis"], siAbsent: "Il manque le 2e argument : sans cellulaire, les élèves se parlent et travaillent mieux ensemble (paragraphe 3)." },
      { idee: "la protection (cyberintimidation, photos)", mots: ["cyber", "intimid", "photo", "proteg", "securit"], siAbsent: "Il manque le 3e argument : l'interdiction protège contre la cyberintimidation et les photos prises sans permission (paragraphe 4)." },
    ], "Selon l'auteur, interdire le cellulaire aide les élèves à se concentrer, favorise les relations entre eux et les protège contre la cyberintimidation et les photos prises sans permission.", 12),
    r("Es-tu d'accord avec l'auteur ? Donne ton opinion et au moins un argument.", [
      choixClair("Commence par donner clairement ton opinion : « Je suis d'accord… » ou « Je ne suis pas d'accord… »."),
      justification("Ajoute au moins un argument, introduit par « parce que » ou « car »."),
    ], "Je suis d'accord avec l'auteur, parce que lorsque mon cellulaire est près de moi, j'ai envie de le regarder et je me concentre moins bien."),
  ],
  portage: [
    r("Explique pourquoi Anick a eu raison d'attendre. Appuie-toi sur le texte.", [
      { idee: "le danger des vagues (le canot pouvait chavirer)", mots: ["vague", "chavir", "tempete", "danger", "risque", "eau froide", "dangereux"], siAbsent: "Explique le danger : avec les vagues, le canot chargé pouvait chavirer dans l'eau froide (paragraphe 4)." },
      { idee: "la preuve : la tempête est arrivée, puis elles ont traversé sans difficulté", mots: ["pluie", "vagues blanches", "rocher", "calme", "sans difficulte", "vent est tombe", "plus tard", "traverse"], siAbsent: "Donne la preuve tirée du texte : une forte pluie et des vagues blanches sont arrivées, puis elles ont traversé le lac calme sans difficulté (paragraphes 5 et 7)." },
    ], "Anick a eu raison d'attendre, car avec les vagues le canot chargé aurait pu chavirer. D'ailleurs, une grosse pluie et des vagues blanches sont arrivées, puis elles ont traversé le lac calme sans difficulté."),
    r("Comment Rosalie a-t-elle changé entre le début et la fin du récit ?", [
      { idee: "au début, elle est réticente ou impatiente", mots: ["boud", "impatien", "ne voulait pas", "voulait pas", "bout des levres", "piscine", "fache", "pas envie", "enthousias", "hate de rentrer"], siAbsent: "Décris Rosalie au début : elle part à contrecœur et s'impatiente quand sa tante décide d'attendre (paragraphes 1 et 4)." },
      { idee: "à la fin, elle apprécie l'expérience et fait confiance à sa tante", mots: ["revenir", "confiance", "range", "apprecie", "aime", "fiere", "content", "porte le canot", "n'abandonne pas"], siAbsent: "Décris Rosalie à la fin : elle porte le canot, range son téléphone et veut revenir l'an prochain (paragraphes 7 et 8)." },
    ], "Au début, Rosalie part sans enthousiasme et boude quand sa tante décide d'attendre. À la fin, elle fait confiance à Anick, range son téléphone et veut même revenir l'an prochain."),
  ],
  "phare-1": [
    r("Décris Émile au début de l'histoire : que pense-t-il de ses vacances et de la légende ?", [
      { idee: "il pense qu'il va s'ennuyer sur l'île", mots: ["ennui", "ennuy", "longues", "plate", "rien a faire", "pas de cinema", "pas content", "n'aime pas"], siAbsent: "Dis ce qu'Émile pense de ses vacances : il croit qu'elles seront les plus longues de sa vie, qu'il va s'ennuyer (paragraphe 1)." },
      { idee: "il ne croit pas à la légende", mots: ["fantome", "croit pas", "n'y croit", "existe pas", "legende"], siAbsent: "Dis ce qu'il pense de la légende : il n'y croit pas (« Les fantômes, ça n'existe pas »), paragraphe 4." },
    ], "Au début, Émile pense qu'il va s'ennuyer sur l'île parce qu'il n'y a rien à faire. Il ne croit pas non plus à la légende : pour lui, les fantômes n'existent pas."),
    r("Selon toi, qui ou quoi pourrait allumer la lumière du phare ? Justifie avec un indice du chapitre.", [
      { idee: "tu proposes une hypothèse", mots: ["quelqu'un", "personne", "fantome", "albert", "grand-papa", "pecheur", "gardien", "homme", "femme", "grand-maman", "huguette"], siAbsent: "Propose une hypothèse claire : « Je pense que c'est… »." },
      justification("Justifie ton hypothèse avec un indice du chapitre (la légende, la brume, le sourire triste de grand-maman…)."),
    ], "Je pense que quelqu'un de l'île allume la lumière, parce que grand-maman a un sourire triste comme si elle savait quelque chose."),
  ],
  "phare-2": [
    r("Quels indices font penser que M. Lavoie est entré dans le phare ? Nomme-en au moins deux.", [
      { idee: "ses mains pleines de graisse, comme la flaque d'huile", mots: ["graisse", "huile", "mains"], siAbsent: "Indice à trouver : ses mains sont pleines de graisse noire, comme la flaque d'huile devant la porte (paragraphes 3 et 7)." },
      { idee: "il veut éloigner les enfants du phare", mots: ["eloign", "dangereux", "restez loin", "pourri", "escalier"], siAbsent: "Autre indice : il essaie d'éloigner les enfants en disant que le phare est dangereux (paragraphe 6)." },
    ], "M. Lavoie a les mains pleines de graisse noire, comme la flaque d'huile devant la porte, et il essaie d'éloigner les enfants en disant que les escaliers sont pourris."),
    r("En quoi Jade et Émile sont-ils différents ? Donne un exemple pour chacun.", [
      { idee: "Jade est curieuse et veut enquêter", mots: ["curieu", "courag", "veut aller", "enquet", "note", "carnet", "tout de suite", "sur-le-champ", "impatient"], siAbsent: "Décris Jade : elle est curieuse, prend des notes et veut aller au phare sur-le-champ (paragraphes 1 et 2)." },
      { idee: "Émile est plus prudent", mots: ["prudent", "peur", "hesit", "pas presse", "craint", "inquiet"], siAbsent: "Décris Émile : il est plus prudent, il n'est « pas pressé » d'aller fouiner (paragraphe 2)." },
    ], "Jade est curieuse : elle prend des notes et veut aller au phare tout de suite. Émile est plus prudent : il n'est pas pressé d'aller fouiner."),
  ],
  "phare-3": [
    r("Explique le lien entre M. Lavoie et grand-papa Albert.", [
      { idee: "M. Lavoie était son apprenti", mots: ["apprenti"], siAbsent: "Le lien principal : M. Lavoie (Gilles) était l'apprenti de grand-papa Albert (paragraphe 4)." },
      { idee: "la preuve : la photo de 1979 et le prénom Gilles", mots: ["1979", "photo", "gilles", "boite aux lettres", "g lavoie"], siAbsent: "Donne la preuve : la photo « Avec Gilles, mon apprenti, été 1979 » et le « G. Lavoie » de la boîte aux lettres (paragraphes 4 et 5)." },
    ], "M. Lavoie était l'apprenti de grand-papa Albert. On le sait grâce à la photo « Avec Gilles, mon apprenti, été 1979 » et à la boîte aux lettres où il est écrit G. Lavoie."),
    r("Pourquoi grand-maman ne semble-t-elle pas inquiète de la disparition de la clé ? Fais une hypothèse.", [
      { idee: "elle sait (ou se doute de) qui a la clé", mots: ["sait", "connait", "se doute", "au courant", "prete", "donne", "confiance", "secret"], siAbsent: "Fais une hypothèse : peut-être qu'elle sait qui a la clé, ou qu'elle l'a donnée elle-même." },
      { idee: "tu nommes qui pourrait l'avoir", mots: ["lavoie", "gilles", "pecheur", "apprenti", "quelqu'un"], siAbsent: "Précise qui pourrait avoir la clé, selon toi (par exemple M. Lavoie, l'ancien apprenti)." },
    ], "Je pense que grand-maman sait que c'est M. Lavoie qui a la clé, et elle lui fait confiance. C'est pour ça qu'elle a l'air amusée."),
  ],
  "phare-4": [
    r("Pourquoi M. Lavoie veut-il rallumer le phare ? Donne deux raisons.", [
      { idee: "il a promis à Albert de rallumer la lanterne", mots: ["promesse", "promis", "albert", "regret", "grand-papa"], siAbsent: "Première raison : il a promis à Albert, qui l'avait aidé quand il était jeune, de rallumer la lanterne (paragraphe 6)." },
      { idee: "il veut faire une surprise pour les 80 ans de Huguette", mots: ["anniversaire", "80", "quatre-vingts", "fete", "surprise", "huguette", "grand-maman"], siAbsent: "Deuxième raison : il veut faire une surprise à Huguette pour ses 80 ans (paragraphe 7)." },
    ], "M. Lavoie veut rallumer le phare parce qu'il l'a promis à Albert, qui l'avait sauvé quand il était jeune, et parce qu'il veut faire une surprise à Huguette pour ses 80 ans."),
    r("Pourquoi Émile se sent-il honteux ? Qu'a-t-il compris sur M. Lavoie ?", [
      { idee: "ils l'avaient soupçonné à tort", mots: ["soupcon", "suspect", "accus", "mal juge", "pensait", "croyait"], siAbsent: "Explique la honte : Émile et Jade avaient traité M. Lavoie de « suspect » alors qu'il préparait quelque chose de beau (paragraphe 8)." },
      { idee: "M. Lavoie est en fait généreux et fidèle", mots: ["gentil", "genereux", "bon", "coeur", "fidele", "pas mechant", "apparence", "juger"], siAbsent: "Dis ce qu'il a compris : sous ses airs bourrus, M. Lavoie est généreux et fidèle à Albert." },
    ], "Émile se sent honteux parce qu'ils avaient soupçonné M. Lavoie, alors qu'il préparait une belle surprise. Il comprend que M. Lavoie, malgré son air bourru, est généreux et fidèle."),
  ],
  "phare-5": [
    r("Que veut dire Émile quand il écrit : « Les gens bourrus ont parfois les plus grands cœurs » ? Donne un exemple du roman.", [
      { idee: "il ne faut pas se fier aux apparences", mots: ["apparence", "juger", "air", "dehors", "en realite", "en fait", "cache"], siAbsent: "Explique le sens : une personne qui semble désagréable peut être très généreuse ; il ne faut pas juger sur les apparences." },
      { idee: "l'exemple de M. Lavoie", mots: ["lavoie", "pecheur", "gilles"], siAbsent: "Donne l'exemple du roman : M. Lavoie semblait bourru, mais il a rallumé le phare pour Albert et Huguette." },
    ], "Émile veut dire qu'il ne faut pas juger les gens sur leur apparence. Par exemple, M. Lavoie semblait bourru, mais il a passé des mois à rallumer le phare pour Albert et Huguette."),
    r("As-tu aimé la fin du roman ? Justifie ta réponse.", [
      choixClair("Commence par dire clairement si tu as aimé la fin : « J'ai aimé… » ou « Je n'ai pas aimé… »."),
      justification(),
      { idee: "tu parles d'un moment précis de la fin", mots: ["phare", "lumiere", "lanterne", "huguette", "grand-maman", "fete", "bateaux", "carnet", "lavoie", "larmes"], siAbsent: "Appuie ton avis sur un moment précis : le phare qui s'allume, les larmes de grand-maman, le carnet d'Émile…" },
    ], "J'ai aimé la fin parce que le phare se rallume pour l'anniversaire de grand-maman et qu'elle avouait savoir depuis le début : c'était émouvant."),
  ],
};
