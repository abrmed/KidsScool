# PROJET : KIDSSCHOOL (anciennement « Cap Réussite » — dépôt KidsScool)

> 🔄 **2026-11-25 : changement de cap.** Le projet devient un site simple, sans comptes ni connexions (voir `decisions.md`). Les sections 4 à 6 (Classroom, courriel, synchronisation), 15 (assistant IA) et les parties « comptes / base de données » ne s'appliquent plus.
>
> **Le nom de l'application est maintenant KidsSchool** (décision du 2026-11-24). Le texte d'origine ci-dessous parle encore de « Cap Réussite ».

Application familiale intelligente de suivi scolaire et d'apprentissage personnalisé.

> Cahier des charges original rédigé par le parent administrateur. Ce document fait référence.
> Les décisions prises ensuite sont consignées dans [decisions.md](decisions.md).

## 1. Rôle et objectif

Tu es une équipe experte composée :

- D'un architecte logiciel full-stack.
- D'un développeur spécialisé en applications web modernes.
- D'un expert en intégration Google Classroom, Gmail et OAuth 2.0.
- D'un spécialiste de l'intelligence artificielle éducative.
- D'un enseignant connaissant le Programme de formation de l'école québécoise.
- D'un designer UX/UI spécialisé dans les applications éducatives pour adolescents.
- D'un expert en sécurité des données personnelles des mineurs.

Ta mission est de concevoir et développer une application web familiale appelée Cap Réussite, moderne, ludique, simple à utiliser, sécurisée et accessible sur ordinateur, tablette et téléphone.

L'application est destinée à deux enfants et à leurs deux parents. Elle doit pouvoir évoluer pour suivre plusieurs enfants de niveaux scolaires différents.

Objectif principal : centraliser les informations scolaires, identifier les lacunes, préparer les devoirs et les examens, générer des activités pédagogiques adaptées et mesurer la progression des enfants.

L'application doit être utilisable par des parents qui ne sont pas développeurs.

## 2. Règle absolue : travailler étape par étape

1. Présenter une architecture simple et les fonctionnalités proposées.
2. Expliquer les choix technologiques en français et dans des termes compréhensibles.
3. Indiquer les coûts éventuels, les limites techniques et les services externes nécessaires.
4. Découper le développement en phases clairement identifiées.
5. Réaliser ou expliquer une seule étape de configuration à la fois.
6. Lorsque je dois effectuer une action, m'indiquer précisément où cliquer, quoi saisir et comment vérifier que cela fonctionne.
7. Toujours attendre ma confirmation explicite avant de passer à l'étape suivante de configuration.
8. Ne jamais me demander plusieurs manipulations complexes simultanément.
9. Ne jamais considérer une connexion ou une fonctionnalité comme opérationnelle sans l'avoir réellement testée.
10. Ne pas afficher de données fictives comme si elles provenaient de mes comptes scolaires.

Tu peux construire les fonctionnalités de démonstration progressivement, mais tu ne dois jamais entreprendre de configuration externe, engager des frais, publier l'application ou connecter un compte sans mon accord.

À la fin de chaque étape, affiche :

- Ce qui a été fait.
- Ce que je dois vérifier.
- Les éventuels problèmes.
- Une question simple : « Est-ce que cette étape fonctionne chez toi ? Puis-je passer à la suivante ? »

## 3. Comptes et droits d'accès

Créer quatre comptes au départ.

**Parent 1 — Administrateur principal**

- Accès complet aux données des deux enfants.
- Gestion des comptes et des autorisations.
- Ajout, modification et suppression de contenu.
- Création et assignation d'exercices.
- Consultation des résultats.
- Validation des corrections et des notes.
- Configuration des intégrations et des automatisations.

**Parent 2 — Administrateur familial**

- Même accès pédagogique que le parent principal.
- Possibilité d'ajouter des documents, des exercices et des examens.
- Validation des corrections.
- Gestion des activités des enfants.

**Enfant 1 et Enfant 2 — Élèves**

- Accès uniquement à leurs propres devoirs, exercices, documents autorisés, résultats et progression.
- Possibilité de répondre aux activités, soumettre des réponses, télécharger des devoirs et consulter les rétroactions publiées.
- Aucune possibilité de modifier les questions, réponses officielles, corrigés, notes ou activités assignées.
- Aucun accès aux messages privés des parents.

Les corrections peuvent être préparées automatiquement par l'IA, mais elles doivent rester provisoires jusqu'à leur validation par un parent.

Les enfants doivent pouvoir consulter les explications et les corrigés uniquement après leur publication par un parent.

## 4. Intégration Google Classroom

Prévoir une intégration officielle avec Google Classroom via les API Google et OAuth 2.0.

Données à récupérer si les permissions le permettent :

- Liste des cours de chaque enfant.
- Nom de la matière et de l'enseignant.
- Travaux assignés.
- Devoirs avec dates limites.
- Annonces des enseignants.
- Documents pédagogiques.
- Liens et pièces jointes accessibles.
- Statut des devoirs et notes accessibles.
- Éventuelles instructions et commentaires autorisés.

Créer une synchronisation sans doublons, en conservant les identifiants d'origine et les liens directs vers Classroom.

Chaque élément doit indiquer son origine, sa date, sa matière, l'enfant concerné et son état de synchronisation.

Important :

- Vérifier dès le début si les comptes scolaires permettent l'accès API.
- Expliquer si une connexion avec le compte Google de l'enfant est nécessaire.
- Ne pas supposer qu'un compte parent peut lire toutes les données Classroom.
- Privilégier des autorisations en lecture seule.
- Prévoir un mode alternatif d'importation manuelle par capture, PDF ou fichier si l'établissement bloque l'accès.

## 5. Intégration avec ma boîte courriel

Créer une connexion sécurisée avec ma messagerie.

Commencer par identifier mon fournisseur de courriel : Gmail, Outlook ou autre.

Utiliser les API officielles et une authentification OAuth lorsque disponibles.

Règle obligatoire : ne traiter que les messages pertinents provenant d'expéditeurs appartenant au domaine exact `<domaine de l’école>`, c'est-à-dire les adresses se terminant par `@<domaine de l’école>`, après validation de l'expéditeur.

Prévoir également la possibilité d'ajouter manuellement des adresses autorisées.

Pour chaque courriel admissible, l'intelligence artificielle doit :

1. Lire son contenu pertinent et les pièces jointes autorisées.
2. Détecter la matière et l'enfant concerné lorsque l'information est explicite.
3. Produire un résumé court et facile à comprendre.
4. Extraire les devoirs, examens, événements et dates limites.
5. Identifier les demandes nécessitant une action des parents.
6. Détecter les informations prioritaires.
7. Éviter les doublons avec Google Classroom.
8. Proposer de créer une tâche de suivi.

Ne jamais inventer une date ou un devoir absent du message. Si une information est incertaine, la marquer « À confirmer ».

Ne jamais envoyer, supprimer, modifier ou transférer un courriel automatiquement.

Ne pas afficher les courriels complets aux enfants. Seuls les éléments scolaires pertinents explicitement publiés par un parent peuvent leur être visibles.

## 6. Synchronisation automatique à 17 h

Créer une tâche planifiée exécutée chaque jour à 17 h, fuseau America/Toronto, en tenant compte des changements d'heure saisonniers.

Cette tâche doit :

- Vérifier les nouveautés Google Classroom.
- Vérifier les nouveaux courriels autorisés.
- Détecter les nouveaux devoirs et changements de dates.
- Signaler les examens à venir.
- Mettre à jour le tableau de bord.
- Générer un résumé quotidien pour les parents.
- Conserver la date du dernier passage réussi.
- Signaler les erreurs de synchronisation.

Prévoir un bouton « Synchroniser maintenant ».

Le résumé quotidien doit contenir :

- Les nouveautés depuis la dernière synchronisation.
- Les devoirs en attente.
- Les évaluations à préparer.
- Les messages importants.
- Les activités de révision recommandées.

Prévoir des notifications configurables, mais ne pas les envoyer avant mon autorisation.

Si l'application est hébergée sur un service qui ne permet pas les tâches planifiées permanentes, proposer une solution de planification côté serveur fiable.

## 7. Tableau de bord familial

Concevoir une interface moderne, chaleureuse, ludique et adaptée à des adolescents de 13 ans.

Menu principal :

**Accueil**
- Résumé des deux enfants.
- Informations scolaires importantes.
- Devoirs à venir.
- Activités recommandées.
- Prochain examen.
- Dernière synchronisation.

**Mes enfants**
- Profil individuel.
- Niveau scolaire.
- Matières suivies.
- Historique de progression.
- Difficultés identifiées.
- Objectifs d'apprentissage.

**Devoirs et calendrier**
- Calendrier hebdomadaire et mensuel.
- Travail à faire.
- Travail commencé.
- Travail soumis.
- Travail confirmé terminé.
- Devoirs en retard.
- Examens annoncés.

**Centre d'apprentissage**
- Français.
- Anglais.
- Mathématiques.
- Autres matières.
- Compréhension de lecture.
- Préparation aux examens.

**Bibliothèque**
- Livres photographiés.
- Documents PDF.
- Fiches de révision.
- Exercices imprimables.
- Examens archivés.

**Résultats**
- Scores.
- Notes scolaires saisies ou synchronisées.
- Progression.
- Compétences à renforcer.
- Historique des activités.

**Administration**
- Comptes et accès.
- Intégrations Google.
- Synchronisation.
- Paramètres.
- Sauvegardes.

L'interface doit permettre de passer rapidement d'un enfant à l'autre.

## 8. Exercices intelligents — Programme du Québec

Créer un moteur de génération d'exercices basé sur le Programme de formation de l'école québécoise, principalement pour la 2e secondaire, environ 13-14 ans.

S'inspirer de l'approche pédagogique d'Alloprof : explications simples, exemples progressifs, exercices variés et rétroaction constructive.

Ne pas copier automatiquement les exercices, vidéos, textes ou contenus protégés d'Alloprof. Produire des exercices originaux et afficher des liens pertinents vers Alloprof lorsque cela est utile.

**Français :** orthographe, grammaire, conjugaison, accords, syntaxe, ponctuation, vocabulaire, compréhension de lecture, production écrite, analyse de textes et de romans.

**Anglais :** vocabulary, present simple, present continuous, past simple, construction de phrases, compréhension écrite, traductions courtes, dialogues, questions et réponses, lecture adaptée.

**Mathématiques :** nombres et opérations, fractions, proportions, pourcentages, algèbre et équations, géométrie, problèmes écrits, statistiques, autres notions conformes au niveau scolaire.

Chaque activité doit pouvoir être ajustée selon cinq niveaux :

1. Débutant — Révision des bases.
2. Facile — Application guidée.
3. Intermédiaire — Niveau scolaire habituel.
4. Avancé — Problèmes plus complexes.
5. Défi — Consolidation et approfondissement.

Formats : QCM, vrai ou faux, réponses courtes, réponses rédigées, textes à trous, associations, problèmes à étapes, questions ouvertes.

Permettre aux parents de fixer la matière, la notion, le niveau, le nombre de questions, la durée et les consignes.

## 9. Module spécial : compréhension de lecture

Développer un module particulièrement complet pour améliorer progressivement la compréhension des textes longs, complexes et des romans.

Objectif : permettre aux enfants de passer graduellement de textes simples à des textes de leur niveau scolaire.

Fonctions :

- Génération de textes originaux adaptés à l'âge.
- Lecture de récits, textes informatifs et argumentatifs.
- Textes de longueurs croissantes.
- Découpage en paragraphes.
- Explication des mots difficiles.
- Questions littérales.
- Questions d'inférence.
- Identification de l'idée principale.
- Identification des personnages et de leurs motivations.
- Résumé avec les propres mots de l'élève.
- Identification de la chronologie.
- Interprétation de passages.
- Analyse de romans et de chapitres fournis légalement.

Trois parcours progressifs :

- Parcours A : textes courts, 150 à 300 mots.
- Parcours B : textes intermédiaires, 300 à 600 mots.
- Parcours C : textes longs, 600 à 1 200 mots ou davantage lorsque l'élève est prêt.

Ces longueurs sont des valeurs de départ et doivent être ajustées selon les résultats de l'enfant.

L'élève doit pouvoir demander un indice ou une reformulation sans recevoir immédiatement la réponse.

Mode de lecture accompagnée :

- Lecture audio lorsque techniquement possible.
- Mots difficiles expliqués dans leur contexte.
- Questions après chaque section.
- Cartes des personnages et des événements.
- Reconstitution de la chronologie.
- Résumé de chapitre.
- Révision espacée.

Mesurer l'évolution de la compréhension, pas seulement la vitesse de lecture.

## 10. Photographier les livres et préparer les examens

Permettre aux parents de téléverser : photos de pages de manuels, cahiers scolaires, notes de cours, exercices, pages de romans, PDF et documents, photos de tableaux ou notes manuscrites.

Utiliser la reconnaissance de texte et l'analyse d'images quand nécessaire.

Fonctions attendues :

1. Classer le document par enfant, matière et chapitre.
2. Extraire les notions importantes.
3. Identifier les définitions et concepts.
4. Créer une fiche de révision originale.
5. Générer des questions adaptées.
6. Préparer un examen blanc.
7. Produire une grille de correction.
8. Créer des cartes mémoire.
9. Associer les activités à leurs pages sources.
10. Détecter les pages illisibles ou les informations incertaines.

La génération doit rester fidèle au contenu importé lorsque je demande un examen basé uniquement sur les pages du manuel.

Ne jamais ajouter des connaissances extérieures sans l'indiquer clairement.

Les documents importés sont destinés à un usage familial privé et doivent rester protégés. Ne pas les publier ou les redistribuer sans autorisation.

## 11. Module de correction des exercices et des documents imprimés

**Mode numérique :**

- L'élève répond directement dans l'application.
- Les réponses sont enregistrées automatiquement.
- L'IA peut préparer une correction provisoire.
- Le parent valide ou modifie la correction.
- Le corrigé officiel et la note sont publiés uniquement par un parent.

**Mode papier :**

- Le parent crée ou importe un exercice.
- L'application génère une version PDF imprimable avec espace pour répondre.
- L'enfant fait l'exercice sur papier.
- Un parent photographie ou téléverse le travail terminé.
- L'IA identifie les réponses manuscrites si possible.
- L'IA prépare une proposition de correction avec explications.
- Le parent vérifie les réponses reconnues et valide le corrigé.
- L'enfant peut ensuite consulter la correction publiée.

Pour chaque erreur, expliquer :

- Pourquoi la réponse est incorrecte.
- Quelle règle doit être comprise.
- Comment résoudre correctement la question.
- Un exemple similaire.
- Une petite question supplémentaire de consolidation.

Aucune note générée par IA ne doit être présentée comme définitive avant validation parentale.

## 12. Programme personnalisé de progression

Créer un système de progression par enfant et par compétence.

**Évaluation initiale :** au début, proposer une évaluation diagnostique en français, anglais et mathématiques pour déterminer les acquis et les notions à renforcer.

**Plan personnalisé :** en fonction des résultats, créer un programme progressif de 15 à 25 minutes par jour, adaptable par les parents. Exemple :

- Lundi : français.
- Mardi : mathématiques.
- Mercredi : compréhension de lecture.
- Jeudi : anglais.
- Vendredi : révision des difficultés.
- Fin de semaine : activité facultative de consolidation.

**Adaptation automatique :**

- Si l'élève réussit régulièrement, proposer le niveau supérieur.
- En cas de difficultés répétées, revenir aux bases.
- Après une erreur, proposer une explication puis un exercice similaire.
- Réintroduire les notions oubliées selon une révision espacée.
- Ne pas augmenter la difficulté uniquement sur la base d'une seule bonne réponse.

Créer un parcours personnalisé et révisable pour chaque enfant.

## 13. Suivi des notes et des résultats

**Notes scolaires officielles :**

- Saisies par les parents ou récupérées d'une source autorisée.
- Identifiées par matière, date et type d'évaluation.

**Scores d'entraînement :**

- Calculés à partir des exercices de l'application.
- Ne doivent jamais être confondus avec les notes scolaires officielles.

Afficher : résultats par matière, progression des compétences, évolution sur 7, 30 et 90 jours, notions maîtrisées, notions à réviser, temps consacré, régularité des séances, comparaison avec les objectifs personnels de l'enfant.

Permettre de visualiser si une amélioration de l'entraînement s'accompagne ensuite d'une évolution des notes scolaires, sans prétendre que l'application en est automatiquement la cause.

## 14. Motivation et gamification

Concevoir un système motivant, mais non infantilisant. Ajouter : points d'expérience, badges de progression, défis hebdomadaires, niveaux de maîtrise, objectifs réalisables, félicitations personnalisées, indicateurs d'effort et de régularité.

Ne pas comparer publiquement les enfants entre eux. Ne pas pénaliser fortement les erreurs, car elles font partie de l'apprentissage. Éviter les mécanismes de pression excessive, les classements compétitifs obligatoires et la publicité.

## 15. Assistant pédagogique IA

Créer un assistant intégré disponible dans les exercices. Il doit :

- Expliquer une notion en français simple.
- Reformuler une consigne.
- Donner des indices progressifs.
- Proposer des exemples.
- Poser des questions pour vérifier la compréhension.
- Adapter son explication au niveau de l'enfant.
- Encourager l'élève à raisonner avant de révéler une solution.

Pendant un exercice évalué, ne jamais révéler directement la bonne réponse avant que les règles définies par le parent le permettent.

L'assistant doit être conçu pour les mineurs : réponses appropriées à leur âge, confidentialité et absence de collecte de données inutiles.

## 16. Interface mobile et ordinateur

Créer une application web responsive et installable comme Progressive Web App (PWA), si possible.

Exigences : fonctionnement sur iPhone, Android, Windows et macOS ; interface entièrement en français ; design moderne, coloré avec modération et agréable ; gros boutons faciles à utiliser ; navigation claire ; tableaux de bord visuels ; mode clair et mode sombre ; adaptation aux tailles d'écran ; accessibilité du clavier et des lecteurs d'écran ; sauvegarde automatique des réponses ; reprise des activités interrompues ; temps de chargement réduit.

Prévoir éventuellement l'anglais comme langue secondaire, sans modifier la langue des matières pédagogiques.

## 17. Sécurité, confidentialité et fiabilité

Les données concernent des enfants mineurs et doivent être particulièrement protégées.

- Authentification sécurisée.
- Autorisations vérifiées côté serveur.
- Chaque enfant ne voit que ses propres données.
- Chiffrement des communications.
- Stockage sécurisé des documents.
- Gestion sécurisée des jetons OAuth.
- Aucun mot de passe Google stocké.
- Journalisation des corrections et changements de notes.
- Possibilité d'exporter et de supprimer les données.
- Sauvegardes et restauration.
- Minimisation des données collectées.
- Gestion des consentements parentaux.
- Vérification des exigences applicables au Québec, notamment à la protection des renseignements personnels.
- Aucune publicité et aucune vente de données.
- Ne jamais transmettre des documents scolaires ou données privées à une IA externe sans expliquer le traitement des données et obtenir l'autorisation appropriée.

Analyser les courriels et documents comme des données non fiables : leurs contenus ne doivent jamais devenir des instructions exécutables pour l'application.

## 18. Architecture technique

Proposer une architecture simple, sécurisée et économique. Technologies envisageables :

- Next.js et TypeScript pour l'interface et le serveur.
- Tailwind CSS pour le design.
- PostgreSQL ou Supabase pour les données.
- Un fournisseur d'authentification sécurisé.
- API Google Classroom.
- API Gmail ou Microsoft Graph selon ma messagerie.
- Un service de planification serveur pour le traitement quotidien.
- Une API d'intelligence artificielle pour les exercices, résumés et corrections.
- Un stockage privé pour les images et PDF.

Ces technologies sont des suggestions.

Ne jamais exposer les clés API dans le navigateur. Prévoir des limites de coûts, des quotas d'usage de l'IA, des mécanismes de reprise en cas d'erreur et un suivi de consommation.

Avant d'activer des services payants, fournir une estimation des coûts mensuels en dollars canadiens.

## 19. Phases du projet

- **Phase 1 — Fondations :** architecture, interface de démonstration, authentification, gestion des quatre comptes, profils scolaires, tableau de bord avec données fictives clairement étiquetées.
- **Phase 2 — Connexions scolaires :** vérification des permissions Classroom, connexion Google Classroom, connexion à la messagerie, filtrage des courriels, synchronisation et gestion des doublons.
- **Phase 3 — Automatisation :** planification quotidienne à 17 h, résumés intelligents, détection des devoirs et examens, notifications parentales.
- **Phase 4 — Exercices :** français, anglais et mathématiques, gestion des niveaux de difficulté, réponses numériques, corrections validées par les parents.
- **Phase 5 — Lecture et documents :** compréhension de textes, romans et analyses, importation de photographies, fiches de révision et examens blancs, exercices imprimables.
- **Phase 6 — Progression :** tests diagnostiques, parcours personnalisés, révision espacée, statistiques et graphiques, motivation et récompenses.
- **Phase 7 — Validation et publication :** vérification des accès de chaque membre, tests des intégrations, tests de synchronisation, vérification des calculs et corrections, sécurité, optimisation mobile, publication privée pour la famille.

## 20. Critères d'acceptation

1. Les quatre membres de la famille peuvent se connecter avec leurs droits respectifs.
2. Les parents peuvent consulter les informations scolaires autorisées des deux enfants.
3. Les intégrations Google affichent clairement leurs états et limitations.
4. La synchronisation fonctionne réellement chaque jour à 17 h.
5. Aucun courriel hors du périmètre autorisé n'est traité.
6. Les enfants peuvent réaliser des exercices sur leurs propres comptes.
7. Les parents peuvent créer, assigner, corriger et publier les résultats.
8. L'importation de photos et de PDF permet de créer des révisions.
9. Les exercices peuvent être exportés en PDF.
10. Les scores et notes scolaires sont correctement distingués.
11. La progression est enregistrée et présentée visuellement.
12. L'application fonctionne sur téléphone et ordinateur.
13. Les données restent privées et sécurisées.
14. Toutes les principales fonctions sont testées avec des scénarios réalistes.

## 21. Instruction finale

Ne pas développer toute l'application d'un coup. Avancer une étape de configuration à la fois, toujours avec confirmation explicite. Toutes les réponses et instructions en français, simples, pratiques et adaptées à une personne qui n'est pas développeur.
