// Test de bout en bout du site statique (navigateur réel).
// Usage : npm run build, servir le dossier out/ sur http://localhost:3200 (ou SITE_URL=https://abrmed.github.io/KidsScool), puis :
//   node tests/parcours.e2e.cjs <dossier-captures>
const { chromium, devices } = require("playwright");
const URL = process.env.SITE_URL || "http://localhost:3200";
const out = [];
const ok = (c, m) => { out.push(`[${c ? "OK" : "ÉCHEC"}] ${m}`); console.log(out[out.length - 1]); };

async function repondreAuHasard(p) {
  // Répond sans connaître la réponse (le site ne la montre jamais à l'élève).
  if (await p.locator('[role="radio"]').count()) await p.locator('[role="radio"]').first().click();
  else if (await p.locator("#reponse").count()) await p.fill("#reponse", "3");
  else if (await p.locator("#redaction").count()) await p.fill("#redaction", "Je pense que le personnage est content parce que c'est la fin.");
  else if (await p.locator("#dictee").count()) await p.fill("#dictee", "le chat dort sur le tapis");
  else {
    const zone = p.locator("main section .flex-wrap").last();
    const n = await zone.locator("button:not([disabled])").count();
    for (let i = 0; i < n; i++) await zone.locator("button:not([disabled])").first().click();
  }
}

async function faireLecon(p, nombre) {
  for (let i = 0; i < nombre; i++) {
    await repondreAuHasard(p);
    await p.locator("button", { hasText: /Valider|Terminer/ }).click();
    await p.waitForTimeout(600);
  }
  await p.waitForSelector("text=Ton score");
}

const capture = async (p, S, nom) => { await p.waitForTimeout(900); await p.screenshot({ path: `${S}/${nom}.png`, fullPage: true }); };

(async () => {
  const S = process.argv[2] || ".";
  const b = await chromium.launch();
  const tel = devices["iPhone 13"];
  const ctx = await b.newContext({ ...tel, permissions: ["clipboard-read", "clipboard-write"] });
  const p = await ctx.newPage();

  // 1. Première utilisation : code parent + premier joueur
  await p.goto(URL + "/");
  await p.waitForSelector("text=Réservé à un parent");
  await capture(p, S, "s1-config");
  await p.fill("#code", "2468"); await p.fill("#code2", "2468"); await p.click("text=Enregistrer le code");
  await p.fill("#prenom", "Démo Élève"); await p.click('[aria-label="Avatar 🐼"]'); await p.fill("#code-enfant", "1357"); await p.click("text=C'est parti");
  await p.waitForSelector("text=Qui joue ?");
  ok(true, "Configuration : code parent et premier joueur créés");

  // 2. Code enfant
  await p.click("text=Démo Élève"); await p.waitForSelector("text=Tape ton code secret");
  await p.fill("#code-secret", "0000"); await p.click("text=Entrer");
  ok(await p.isVisible("text=pas le bon code"), "Code enfant : mauvais code refusé");
  await p.fill("#code-secret", "1357"); await p.click("text=Entrer");
  await p.waitForSelector("text=Mes matières");
  ok(true, "Code enfant : bon code accepté, profil ouvert");
  ok(await p.isVisible("text=Anglais") && await p.isVisible("text=Français") && await p.isVisible("text=Mathématiques"), "Accueil élève : 3 matières");

  // 3. Chemin + leçon de maths
  await p.click("text=Mathématiques"); await p.waitForSelector("text=Nombres et opérations");
  ok(await p.locator('a[href*="u=operations&n=1"]').count() === 1, "Chemin : niveau 1 ouvert");
  ok(await p.locator('a[href*="u=operations&n=2"]').count() === 0, "Chemin : niveau 2 verrouillé au départ");
  await p.click('a[href*="u=operations&n=1"]'); await p.waitForSelector("text=1/8");
  let correctionVue = false;
  for (let i = 0; i < 8; i++) {
    await repondreAuHasard(p);
    await p.locator("button", { hasText: /Valider|Terminer/ }).click();
    if (/Bonne réponse|Explication/i.test(await p.textContent("main"))) correctionVue = true;
    await p.waitForTimeout(600);
  }
  await p.waitForSelector("text=Ton score");
  const fin = await p.textContent("main");
  ok(/\d(,5)?\/8/.test(fin), "Fin de leçon : le score s'affiche");
  ok(!correctionVue && !/Bonne réponse|Explication/.test(fin), "L'élève ne voit aucune correction (ni pendant, ni à la fin)");
  await p.click("text=Mon chemin"); await p.waitForSelector("text=Nombres et opérations");
  ok(await p.locator('a[href*="u=operations&n=2"]').count() === 1, "Chemin : niveau 2 débloqué après la leçon");

  // 4. Lecture : texte affiché + réponses rédigées
  await p.goto(URL + "/matiere/?m=francais"); await p.waitForSelector("text=Compréhension de texte");
  await p.click('a[href*="u=comprehension&n=1"]'); await p.waitForSelector("text=Jour de tempête");
  ok(await p.isVisible("text=Ce matin-là, Léa a ouvert les rideaux"), "Lecture : le texte s'affiche avec la question");
  for (let i = 0; i < 6; i++) { await repondreAuHasard(p); await p.locator("button", { hasText: /Valider|Terminer/ }).click(); await p.waitForTimeout(600); }
  ok(await p.locator("#redaction").count() === 1, "Lecture : une question à réponse rédigée apparaît");
  await capture(p, S, "s5c-redaction");
  for (let i = 0; i < 2; i++) { await repondreAuHasard(p); await p.locator("button", { hasText: /Valider|Terminer/ }).click(); await p.waitForTimeout(600); }
  await p.waitForSelector("text=Ton score");
  ok(await p.isVisible("text=Tes parents vont lire tes réponses écrites"), "Fin de lecture : l'élève sait que ses parents vont commenter");
  await p.click("text=Copier le lien");
  await p.waitForSelector("text=Lien copié");
  const lienLecture = await p.evaluate(() => navigator.clipboard.readText());

  // 5. Dictée
  await p.goto(URL + "/lecon/?m=francais&u=dictee&n=1"); await p.waitForSelector("text=Écoute et écris la phrase");
  ok(await p.isVisible("text=Écouter") && await p.isVisible("text=Lentement"), "Dictée : boutons d'écoute présents");
  await p.click("text=Un parent lit la phrase"); await p.fill('[aria-label="Code parent"]', "2468"); await p.click("form >> text=OK");
  ok(await p.isVisible("text=Phrase à lire (pour le parent)"), "Dictée : un parent peut afficher la phrase avec son code");
  await p.click("text=Cacher la phrase");
  await capture(p, S, "s5d-dictee");
  await faireLecon(p, 5);

  // 6. Espace parents : révision et publication
  await p.goto(URL + "/parents/");
  await p.fill("#code", "0000"); await p.click("text=Ouvrir");
  ok(await p.isVisible("text=Code incorrect"), "Espace parents : mauvais code refusé");
  await p.fill("#code", "2468"); await p.click("text=Ouvrir");
  await p.waitForSelector("text=Corrections détaillées");
  await p.locator("details", { hasText: "Compréhension de texte" }).first().locator("summary").first().click();
  const det = p.locator("details", { hasText: "Compréhension de texte" }).first();
  ok(/Réponse modèle/.test(await det.textContent()) && /Ta note/.test(await det.textContent()), "Espace parents : réponse modèle, commentaires et note ajustable");
  await det.locator('[aria-label="Note de la question 7"] button', { hasText: "1" }).first().click();
  await det.locator("textarea").fill("Bravo pour tes efforts ! Relis le paragraphe 3.");
  await det.locator("button", { hasText: "Montrer à" }).click();
  ok(await p.isVisible("text=Commentaires montrés à"), "Espace parents : commentaires montrés à l'enfant");
  await capture(p, S, "s7-revision");

  // 7. Ajouter un 2e enfant
  await p.click("text=🎒 Joueurs");
  await p.fill("#prenom", "Démo Élève 2"); await p.fill("#code-enfant", "9753"); await p.click("button:has-text('Ajouter')");
  ok(await p.isVisible("text=Démo Élève 2 est ajouté"), "Espace parents : 2e enfant ajouté");

  // 8. L'enfant voit le message de ses parents (sans les choix multiples)
  await p.goto(URL + "/");
  ok(await p.locator("text=Démo Élève 2").count() === 1, "Qui joue ? : les deux enfants apparaissent");
  await p.click("text=Démo Élève >> nth=0"); await p.fill("#code-secret", "1357"); await p.click("text=Entrer");
  await p.waitForSelector("text=nouveau message");
  await p.click("text=nouveau message"); await p.waitForSelector("text=Messages de mes parents");
  await p.locator("article button").first().click();
  const msg = await p.textContent("main");
  ok(msg.includes("Bravo pour tes efforts") && msg.includes("Ta réponse") && !msg.includes("Choix proposés"), "Messages : l'enfant voit le mot du parent et les commentaires (pas les choix multiples)");
  await capture(p, S, "s8-messages");

  // 9. L'enfant change son code
  await p.goto(URL + "/accueil/"); await p.click("text=Changer mon code secret");
  await p.fill('[aria-label="Mon code actuel"]', "1357"); await p.fill('[aria-label="Mon nouveau code"]', "8642"); await p.click("button:has-text('Changer mon code')");
  ok(await p.isVisible("text=Retiens bien ton nouveau code"), "L'enfant change son code");
  await p.goto(URL + "/"); await p.click("text=Démo Élève >> nth=0"); await p.fill("#code-secret", "8642"); await p.click("text=Entrer");
  await p.waitForSelector("text=Mes matières");
  ok(true, "Le nouveau code de l'enfant fonctionne");

  // 10. Autre appareil (téléphone du parent) : fiche reçue, puis commentaires renvoyés par lien
  const ctx2 = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2, permissions: ["clipboard-read", "clipboard-write"] });
  const p2 = await ctx2.newPage();
  await p2.goto(lienLecture);
  await p2.waitForSelector("text=Réservé à un parent");
  await p2.fill("#code", "2468"); await p2.fill("#code2", "2468"); await p2.click("text=Enregistrer le code");
  await p2.waitForSelector("text=Fiche reçue");
  ok((await p2.textContent("main")).includes("Réponse donnée"), "Fiche ouverte sur un autre appareil : correction visible");
  await capture(p2, S, "s9-fiche-ordi");
  await p2.locator("button", { hasText: "Envoyer à" }).first().click();
  await p2.waitForSelector("text=Lien copié");
  const lienRetour = await p2.evaluate(() => navigator.clipboard.readText());
  await p.goto(lienRetour); await p.waitForSelector("text=Nouveau message reçu");
  ok(true, "Commentaires envoyés par lien : reçus sur l'appareil de l'enfant");

  await b.close();
  console.log(out.filter((l) => l.startsWith("[OK]")).length + "/" + out.length + " réussis");
  process.exit(out.every((l) => l.startsWith("[OK]")) ? 0 : 1);
})().catch((e) => { console.error("ERREUR", e.message); console.log(out.join("\n")); process.exit(1); });
