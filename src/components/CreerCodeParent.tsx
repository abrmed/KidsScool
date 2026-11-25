"use client";
import { useState } from "react";
import { definirCodeParent } from "@/lib/stockage";
import { boutonPrincipal, champ } from "./ui";

/** Formulaire de création du code parent (première utilisation sur un appareil). */
export function CreerCodeParent({ onFait }: { onFait?: () => void }) {
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!/^\d{4,8}$/.test(code)) return setErreur("Le code doit contenir de 4 à 8 chiffres.");
        if (code !== confirmation) return setErreur("Les deux codes ne sont pas identiques.");
        await definirCodeParent(code);
        setErreur(null);
        onFait?.();
      }}
    >
      <h2 className="text-2xl font-bold">👋 Bienvenue ! Réservé à un parent</h2>
      <p className="text-texte-doux">
        Choisis un <strong>code parent</strong> (4 à 8 chiffres). Il protège l&apos;Espace parents, où se trouvent les corrections.
        Ne le donne pas aux enfants. Utilise le même code sur tous les appareils de la famille, c&apos;est plus simple.
      </p>
      <label className="font-semibold" htmlFor="code">Code parent</label>
      <input id="code" className={champ} type="password" inputMode="numeric" autoComplete="new-password" value={code} onChange={(e) => setCode(e.target.value.trim())} />
      <label className="font-semibold" htmlFor="code2">Confirme le code</label>
      <input id="code2" className={champ} type="password" inputMode="numeric" autoComplete="new-password" value={confirmation} onChange={(e) => setConfirmation(e.target.value.trim())} />
      {erreur && <p role="alert" className="rounded-2xl bg-accent-doux px-4 py-3 font-semibold text-accent">{erreur}</p>}
      <button type="submit" className={boutonPrincipal}>Enregistrer le code 🔒</button>
    </form>
  );
}
