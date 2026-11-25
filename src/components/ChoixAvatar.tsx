"use client";
import { AVATARS } from "./ui";

export function ChoixAvatar({ valeur, onChange }: { valeur: string; onChange: (a: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 font-semibold">Choisis un avatar</legend>
      <div className="grid grid-cols-8 gap-2">
        {AVATARS.map((a) => (
          <button
            key={a}
            type="button"
            aria-label={`Avatar ${a}`}
            aria-pressed={valeur === a}
            onClick={() => onChange(a)}
            className={`flex aspect-square items-center justify-center rounded-xl text-2xl transition ${valeur === a ? "scale-110 bg-primaire-doux ring-4 ring-primaire" : "bg-fond hover:bg-primaire-doux"}`}
          >
            {a}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
