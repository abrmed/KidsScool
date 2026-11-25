import type { Texte } from "@/contenu/types";

/** Texte de lecture affiché pendant les questions (paragraphes numérotés). */
export function BlocTexte({ texte, ouvert = true }: { texte: Texte; ouvert?: boolean }) {
  return (
    <details open={ouvert} className="group rounded-3xl bg-surface shadow-sm ring-2 ring-emerald-200 dark:ring-emerald-900">
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4">
        <span aria-hidden className="text-3xl">📖</span>
        <span className="flex-1">
          <span className="block font-titre text-xl font-semibold leading-tight">{texte.titre}</span>
          <span className="block text-sm font-semibold text-texte-doux">{texte.genre}</span>
        </span>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
          <span className="group-open:hidden">Relire</span>
          <span className="hidden group-open:inline">Réduire</span>
        </span>
      </summary>
      <div className="max-h-[45vh] overflow-y-auto border-t border-bordure px-4 pb-4 pt-3 sm:max-h-[55vh]" tabIndex={0} aria-label={`Texte : ${texte.titre}`}>
        {texte.paragraphes.map((p, i) => (
          <p key={i} className="mb-3 flex gap-3 text-lg leading-relaxed last:mb-0">
            <span aria-label={`Paragraphe ${i + 1}`} className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
              {i + 1}
            </span>
            <span>{p}</span>
          </p>
        ))}
      </div>
    </details>
  );
}
