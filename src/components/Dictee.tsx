"use client";
// Dictée : la phrase est lue par la voix de l'appareil (aucune connexion), ou par un parent.
import { useEffect, useState } from "react";
import { verifierCodeParent } from "@/lib/stockage";
import { champ } from "./ui";

function choisirVoix(): SpeechSynthesisVoice | null {
  const voix = window.speechSynthesis.getVoices();
  return voix.find((v) => v.lang.toLowerCase().startsWith("fr-ca")) ?? voix.find((v) => v.lang.toLowerCase().startsWith("fr")) ?? null;
}

export function Dictee({ phrase, valeur, onChange }: { phrase: string; valeur: string; onChange: (v: string) => void }) {
  // Composant affiché seulement dans le navigateur (après chargement des données) : on peut lire « window ».
  const [voixDispo] = useState(() => typeof window !== "undefined" && "speechSynthesis" in window);
  const [lecture, setLecture] = useState(false);
  const [modeParent, setModeParent] = useState<"ferme" | "code" | "visible">("ferme");
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    const ok = voixDispo;
    if (ok) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
    return () => { if (ok) window.speechSynthesis.cancel(); };
  }, [voixDispo]);

  function lire(lent: boolean) {
    if (!voixDispo) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(phrase);
    const v = choisirVoix();
    if (v) u.voice = v;
    u.lang = v?.lang ?? "fr-CA";
    u.rate = lent ? 0.6 : 0.9;
    u.onstart = () => setLecture(true);
    u.onend = () => setLecture(false);
    u.onerror = () => setLecture(false);
    synth.speak(u);
  }

  const boutonAudio = "flex min-h-16 flex-1 items-center justify-center gap-2 rounded-2xl px-4 font-titre text-lg font-semibold shadow-[0_4px_0] transition active:translate-y-0.5 active:shadow-[0_1px_0]";

  return (
    <div className="flex flex-col gap-4">
      {voixDispo ? (
        <div className="flex gap-3">
          <button type="button" onClick={() => lire(false)} className={`${boutonAudio} bg-sky-500 text-white shadow-sky-700`}>
            {lecture ? "🔉" : "🔊"} Écouter
          </button>
          <button type="button" onClick={() => lire(true)} className={`${boutonAudio} bg-surface shadow-bordure ring-2 ring-bordure`}>
            🐢 Lentement
          </button>
        </div>
      ) : (
        <p className="rounded-2xl bg-accent-doux px-4 py-3 font-semibold text-accent">
          La lecture à voix haute n&apos;est pas disponible sur cet appareil. Demande à un parent de lire la phrase.
        </p>
      )}

      <label htmlFor="dictee" className="sr-only">Écris la phrase</label>
      <textarea
        id="dictee"
        rows={3}
        spellCheck={false}
        autoCorrect="off"
        autoComplete="off"
        autoCapitalize="off"
        placeholder="Écris la phrase ici…"
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        className={`${champ} h-auto min-h-28 py-3 text-xl leading-relaxed`}
      />
      <p className="-mt-2 text-sm font-semibold text-texte-doux">Le correcteur automatique du clavier est désactivé : c&apos;est toi le champion de l&apos;orthographe ! 🏆</p>

      {/* Option : un parent lit la phrase (protégée par le code parent pour que l'enfant ne la voie pas). */}
      <div className="rounded-2xl bg-fond p-3 ring-1 ring-bordure">
        {modeParent === "ferme" && (
          <button type="button" onClick={() => setModeParent("code")} className="w-full text-left text-sm font-bold text-texte-doux">
            👨‍👩‍👦 Un parent lit la phrase à voix haute
          </button>
        )}
        {modeParent === "code" && (
          <form
            className="flex flex-wrap items-center gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (await verifierCodeParent(code)) { setModeParent("visible"); setErreur(false); }
              else { setErreur(true); setCode(""); }
            }}
          >
            <input aria-label="Code parent" placeholder="Code parent" type="password" inputMode="numeric" autoFocus className={`${champ} h-12 max-w-48`} value={code} onChange={(e) => setCode(e.target.value.trim())} />
            <button type="submit" className="h-12 rounded-2xl bg-primaire px-4 font-bold text-white dark:text-fond">OK</button>
            <button type="button" onClick={() => { setModeParent("ferme"); setCode(""); }} className="h-12 px-2 font-bold text-texte-doux">Annuler</button>
            {erreur && <p role="alert" className="w-full text-sm font-semibold text-accent">Code incorrect.</p>}
          </form>
        )}
        {modeParent === "visible" && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold text-texte-doux">Phrase à lire (pour le parent) :</p>
            <p className="rounded-xl bg-surface p-3 text-lg font-semibold">{phrase}</p>
            <button type="button" onClick={() => { setModeParent("ferme"); setCode(""); }} className="self-start text-sm font-bold text-primaire">🙈 Cacher la phrase</button>
          </div>
        )}
      </div>
    </div>
  );
}
