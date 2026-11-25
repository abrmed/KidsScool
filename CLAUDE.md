# KidsSchool (dépôt GitHub : KidsScool)

Site web familial **simple et statique**, style Duolingo : anglais, français et mathématiques pour la 2e secondaire (Québec).
Depuis le 2026-11-25 : **aucun compte, aucune base de données, aucune connexion** (ni Supabase, ni courriel, ni Classroom, ni IA).

## À lire au début de chaque session
- `docs/decisions.md` : choix validés (dont le changement de cap du 2026-11-25). Ne pas les remettre en question sans raison.
- `docs/journal.md` : où en est le projet. Le mettre à jour à la fin de chaque étape.
- `docs/mes-comptes.md` : aide-mémoire des plateformes (sans aucun mot de passe).
- `docs/cahier-des-charges.md` : cahier des charges d'origine. Les parties « comptes, Classroom, courriel, synchronisation, IA » sont abandonnées ; les règles pédagogiques restent valables.

## Façon de travailler avec le parent (non-développeur)
- Toujours répondre en **français**, simplement, en tutoyant.
- **Une seule étape de configuration à la fois.** Attendre sa confirmation explicite avant la suivante.
- Pour toute action de sa part : dire précisément où cliquer, quoi saisir et comment vérifier.
- Ne jamais déclarer une fonction opérationnelle sans l'avoir réellement testée.
- Jamais de configuration externe, de frais, de publication ou de connexion de compte sans son accord.
- Les données fictives doivent toujours être clairement marquées « DÉMO ».
- Terminer chaque étape par : ce qui a été fait, ce qu'il doit vérifier, les problèmes éventuels, et la question « Est-ce que cette étape fonctionne chez toi ? Puis-je passer à la suivante ? »

## Règles du produit
- Pendant et à la fin d'une leçon, l'enfant voit **seulement son score** (et étoiles, points) : **jamais** si une réponse est juste ou fausse.
- Réponses rédigées et dictée : commentaires automatiques (idées attendues, explication des fautes). Le **parent** les lit d'abord, peut ajuster la note (0, ½, 1) et ajouter un mot, puis les **montre à l'enfant** (« Messages de mes parents »), sur l'appareil ou par lien `…/messages/#retour=…`. Les réponses des **choix multiples ne sont jamais montrées** à l'enfant.
- Les corrections détaillées sont dans l'**Espace parents**, protégé par un code parent (empreinte SHA-256 salée, stockée sur l'appareil).
- Chaque enfant a son **profil** et son **code secret** (choisi par un parent, réinitialisable dans l'Espace parents). Les parents partagent **un seul code parent**.
- Appareil d'un enfant : le parent envoie un **lien d'installation** (`…/#installer=…`, Espace parents → Joueurs) qui installe le profil et le code parent ; l'enfant ne voit jamais l'écran de création du code parent.
- Deux moyens pour les parents : consulter l'appareil de l'enfant, ou ouvrir la **fiche de résultats** (lien `…/parents/#fiche=…` compressé, envoyé par l'enfant).
- Exercices **originaux** (pas de copie d'Alloprof). 5 niveaux : Débutant, Facile, Intermédiaire, Avancé, Défi.
- Ne jamais écrire les prénoms réels de la famille dans le dépôt : ils ne vivent que dans le navigateur de chaque appareil.

## Technique
- Next.js 16 en export statique (`output: "export"`, dossier `out/`), Tailwind 4, polices Fredoka/Nunito installées localement.
- Données : `localStorage` (`src/lib/stockage.ts`), toujours protégé par try/catch.
- Contenu : `src/contenu/` (maths générées, français et anglais en banques). Après toute modification : `npm run verifier` (doit afficher 0 problème).
- Test navigateur : `npm run build`, servir `out/` sur le port 3200, puis `node tests/parcours.e2e.cjs <dossier-captures>` (31 vérifications).
- En ligne (GitHub Pages) : construire avec `NEXT_PUBLIC_BASE_PATH=/KidsScool`.
