# Décisions prises

Chaque décision validée par le parent administrateur est notée ici, avec sa date.

| Date | Décision | Raison |
|---|---|---|
| 2026-11-24 | Nom de l'application : **KidsSchool** (au départ « Cap Réussite »). Dépôt GitHub : `abrmed/KidsScool` (privé) | Choix du parent |
| 2026-11-24 | Forme : **application web installable (PWA)**, pas d'application native | Un seul projet pour iPhone, Android et ordinateur. Gratuit, mises à jour instantanées, pas de magasin d'applications |
| 2026-11-24 | Technologies : **Next.js + TypeScript + Tailwind CSS** | Interface et serveur dans un même projet |
| 2026-11-24 | Données, comptes et fichiers : **Supabase, région Canada (Montréal)** | Règles de sécurité au niveau de la base (chaque enfant ne voit que ses données). Données stockées au Canada |
| 2026-11-24 | Hébergement : **Vercel** (offre gratuite au départ) | Simple et gratuit pour un usage familial |
| 2026-11-24 | Tâche de 17 h : **planificateur Supabase (pg_cron)** qui vérifie chaque heure et ne lance le traitement qu'à 17 h, heure America/Toronto | Le cron gratuit de Vercel n'est pas précis à l'heure. Gère automatiquement l'heure d'été et d'hiver |
| 2026-11-24 | IA : **API Claude (Anthropic)**, clés côté serveur uniquement, plafond mensuel | Modèle économique pour les résumés, modèle plus puissant pour les corrections |
| 2026-11-24 | Messagerie du parent : **Outlook / Hotmail**, via **Microsoft Graph** en lecture seule | Fournisseur du parent |
| 2026-11-24 | Ordre des phases : **0 → 1 → 4 (exercices) → 2 → 3 → 5 → 6 → 7** | Avoir une application utile même si l'école bloque Google Classroom |

## Risques connus

- **Google Classroom :** l'accès API demande le compte scolaire de l'enfant. L'administrateur du centre de services peut bloquer les applications externes pour les moins de 18 ans. À tester réellement avant de construire dessus.
  - Solution de secours : résumés « tuteur » de Classroom reçus par courriel, puis analysés.
  - Autre solution : import manuel par photo ou PDF.
- **Coûts estimés :** 10 à 35 $ CA par mois au début (surtout l'IA). 45 à 70 $ CA par mois avec Supabase Pro, recommandé en phase 7 pour les sauvegardes.

## Garde-fous (validés le 2026-11-24)
- Aucune carte de crédit sur GitHub, Supabase et Vercel.
- IA en crédits prépayés seulement, sans recharge automatique.
- Connexion avec GitHub partout où c'est possible.
- Aide-mémoire des plateformes : [mes-comptes.md](mes-comptes.md). Le tenir à jour à chaque nouveau service.

## Changement de cap — 2026-11-25
Le parent trouve le projet trop lourd (trop de connexions et de plateformes). Nouvelle direction, validée :
- **Site web simple, statique, style Duolingo** : anglais, français, mathématiques.
- **Abandonnés** : comptes et connexion, Supabase, Outlook, Google Classroom, synchronisation de 17 h, IA, Vercel.
- **Conservés** : design coloré, règles pédagogiques du cahier des charges (programme du Québec, 2e secondaire, 5 niveaux, exercices originaux), GitHub.
- **Score seulement pour l'enfant** ; corrections réservées aux parents.
- Accès des parents aux corrections : **les deux** méthodes — code parent sur l'appareil + fiche de résultats envoyée par l'enfant.
- Hébergement choisi : **GitHub Pages** (gratuit, sans nouveau compte). ⚠️ Exige un dépôt **public** : l'historique sera nettoyé avant (prénoms, anciennes infos Supabase).
- Limite connue et acceptée : un ado très débrouillard en informatique pourrait trouver les réponses dans le code de la page ou dans le stockage du navigateur.
- 2026-11-25 : **un profil par enfant, protégé par son propre code secret** (4 à 8 chiffres, choisi par un parent). **Un seul code parent** partagé par les deux parents. Chaque enfant joue sur **son propre appareil** (la progression reste sur cet appareil).
