// Anglais langue seconde — 2e secondaire. Questions originales écrites pour KidsSchool.
// Les consignes sont en anglais (immersion) ; les explications pour les parents sont en français.
import { uniteIrreguliers } from "./irreguliers";
import { uniteBanque } from "./outils";
import type { Matiere, QuestionBanque } from "./types";

type N = QuestionBanque["niveau"];
const c = (niveau: N, enonce: string, bonne: string, autres: string[], explication: string, consigne = "Choose the right answer"): QuestionBanque =>
  ({ type: "choix", niveau, consigne, enonce, bonne, autres, explication });
const s = (niveau: N, consigne: string, enonce: string, acceptees: string[], explication: string): QuestionBanque =>
  ({ type: "saisie", niveau, consigne, enonce, acceptees, explication });
const o = (niveau: N, mots: string[], explication: string, intrus: string[] = [], enonce = "Build the sentence."): QuestionBanque =>
  ({ type: "ordre", niveau, consigne: "Put the words in order", enonce, mots, intrus, explication });

const vocabulaire: QuestionBanque[] = [
  c(1, "« un cahier » in English is…", "a notebook", ["a backpack", "a pencil", "a ruler"], "Cahier = notebook.", "Translate"),
  c(1, "« la cuisine » in English is…", "the kitchen", ["the bedroom", "the kitten", "the garden"], "Cuisine (pièce) = kitchen.", "Translate"),
  c(1, "« fatigué » in English is…", "tired", ["angry", "hungry", "scared"], "Fatigué = tired.", "Translate"),
  c(1, "What do you use to cut paper?", "scissors", ["glue", "an eraser", "a stapler"], "Ciseaux = scissors.", "Vocabulary"),
  c(2, "« ma tante » in English is…", "my aunt", ["my uncle", "my niece", "my cousin"], "Tante = aunt.", "Translate"),
  c(2, "The opposite of « cheap » is…", "expensive", ["easy", "small", "cold"], "Cheap (pas cher) ≠ expensive (cher).", "Vocabulary"),
  s(2, "Translate into English", "« le mercredi »", ["wednesday", "on wednesday", "on wednesdays"], "Mercredi = Wednesday (avec une majuscule en anglais)."),
  c(2, "Which word is a fruit?", "a pear", ["a pea", "a bean", "a carrot"], "Pear = poire ; pea = petit pois.", "Vocabulary"),
  c(3, "« J'ai hâte » in English is…", "I can't wait", ["I'm in a hurry", "I hate it", "I have time"], "Expression : I can't wait = j'ai hâte.", "Translate"),
  c(3, "A « library » is a place where you…", "borrow books", ["buy books", "eat lunch", "see a doctor"], "Faux ami : library = bibliothèque (librairie = bookstore).", "False friends"),
  s(3, "Translate into English", "« un ordinateur »", ["a computer", "computer"], "Ordinateur = computer."),
  c(3, "« actually » means…", "en fait", ["actuellement", "activement", "exactement"], "Faux ami : actually = en fait ; actuellement = currently.", "False friends"),
  c(4, "Choose the best word: She was so ___ that she fell asleep in class.", "exhausted", ["excited", "exhausting", "amazed"], "Exhausted = épuisé (pour une personne).", "Vocabulary"),
  c(4, "« to look forward to » means…", "avoir hâte de", ["regarder devant", "chercher", "oublier"], "Phrasal verb : I look forward to the holidays.", "Phrasal verbs"),
  s(4, "Translate into English", "« Il pleut à verse. »", ["it's pouring", "it is pouring", "it's raining heavily", "it is raining heavily", "it's pouring rain", "it is pouring rain"], "Expression : it's pouring (rain)."),
  c(4, "« to give up » means…", "abandonner", ["donner", "se lever", "rendre visite"], "Phrasal verb : don't give up = n'abandonne pas.", "Phrasal verbs"),
  c(5, "Which sentence is correct?", "I'm really looking forward to seeing you.", ["I'm really looking forward to see you.", "I really look forward see you.", "I'm looking forward for seeing you."], "Après « look forward to », on met le verbe en -ing.", "Grammar"),
  c(5, "« She's been feeling under the weather. » means she…", "feels a bit sick", ["is outside in the rain", "is in a good mood", "is travelling"], "Under the weather = pas dans son assiette.", "Idioms"),
  c(5, "« a piece of cake » (idiom) means…", "very easy", ["very delicious", "a small reward", "a birthday"], "Idiom : it was a piece of cake = c'était facile.", "Idioms"),
  c(5, "Pick the synonym of « reluctant »:", "unwilling", ["eager", "curious", "proud"], "Reluctant = réticent, peu enclin.", "Vocabulary"),
];

const present: QuestionBanque[] = [
  c(1, "She ___ to school every day.", "walks", ["walk", "walking", "is walk"], "Present simple, 3e personne du singulier : on ajoute -s."),
  c(1, "I ___ pizza.", "like", ["likes", "liking", "am like"], "Present simple avec « I » : pas de -s."),
  c(1, "They ___ in Montreal.", "live", ["lives", "living", "is live"], "Present simple avec « they » : pas de -s."),
  s(1, "Complete with the verb « to be »", "We ___ friends.", ["are"], "To be : we are."),
  c(2, "Look! The baby ___.", "is sleeping", ["sleeps", "sleep", "are sleeping"], "Action en cours maintenant (Look!) → present continuous."),
  c(2, "My brother ___ hockey on Saturdays.", "plays", ["is playing", "play", "playing"], "Habitude (on Saturdays) → present simple."),
  c(2, "___ you like chocolate?", "Do", ["Does", "Are", "Is"], "Question au present simple avec « you » : Do."),
  s(2, "Complete with the negative", "He ___ (not / like) spiders.", ["doesn't like", "does not like"], "Négation 3e personne : doesn't + verbe de base."),
  c(3, "Right now, we ___ a test.", "are writing", ["write", "writes", "is writing"], "Right now → present continuous : we are writing."),
  c(3, "___ your mother work at the hospital?", "Does", ["Do", "Is", "Are"], "3e personne du singulier (your mother) → Does."),
  s(3, "Write the -ing form", "swim → ___", ["swimming"], "Verbe court terminé par consonne-voyelle-consonne : on double la consonne."),
  o(3, ["She", "is", "reading", "a", "book", "now."], "Present continuous : sujet + is + verbe-ing."),
  c(4, "Water ___ at 100 °C.", "boils", ["is boiling", "boil", "boiling"], "Vérité générale → present simple."),
  c(4, "I can't talk now, I ___ dinner.", "am cooking", ["cook", "cooks", "cooking"], "Action en cours → present continuous."),
  o(4, ["Does", "your", "sister", "speak", "Spanish?"], "Question au present simple : Does + sujet + verbe de base.", ["speaks"]),
  s(4, "Write the -ing form", "make → ___", ["making"], "Verbe terminé par -e muet : on enlève le e (making)."),
  c(5, "This week, Mia ___ at her grandparents' house.", "is staying", ["stays", "stay", "staying"], "Situation temporaire (this week) → present continuous."),
  c(5, "Which sentence is correct?", "I don't understand this word.", ["I'm not understanding this word.", "I doesn't understand this word.", "I not understand this word."], "« Understand » est un verbe d'état : pas de forme continue.", "Grammar"),
  o(5, ["What", "are", "you", "doing", "this", "weekend?"], "Question au present continuous pour un projet prévu."),
  c(5, "Listen! Someone ___ at the door.", "is knocking", ["knocks", "knock", "knocked"], "Listen! → action en train de se produire : present continuous."),
];

const passe: QuestionBanque[] = [
  s(1, "Write the past simple", "play → ___", ["played"], "Verbe régulier : + ed."),
  s(1, "Write the past simple", "go → ___", ["went"], "Verbe irrégulier : go → went."),
  s(1, "Write the past simple", "have → ___", ["had"], "Verbe irrégulier : have → had."),
  c(1, "Yesterday, I ___ a movie.", "watched", ["watch", "watches", "watching"], "Yesterday → past simple : watched."),
  s(2, "Write the past simple", "eat → ___", ["ate"], "Irrégulier : eat → ate."),
  s(2, "Write the past simple", "see → ___", ["saw"], "Irrégulier : see → saw."),
  c(2, "She ___ at home last night.", "was", ["were", "is", "be"], "To be au passé : I/he/she/it was."),
  c(2, "We ___ very happy.", "were", ["was", "are", "been"], "To be au passé : we/you/they were."),
  c(3, "___ you finish your homework?", "Did", ["Do", "Were", "Does"], "Question au past simple : Did + sujet + verbe de base."),
  s(3, "Complete with the negative", "I ___ (not / see) him yesterday.", ["didn't see", "did not see"], "Négation au passé : didn't + verbe de base."),
  s(3, "Write the past simple", "buy → ___", ["bought"], "Irrégulier : buy → bought."),
  o(3, ["We", "went", "to", "the", "beach", "last", "summer."], "Past simple : went (go)."),
  c(4, "When I was little, I ___ afraid of the dark.", "was", ["were", "am", "have been"], "To be au passé avec I : was."),
  s(4, "Write the past simple", "think → ___", ["thought"], "Irrégulier : think → thought."),
  s(4, "Write the past simple", "teach → ___", ["taught"], "Irrégulier : teach → taught."),
  o(4, ["Did", "they", "win", "the", "game?"], "Question au past simple : Did + sujet + verbe de base.", ["won"]),
  c(5, "While I ___ TV, the phone rang.", "was watching", ["watched", "am watching", "watch"], "Action en cours interrompue → past continuous (was watching).", "Grammar"),
  c(5, "___ you ever been to New York?", "Have", ["Did", "Were", "Are"], "Expérience de vie (ever) → present perfect : Have you ever been…?", "Grammar"),
  s(5, "Write the past participle", "write → (I have) ___", ["written"], "Participe passé irrégulier : write – wrote – written."),
  o(5, ["She", "had", "already", "left", "when", "we", "arrived."], "Past perfect (had left) : action terminée avant une autre action passée."),
];

const phrases: QuestionBanque[] = [
  o(1, ["My", "name", "is", "Alex."], "Phrase simple : sujet + verbe + complément."),
  o(1, ["I", "have", "two", "brothers."], "Sujet + verbe + complément."),
  c(1, "How do you answer « How are you? »", "I'm fine, thanks!", ["I'm twelve.", "I'm from Quebec.", "It's Monday."], "How are you? = Comment vas-tu ?", "Conversation"),
  c(1, "What time is it? → 3:30", "It's half past three.", ["It's three and thirty past.", "It's quarter to three.", "It's thirty three."], "Half past three = trois heures et demie.", "Conversation"),
  o(2, ["Where", "do", "you", "live?"], "Question : mot interrogatif + do + sujet + verbe."),
  c(2, "Choose the correct question word: ___ is your birthday? — In May.", "When", ["Where", "Who", "What"], "When = quand (une date).", "Questions"),
  c(2, "Choose the correct question word: ___ is that girl? — She's my cousin.", "Who", ["What", "Which", "Whose"], "Who = qui (une personne).", "Questions"),
  o(2, ["There", "are", "three", "cats", "in", "the", "garden."], "There are + nom pluriel."),
  c(3, "Choose the correct order:", "She has a big red ball.", ["She has a red big ball.", "She has a ball big red.", "She has big a red ball."], "Ordre des adjectifs : taille avant couleur.", "Word order"),
  o(3, ["How", "often", "do", "you", "play", "video", "games?"], "How often = à quelle fréquence."),
  c(3, "Which sentence is correct?", "My friends are coming tonight.", ["My friends is coming tonight.", "My friend are coming tonight.", "My friends coming tonight."], "Sujet pluriel → are.", "Grammar"),
  s(3, "Translate into English", "« Je suis d'accord. »", ["i agree", "i agree."], "Attention : on ne dit pas « I am agree »."),
  o(4, ["Could", "you", "help", "me,", "please?"], "Demande polie avec « Could you… ».", ["can"]),
  c(4, "Choose the polite request:", "Would you mind opening the window?", ["Open the window now.", "You open the window?", "Would you mind open the window?"], "Would you mind + verbe en -ing.", "Conversation"),
  c(4, "Which sentence uses the comparative correctly?", "This book is more interesting than the movie.", ["This book is interestinger than the movie.", "This book is more interesting that the movie.", "This book is most interesting than the movie."], "Adjectif long : more + adjectif + than.", "Grammar"),
  o(4, ["I", "usually", "go", "to", "bed", "at", "ten."], "L'adverbe de fréquence se place avant le verbe."),
  c(5, "Choose the correct sentence:", "If it rains tomorrow, we will stay inside.", ["If it will rain tomorrow, we stay inside.", "If it rains tomorrow, we would stay inside.", "If it rained tomorrow, we will stay inside."], "1er conditionnel : If + present simple, will + verbe.", "Grammar"),
  o(5, ["If", "I", "were", "you,", "I", "would", "study", "more."], "2e conditionnel : If + past, would + verbe (were pour toutes les personnes).", ["was"]),
  c(5, "Choose the correct reported speech: He said, « I am tired. »", "He said that he was tired.", ["He said that I am tired.", "He said that he is tire.", "He said me that he was tired."], "Discours indirect : le temps recule (am → was).", "Grammar"),
  o(5, ["The", "book", "that", "you", "lent", "me", "is", "amazing."], "Proposition relative avec « that »."),
];

export const anglais: Matiere = {
  id: "anglais",
  nom: "Anglais",
  icone: "🇬🇧",
  couleur: "vert",
  slogan: "Irregular verbs, vocabulary, sentences",
  unites: [
    uniteIrreguliers,
    uniteBanque({ id: "vocabulary", titre: "Vocabulary", icone: "🗂️", description: "Words, false friends, idioms" }, vocabulaire),
    uniteBanque({ id: "present", titre: "Present tenses", icone: "⏰", description: "Present simple & continuous" }, present),
    uniteBanque({ id: "past", titre: "Past tenses", icone: "🕰️", description: "Regular & irregular verbs" }, passe),
    uniteBanque({ id: "sentences", titre: "Sentences & questions", icone: "💬", description: "Word order, questions, conversation" }, phrases),
  ],
};
