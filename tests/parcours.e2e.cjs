// Test de bout en bout du site statique (navigateur réel).
// Usage : npm run build, servir le dossier out/ sur http://localhost:3200, puis :
//   node tests/parcours.e2e.cjs <dossier-captures>
const { chromium, devices } = require("playwright");
const URL = "http://localhost:3200";
const out = [];
const ok = (c, m) => { out.push(`[${c ? "OK" : "ÉCHEC"}] ${m}`); console.log(out[out.length - 1]); };

async function repondreAuHasard(p) {
  // Répond à une question sans connaître la réponse (le site ne la montre jamais à l'élève).
  if (await p.locator('[role="radio"]').count()) await p.locator('[role="radio"]').first().click();
  else if (await p.locator("#reponse").count()) await p.fill("#reponse", "3");
  else {
    const tuiles = p.locator('main section button:not([disabled])').filter({ hasNotText: /Valider|Terminer/ });
    const n = await p.locator("main section .flex-wrap").last().locator("button:not([disabled])").count();
    for (let i = 0; i < n; i++) await p.locator("main section .flex-wrap").last().locator("button:not([disabled])").first().click();
    void tuiles;
  }
}

(async () => {
  const S = process.argv[2] || ".";
  const b = await chromium.launch();
  const tel = devices["iPhone 13"];
  const ctx = await b.newContext({ ...tel, permissions: ["clipboard-read", "clipboard-write"] });
  const p = await ctx.newPage();

  // 1. Première utilisation : code parent + premier joueur
  await p.goto(URL + "/");
  await p.waitForSelector("text=Réservé à un parent");
  await p.waitForTimeout(900); await p.screenshot({ path: S + "/s1-config.png", fullPage: true });
  await p.fill("#code", "2468"); await p.fill("#code2", "2468"); await p.click("text=Enregistrer le code");
  await p.fill("#prenom", "Démo Élève"); await p.click('[aria-label="Avatar 🐼"]'); await p.fill("#code-enfant", "1357"); await p.click("text=C'est parti");
  await p.waitForSelector("text=Qui joue ?");
  await p.waitForTimeout(900); await p.screenshot({ path: S + "/s2-qui-joue.png", fullPage: true });
  ok(true, "Configuration : code parent et premier joueur créés");

  // 2. Accueil élève
  await p.click("text=Démo Élève"); await p.waitForSelector("text=Tape ton code secret");
  await p.fill("#code-secret", "0000"); await p.click("text=Entrer");
  ok(await p.isVisible("text=pas le bon code"), "Code enfant : mauvais code refusé");
  await p.waitForTimeout(900); await p.screenshot({ path: S + "/s2b-code-enfant.png", fullPage: true });
  await p.fill("#code-secret", "1357"); await p.click("text=Entrer");
  await p.waitForSelector("text=Mes matières");
  ok(true, "Code enfant : bon code accepté, profil ouvert");
  ok(await p.isVisible("text=Anglais") && await p.isVisible("text=Français") && await p.isVisible("text=Mathématiques"), "Accueil élève : 3 matières");
  await p.waitForTimeout(900); await p.screenshot({ path: S + "/s3-accueil.png", fullPage: true });

  // 3. Chemin des maths
  await p.click("text=Mathématiques"); await p.waitForSelector("text=Nombres et opérations");
  ok(await p.locator('a[href*="/lecon/?m=maths&u=operations&n=1"]').count() === 1, "Chemin : niveau 1 ouvert");
  ok(await p.locator('a[href*="/lecon/?m=maths&u=operations&n=2"]').count() === 0, "Chemin : niveau 2 verrouillé au départ");
  await p.waitForTimeout(900); await p.screenshot({ path: S + "/s4-chemin.png", fullPage: false });

  // 4. Leçon complète
  await p.click('a[href*="u=operations&n=1"]');
  await p.waitForSelector("text=1/8");
  await p.waitForTimeout(900); await p.screenshot({ path: S + "/s5-question.png", fullPage: false });
  let pageCorrection = false;
  for (let i = 0; i < 8; i++) {
    await repondreAuHasard(p);
    const bouton = p.locator("button", { hasText: /Valider|Terminer/ });
    await bouton.click();
    const txt = await p.textContent("main");
    if (/Bonne réponse|incorrect|Faux|Explication/i.test(txt)) pageCorrection = true;
    await p.waitForTimeout(600);
  }
  await p.waitForSelector("text=Ton score");
  const score = await p.textContent("main");
  ok(/\d\/8/.test(score), "Fin de leçon : le score s'affiche");
  ok(!pageCorrection && !/Bonne réponse|Explication/.test(score), "L'élève ne voit aucune correction (ni pendant, ni à la fin)");
  await p.waitForTimeout(900); await p.screenshot({ path: S + "/s6-score.png", fullPage: true });

  // 5. Fiche : copier le lien
  await p.click("text=Copier le lien");
  await p.waitForSelector("text=Lien copié");
  const lien = await p.evaluate(() => navigator.clipboard.readText());
  ok(lien.includes("/parents/#fiche="), "Fiche : lien copié");

  // 6. Niveau 2 débloqué
  await p.click("text=Mon chemin"); await p.waitForSelector("text=Nombres et opérations");
  ok(await p.locator('a[href*="u=operations&n=2"]').count() === 1, "Chemin : niveau 2 débloqué après la leçon");

  // 7. Espace parents sur l'appareil de l'enfant
  await p.goto(URL + "/parents/");
  await p.fill("#code", "0000"); await p.click("text=Ouvrir");
  ok(await p.isVisible("text=Code incorrect"), "Espace parents : mauvais code refusé");
  await p.fill("#code", "2468"); await p.click("text=Ouvrir");
  await p.waitForSelector("text=Corrections détaillées");
  await p.locator("details summary").first().click();
  const corr = await p.textContent("main");
  ok(/Réponse donnée/.test(corr) && /Explication/.test(corr), "Espace parents : correction détaillée visible");
  await p.waitForTimeout(900); await p.screenshot({ path: S + "/s7-parents.png", fullPage: true });

  // 8. Autre appareil (téléphone du parent) : ouvrir le lien de la fiche
  const ctx2 = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
  const p2 = await ctx2.newPage();
  await p2.goto(lien);
  await p2.waitForSelector("text=Réservé à un parent");
  await p2.fill("#code", "2468"); await p2.fill("#code2", "2468"); await p2.click("text=Enregistrer le code");
  await p2.waitForSelector("text=Fiche reçue");
  const fiche = await p2.textContent("main");
  ok(fiche.includes("Démo Élève") && /Réponse donnée/.test(fiche), "Fiche ouverte sur un autre appareil : correction visible");
  await p2.waitForTimeout(900); await p2.screenshot({ path: S + "/s8-fiche-ordi.png", fullPage: true });

  // 9. Mode sombre
  const ctx3 = await b.newContext({ ...tel, colorScheme: "dark" });
  const p3 = await ctx3.newPage();
  await p3.goto(URL + "/"); await p3.waitForSelector("text=Réservé à un parent");
  await p3.waitForTimeout(900); await p3.screenshot({ path: S + "/s9-sombre.png", fullPage: true });

  await b.close();
  console.log(out.filter((l) => l.startsWith("[OK]")).length + "/" + out.length + " réussis");
  process.exit(out.every((l) => l.startsWith("[OK]")) ? 0 : 1);
})().catch((e) => { console.error("ERREUR", e.message); process.exit(1); });
