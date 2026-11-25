# Journal des étapes

## Phase 0 — Préparation

### Étape 1 : dépôt GitHub — ✅ 2026-11-24
- Compte GitHub créé, dépôt privé `abrmed/KidsScool` créé.
- Claude relié au dépôt. Testé : récupération du dépôt et premier envoi de fichiers.
- Ajout du cahier des charges, des décisions et du fichier CLAUDE.md.

### Étape 2 : squelette de l'application — ✅ 2026-11-24
- Next.js 16 + React 19 + TypeScript + Tailwind CSS 4. Aucune vulnérabilité connue (`npm audit`).
- Page d'accueil temporaire en français, marquée « Version de démonstration ».
- Mode clair et sombre automatiques. Fiche d'installation PWA (`manifest`) et icône.
- Application non indexée par les moteurs de recherche.
- Testé : `npm run lint` OK, `npm run build` OK, affichage vérifié sur ordinateur et iPhone (clair et sombre).
- Pas encore en ligne : rien n'est publié.

### Garde-fous et nom — ✅ 2026-11-24
- Aide-mémoire `docs/mes-comptes.md` (sans mot de passe). Mots de passe rangés dans 1Password.
- L'application s'appelle maintenant **KidsSchool**.

## Phase 1 — Fondations

### Étape 1 : projet Supabase — ✅ 2026-11-24
- Organisation « Famille » (offre Free, sans carte), projet `kidsschool`, région `ca-central-1` (Canada).
- Réglages : Data API activée, accès automatique aux nouvelles tables **désactivé**, RLS automatique **activé**.
- Environnement Claude Code « KidsScool » créé : accès réseau à l'adresse du projet Supabase seulement.
- Testé : le projet répond (refuse poliment les requêtes sans clé, comme prévu).

### Étape 2 : application reliée à Supabase — ✅ 2026-11-24
- Clé publique (`sb_publishable_…`) ajoutée dans `src/lib/supabase/config.ts` (non secrète).
- Bibliothèques `@supabase/supabase-js` et `@supabase/ssr` installées, 0 vulnérabilité.
- Encadré « État des services » sur l'accueil, qui vérifie réellement la connexion à chaque affichage.
- Testé : « Connexion à Supabase : OK ».
- ⚠️ Constaté : l'inscription publique est **ouverte** dans Supabase (n'importe qui pourrait créer un compte). Aucune donnée n'existe encore, mais il faut la fermer avant d'aller plus loin.

### Étape 3 : inscription publique fermée — ✅ 2026-11-24
- Supabase → Authentication → Sign In / Providers → « Allow new users to sign up » désactivé.
- Testé de l'extérieur : réglage `disable_signup: true`, et une tentative d'inscription est refusée (« Signups not allowed for this instance »).
- Les comptes de la famille seront créés uniquement par le parent administrateur.

### Étape 4a : accès sécurisé de Claude à Supabase — ✅ 2026-11-24
- Jeton d'accès limité au projet `kidsschool` (5 permissions, expire après 7 jours), enregistré dans l'environnement « KidsScool » via la fenêtre sécurisée.
- Un premier jeton collé par erreur dans le chat : révocation demandée au parent, jamais utilisé.
- Testé : lecture du projet (statut ACTIVE_HEALTHY, région ca-central-1, PostgreSQL 17) et requête SQL inoffensive OK.

### Étape 4b : tables famille et profils, règles de sécurité — ✅ 2026-11-24
- Migration `familles_profils` : tables `familles` et `profils` (prénom, rôle, niveau scolaire, sans autre donnée personnelle).
- Rôles : `parent_admin` (parent principal), `parent` (parent familial), `enfant`.
- Règles (RLS) : un enfant ne voit que lui-même ; un parent voit sa famille ; seul le parent principal change un rôle ; aucun accès sans connexion ; droits d'accès donnés table par table.
- Migration `proteger_rls_auto_enable` : correction d'une alerte du conseiller sécurité de Supabase.
- Testé (`supabase/tests/securite_familles_profils.sql`) : **13 tests sur 13 réussis**, données DÉMO annulées (0 famille, 0 profil, 0 compte restant).
- Conseiller sécurité Supabase : **0 alerte**. La RLS automatique sur les nouvelles tables fonctionne toujours.

### Étape 5 : comptes de la famille — 🔄 en cours
- Choix : parents = courriel + mot de passe ; enfants = identifiant simple + mot de passe (sans courriel réel).
- Les prénoms ne sont enregistrés que dans Supabase, jamais dans GitHub. Les mots de passe sont tapés par le parent dans Supabase et rangés dans 1Password.
- 5a ✅ Compte du parent principal créé par le parent (confirmé, avec mot de passe). Famille et profil `parent_admin` créés et reliés. Vérifié : en simulant sa connexion, il voit son profil, son rôle et sa famille.
- 5b ✅ Compte Enfant 1 créé par le parent avec l'adresse technique `identifiant@<domaine>.kidsschool.invalid` (valeur dans `DOMAINE_IDENTIFIANTS`) (domaine réservé qui ne peut recevoir aucun courriel). Supabase l'accepte. Profil `enfant` (2e secondaire) relié.
  - Vérifié : en simulant sa connexion, Enfant 1 ne voit que son propre profil. Une connexion avec un mauvais mot de passe est refusée normalement (« Invalid login credentials »), ce qui prouve que l'adresse technique fonctionne pour se connecter.
- 5c ⏸️ Comptes Enfant 2 et Parent 2 : reportés à la demande du parent. On teste d'abord avec Parent 1 + Enfant 1. Même procédure que 5b le moment venu.

### Étape 6 : page de connexion et accueil selon le rôle — ✅ 2026-11-24
- Page « Se connecter » : identifiant (enfant) ou courriel (parent) + mot de passe, bouton « Afficher », message d'erreur unique qui ne révèle pas si un compte existe.
- Le domaine technique des enfants est dans la variable `DOMAINE_IDENTIFIANTS` (fichier `.env.local`, non enregistré dans GitHub). Modèle : `.env.example`.
- Protection (`src/proxy.ts`) : sans connexion, toute page renvoie vers « Se connecter ».
- Accueil parent : famille, membres, « Bientôt disponible », état des services. Accueil élève : son espace seulement.
- Bouton « Se déconnecter ».
- Testé de bout en bout dans un vrai navigateur avec 2 comptes DÉMO temporaires (`tests/connexion.e2e.cjs`) : **9 tests sur 9 réussis**. Les comptes DÉMO ont ensuite été supprimés (il reste 2 comptes, 2 profils, 1 famille : les vrais).

### Étape 6b : nouveau design coloré et ludique — ✅ 2026-11-24
- Demande du parent : l'ancien visuel faisait trop « formulaire d'assurance ».
- Polices rondes (Fredoka pour les titres, Nunito pour le texte), installées dans le projet (aucun appel à Google).
- Page de connexion en dégradé violet-rose, avec des emojis qui flottent et un bouton « C'est parti ! 🚀 ».
- Espace élève : bannière « Salut … ! » avec niveau et série (à 0 pour l'instant), et 4 grandes tuiles colorées (devoirs, entraînement, lecture, badges).
- Espace parent : bannière, cartes de la famille avec avatars colorés, 4 tuiles d'outils, état des services.
- Animations douces, désactivées si l'appareil demande moins d'animations. Mode sombre vérifié.
- Tests de connexion relancés : 9/9. Comptes DÉMO supprimés ensuite.
- Prénoms réels retirés du code (exemple d'identifiant : « alex »).

### (abandonné) phase 1, étape 7 — mettre l'application en ligne (Vercel, gratuit, sans carte) — ⏳ en attente de confirmation


---

## Nouveau départ — site simple style Duolingo (2026-11-25)

### Étape A : construction du site statique — ✅ 2026-11-25
- Retiré : connexion, Supabase, proxy, tests liés aux comptes.
- Écran d'entrée : première fois, un parent crée le **code parent** et ajoute un **joueur** (prénom + avatar, gardés sur l'appareil). Ensuite : « Qui joue ? ».
- Accueil élève : niveau, points, série de jours, 3 matières avec étoiles.
- Chemin par matière (style Duolingo) : unités, 5 niveaux à débloquer, 0 à 3 étoiles, couronne 👑.
- Leçon : 8 questions (choix, réponse à taper, mots à remettre dans l'ordre). Aucune indication juste/faux. À la fin : score, étoiles, points, message d'encouragement.
- Fiche de résultats : « Envoyer ma fiche à un parent » (partage du téléphone ou courriel) et « Copier le lien ».
- Espace parents (code) : résultats détaillés par enfant (réponse donnée, bonne réponse, explication), import de fiche, gestion des joueurs, changement de code, effacement.
- Contenu : maths 5 unités générées (opérations, fractions, proportions, équations, géométrie) ; français 4 unités (homophones, conjugaison, accords, vocabulaire) ; anglais 4 unités (vocabulary, present, past, sentences) ; 80 questions écrites par matière.
- Testé : `npm run verifier` → 104 000 questions tirées, 0 problème ; `tests/parcours.e2e.cjs` → 11/11 dans un vrai navigateur (dont « l'élève ne voit aucune correction » et « fiche ouverte sur un autre appareil »).

### Étape B : code secret par enfant — ✅ 2026-11-25
- À l'ajout d'un joueur, le parent choisit son code secret. « Qui joue ? » → l'enfant tape son code.
- Espace parents → Joueurs : « Changer son code ».
- Testé : 13/13 (dont mauvais code enfant refusé, bon code accepté).

### Étape C : mise en ligne sur GitHub Pages — ✅ 2026-11-25
- Historique du dépôt remplacé par une seule version propre (sans prénoms, sans infos Supabase, sans domaine d'école).
- Publication automatique : `.github/workflows/pages.yml` (vérification des questions, construction avec `NEXT_PUBLIC_BASE_PATH=/KidsScool`, déploiement).
- Testé dans le sous-dossier `/KidsScool/` : 13/13.
- Le parent a rendu le dépôt public, puis activé Pages (Source : GitHub Actions).
- ✅ En ligne : **https://abrmed.github.io/KidsScool/**. Testé sur le vrai site : 13/13 (`SITE_URL=https://abrmed.github.io/KidsScool node tests/parcours.e2e.cjs`).

### Étape D : lecture et roman en français — ✅ 2026-11-25
- Demande du parent : la compréhension de texte et les romans sont le point faible des enfants.
- Nouvelle unité « Compréhension de texte » : 5 textes originaux de plus en plus longs (≈220 → ≈720 mots) : récit, texte informatif, récit, texte argumentatif, récit long.
- Nouvelle unité « Roman : Le secret du phare » : mini-roman original en 5 chapitres (un par niveau, ≈320 → ≈650 mots).
- 10 questions par texte (8 tirées par leçon) : repérage, inférence, vocabulaire en contexte, personnages et motivations, chronologie (événements à remettre dans l'ordre), figures de style, idée principale, thème, type de texte.
- Le texte reste affiché pendant les questions (paragraphes numérotés, bouton Relire/Réduire). Les parents voient aussi le texte dans la correction.
- Testé : 120 000 questions tirées, 0 problème ; navigateur 14/14.

### Étape E : réponses rédigées, dictée, commentaires, codes — ✅ 2026-11-25
- Chaque texte et chaque chapitre a 2 questions à réponse rédigée (toujours incluses dans la leçon), avec idées attendues, commentaires et réponse modèle (`src/contenu/redactions.ts`).
- Nouvelle unité « Dictée » : 30 phrases originales sur 5 niveaux, 5 phrases par leçon, lues par la voix de l'appareil (normale ou lente) ou par un parent (avec son code). Correction mot à mot : accents, accords, mots manquants ou en trop, majuscule, point, conseils par mot difficile.
- Espace parents : réponse modèle, commentaires, note ajustable (0, ½, 1), mot du parent, « Montrer à l'enfant » (sur l'appareil) ou « Envoyer à l'enfant (lien) ».
- Côté enfant : bandeau « nouveau message », page « Messages de mes parents » (réponses écrites et dictées seulement), « Changer mon code secret ».
- Limite connue : la correction automatique des réponses rédigées repère des mots-clés ; elle peut être trop sévère ou trop généreuse. Le parent ajuste la note avant de montrer.
- Testé : 125 000 questions + 8 cas de correction, 0 problème ; navigateur 24/24.

### Prochaines étapes — ⏳ en attente de confirmation
1. Fermer les anciens services : supprimer le projet Supabase (il contient encore 2 comptes), révoquer le jeton.
2. (fait) Mise en ligne sur GitHub Pages.
3. Alléger les documents publics (retirer le contexte familial), si le parent est d'accord.
