"use client";
// « Fiche de résultats » : un lien que l'enfant envoie à un parent.
// Le résultat est compressé dans le lien (après #, donc jamais envoyé à un serveur).
// Le parent l'ouvre dans l'Espace parents, protégé par son code.
import type { Resultat } from "./stockage";

const enBase64Url = (octets: Uint8Array) => {
  let bin = "";
  octets.forEach((o) => (bin += String.fromCharCode(o)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const deBase64Url = (texte: string) => {
  const b64 = texte.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

async function transformer(octets: Uint8Array, flux: CompressionStream | DecompressionStream) {
  const sortie = new Blob([octets as BlobPart]).stream().pipeThrough(flux);
  return new Uint8Array(await new Response(sortie).arrayBuffer());
}

export async function encoderFiche(r: Resultat): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify({ v: 1, r }));
  return enBase64Url(await transformer(json, new CompressionStream("deflate-raw")));
}

export async function decoderFiche(code: string): Promise<Resultat | null> {
  try {
    const json = await transformer(deBase64Url(code.trim()), new DecompressionStream("deflate-raw"));
    const obj = JSON.parse(new TextDecoder().decode(json)) as { v: number; r: Resultat };
    if (obj?.v !== 1 || !obj.r?.reponses) return null;
    return { ...obj.r, importee: true };
  } catch {
    return null;
  }
}

export function lienFiche(code: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${window.location.origin}${base}/parents/#fiche=${code}`;
}
