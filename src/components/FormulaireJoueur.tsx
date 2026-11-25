"use client";
import { useState, type ReactNode } from "react";
import { ajouterJoueur, formatCodeValide } from "@/lib/stockage";
import { ChoixAvatar } from "./ChoixAvatar";
import { AVATARS, boutonPrincipal, champ } from "./ui";

/** Ajout d'un joueur (enfant) : prénom, avatar et code secret, choisis par un parent. */
export function FormulaireJoueur({ titre, intro, bouton, apres }: { titre: string; intro: ReactNode; bouton: string; apres?: ReactNode }) {
  const [prenom, setPrenom] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const nom = prenom.trim();
        if (!nom) return setErreur("Écris un prénom ou un surnom.");
        if (!formatCodeValide(code)) return setErreur("Le code de l'enfant doit contenir de 4 à 8 chiffres.");
        await ajouterJoueur(nom, avatar, code);
        setErreur(null);
        setOk(`${nom} est ajouté ✓ Donne-lui son code.`);
        setPrenom("");
        setCode("");
      }}
    >
      <h2 className="text-2xl font-bold">{titre}</h2>
      <p className="text-texte-doux">{intro}</p>
      <label className="font-semibold" htmlFor="prenom">Prénom ou surnom</label>
      <input id="prenom" className={champ} value={prenom} maxLength={20} autoComplete="off" onChange={(e) => setPrenom(e.target.value)} />
      <ChoixAvatar valeur={avatar} onChange={setAvatar} />
      <label className="font-semibold" htmlFor="code-enfant">Code secret de l&apos;enfant (4 à 8 chiffres)</label>
      <input id="code-enfant" className={champ} type="password" inputMode="numeric" autoComplete="new-password" value={code} onChange={(e) => setCode(e.target.value.trim())} />
      <p className="-mt-2 text-sm text-texte-doux">L&apos;enfant le tapera pour ouvrir son profil. Différent du code parent !</p>
      {erreur && <p role="alert" className="rounded-2xl bg-accent-doux px-4 py-3 font-semibold text-accent">{erreur}</p>}
      {ok && <p role="status" className="font-semibold text-succes">{ok}</p>}
      <button type="submit" className={boutonPrincipal}>{bouton}</button>
      {apres}
    </form>
  );
}
