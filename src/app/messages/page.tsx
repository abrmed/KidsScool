"use client";
// Messages de mes parents : commentaires publiés par un parent sur les réponses écrites et la dictée.
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BlocTexte } from "@/components/BlocTexte";
import { Avatar, Chargement, LienRetour, Page } from "@/components/ui";
import { trouverTexte } from "@/contenu";
import { afficherScore } from "@/lib/correction";
import { decoderRetour } from "@/lib/fiche";
import { ajouterRetour, marquerRetourVu, useDonnees, type Retour } from "@/lib/stockage";

const date = (t: number) => new Date(t).toLocaleDateString("fr-CA", { timeZone: "America/Toronto", dateStyle: "long" });

export default function Messages() {
  const d = useDonnees();
  const router = useRouter();
  const profil = d?.profils.find((p) => p.id === d.profilActif);
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [recu, setRecu] = useState<string | null>(null);

  // Lien envoyé par un parent : …/messages/#retour=…
  useEffect(() => {
    if (!d) return;
    const m = window.location.hash.match(/retour=([A-Za-z0-9_-]+)/);
    if (!m) return;
    decoderRetour(m[1]).then((r) => {
      if (!r) return;
      const cible = d.profils.find((p) => p.id === r.profilId) ?? d.profils.find((p) => p.id === d.profilActif);
      if (cible) {
        ajouterRetour({ ...r, profilId: cible.id });
        setRecu(r.id);
      }
      history.replaceState(null, "", window.location.pathname);
    });
  }, [d]);

  useEffect(() => {
    if (d && !profil) router.replace("/");
  }, [d, profil, router]);
  if (!d || !profil) return <Chargement />;

  const mesRetours = (d.retours ?? []).filter((r) => r.profilId === profil.id).sort((a, b) => b.date - a.date);

  return (
    <Page>
      <LienRetour href="/accueil/">← Mon espace</LienRetour>
      <header className="flex items-center gap-3">
        <Avatar emoji={profil.avatar} index={d.profils.indexOf(profil)} />
        <div>
          <h1 className="text-3xl font-bold">📬 Messages de mes parents</h1>
          <p className="font-semibold text-texte-doux">Leurs commentaires sur tes réponses écrites et tes dictées.</p>
        </div>
      </header>
      {recu && <p role="status" className="rounded-2xl bg-emerald-100 px-4 py-3 font-semibold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">Nouveau message reçu ✓</p>}

      {mesRetours.length === 0 ? (
        <p className="rounded-3xl bg-surface p-6 text-center font-semibold text-texte-doux ring-1 ring-bordure">
          Pas encore de message. Quand tes parents auront lu tes réponses écrites, leurs commentaires apparaîtront ici. ✨
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {mesRetours.map((r) => (
            <li key={r.id}>
              <CarteRetour r={r} ouvert={ouvert === r.id || recu === r.id} onOuvrir={() => { setOuvert(ouvert === r.id ? null : r.id); if (!r.vu) marquerRetourVu(r.id); }} />
            </li>
          ))}
        </ul>
      )}
    </Page>
  );
}

function CarteRetour({ r, ouvert, onOuvrir }: { r: Retour; ouvert: boolean; onOuvrir: () => void }) {
  const texte = trouverTexte(r.items.find((i) => i.texteId)?.texteId);
  return (
    <article className="overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-bordure">
      <button type="button" onClick={onOuvrir} aria-expanded={ouvert} className="flex w-full items-center gap-4 p-4 text-left hover:bg-fond">
        <span aria-hidden className="relative text-4xl">
          💌{!r.vu && <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-rose-500 ring-2 ring-surface" />}
        </span>
        <span className="flex-1">
          <span className="block font-titre text-lg font-semibold">{r.titre}</span>
          <span className="block text-sm font-semibold text-texte-doux">
            {date(r.date)} · Score {afficherScore(r.scoreRevise)}/{r.total}
            {r.scoreRevise !== r.scoreInitial ? ` (revu par tes parents, au lieu de ${afficherScore(r.scoreInitial)})` : ""}
          </span>
        </span>
        <span aria-hidden className={`text-xl transition ${ouvert ? "rotate-180" : ""}`}>⌄</span>
      </button>

      {ouvert && (
        <div className="flex flex-col gap-4 border-t border-bordure p-4">
          {r.motParent.trim() && (
            <blockquote className="rounded-3xl rounded-tl-md bg-linear-to-br from-amber-100 to-orange-100 p-4 text-lg font-semibold text-amber-950 dark:from-amber-950 dark:to-orange-950 dark:text-amber-50">
              <span aria-hidden>💬 </span>{r.motParent}
            </blockquote>
          )}
          {texte && <BlocTexte texte={texte} ouvert={false} />}
          {r.items.map((it) => (
            <section key={it.numero} className="rounded-2xl bg-fond p-4 ring-1 ring-bordure">
              <p className="text-sm font-bold uppercase tracking-wide text-primaire">{it.consigne} · {afficherScore(it.points)} pt</p>
              {it.enonce && !it.enonce.startsWith("Écris exactement") && <p className="mt-1 text-lg font-semibold">{it.enonce}</p>}
              <p className="mt-3 text-sm font-bold text-texte-doux">Ta réponse :</p>
              <p className="whitespace-pre-wrap rounded-xl bg-surface p-3 text-lg">{it.donnee || "(vide)"}</p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {it.commentaires.map((c, k) => (
                  <li key={k} className={`rounded-xl px-3 py-2 font-semibold ${c.ok ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100" : "bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-50"}`}>
                    {c.ok ? "✅ " : "💡 "}{c.texte}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm font-bold text-texte-doux">{it.consigne.startsWith("Écoute") ? "La phrase dictée :" : "Un exemple de bonne réponse :"}</p>
              <p className="rounded-xl bg-emerald-50 p-3 text-lg font-semibold text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100">{it.modele}</p>
            </section>
          ))}
        </div>
      )}
    </article>
  );
}
