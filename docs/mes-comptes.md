# Mes comptes — aide-mémoire

> 🔄 **Depuis le 2026-11-25, le site n'utilise plus Supabase, Vercel ni Anthropic** (voir `decisions.md`). Supabase est à supprimer.

> ⚠️ Ce fichier ne contient **aucun mot de passe** et ne doit jamais en contenir.
> Les mots de passe se gardent dans **1Password**, le gestionnaire de mots de passe de la famille.
> Nom conseillé pour chaque entrée : « KidsSchool – Nom de la plateforme ».

## Garde-fous
1. **Aucune carte de crédit** sur GitHub, Supabase et Vercel. Sans carte, aucune facture n'est possible : en cas de dépassement, le service se bloque, il ne facture pas.
2. **IA (Anthropic) : crédits prépayés uniquement**, **sans recharge automatique**. Quand le crédit est épuisé, l'IA s'arrête.
3. **Connexion partout avec le compte GitHub** : un seul identifiant à retenir.
4. Aucun service payant n'est activé sans accord écrit dans `decisions.md`.

## Le site
- Adresse : **https://abrmed.github.io/KidsScool/** (GitHub Pages, gratuit, publié automatiquement à chaque changement).
- Le dépôt GitHub est **public** depuis le 2026-11-25 (aucune donnée des enfants n'y est).

## Les plateformes

| Plateforme | À quoi elle sert | Connexion | Coût | Carte ? | État |
|---|---|---|---|---|---|
| **GitHub** — github.com | Garde le **code** (la « recette ») et la documentation | Compte `abrmed` | 0 $ | Non | ✅ Créé le 2026-11-24 |
| **Supabase** — supabase.com | Garde les **données**, les **comptes** de la famille et les **fichiers** (photos, PDF). Région Canada | « Continue with GitHub » | 0 $ (offre Free) | **Non** | ✅ Créé le 2026-11-24 — projet `kidsschool`, région Canada (ca-central-1) |
| **Vercel** — vercel.com | Met l'application **en ligne** | « Continue with GitHub » | 0 $ (offre Hobby) | **Non** | ⏳ Plus tard (avant publication) |
| **Anthropic** — console.anthropic.com | **IA** : exercices, corrections, résumés | À définir | Prépayé, plafonné (ex. 10 $) | Oui, prépayé seulement | ⏳ Plus tard (phase Exercices), facultatif |

### Accès donnés à Claude
| Accès | Détail | Expire | Pour le retirer |
|---|---|---|---|
| Jeton Supabase « KidsSchool – Claude » | Projet `kidsschool` seulement. Lecture : Project Settings, Advisors. Lecture-écriture : Database, Migrations, Auth Config. Rangé dans l'environnement Claude Code « KidsScool » (Claude ne voit pas sa valeur) | 7 jours après sa création (vers le 2026-12-01) | supabase.com → avatar → Account preferences → **Access Tokens** → **Revoke** |
| Application Claude sur GitHub | Dépôt `KidsScool` seulement | — | github.com → Settings → Applications → Claude → **Configure** / **Uninstall** |

Comptes que tu as déjà et qui seront seulement **connectés** (lecture seule), plus tard :
- **Outlook / Hotmail** : lecture des courriels de l'école (`@<domaine de l’école>`).
- **Comptes Google scolaires des enfants** : Google Classroom, si l'école le permet.

## Comment tout arrêter un jour

| Plateforme | Pour supprimer |
|---|---|
| GitHub | Dépôt KidsScool → **Settings** → tout en bas, **Delete this repository** |
| Supabase | Projet kidsschool → ⚙️ **Project Settings** → **General** → **Delete project** |
| Vercel | Projet → **Settings** → **Advanced** → **Delete Project** |
| Anthropic | Console → **Settings** → supprimer les clés API (le crédit restant n'est pas facturé) |
| Outlook / Google | Retirer l'accès de l'application dans les paramètres de sécurité du compte |
