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

/** Valide la réponse, vérifie la correction immédiate, puis passe à la suite. */
async function valider(p) {
  await p.locator("button", { hasText: /^Valider$/ }).click();
  await p.waitForSelector('[role="status"] >> text=/Bravo|Excellent|Super|Parfait|Presque|Pas tout à fait/');
  const txt = await p.textContent('[role="status"]');
  await p.locator("button", { hasText: /Continuer|Voir mon score/ }).click();
  await p.waitForTimeout(400);
  return txt;
}

async function faireLecon(p, nombre) {
  for (let i = 0; i < nombre; i++) {
    await repondreAuHasard(p);
    await valider(p);
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
  await p.waitForSelector("text=Qui es-tu ?");
  await capture(p, S, "s0-bienvenue");
  await p.click("text=Je suis un élève");
  ok(await p.isVisible("text=Demande ton lien à un parent"), "Appareil neuf : l'élève est invité à demander son lien (pas de code parent)");
  await p.click("text=← Retour"); await p.click("text=Je suis un parent");
  await p.waitForSelector("text=Réservé à un parent");
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

  // 2b. Nouvelles unités
  await p.goto(URL + "/matiere/?m=anglais"); await p.waitForSelector("text=Irregular verbs");
  ok(true, "Anglais : unité « Irregular verbs » présente");
  await p.click('a[href*="u=irregular&n=1"]'); await p.waitForSelector("text=1/8");
  await capture(p, S, "s3b-irreguliers");
  await p.goto(URL + "/matiere/?m=maths"); await p.waitForSelector("text=Résolution de problèmes");
  ok(true, "Maths : unité « Résolution de problèmes » présente");
  await p.goto(URL + "/accueil/"); await p.waitForSelector("text=Mes matières");

  // 3. Chemin + leçon de maths
  await p.click("text=Mathématiques"); await p.waitForSelector("text=Nombres et opérations");
  ok(await p.locator('a[href*="u=operations&n=1"]').count() === 1, "Chemin : niveau 1 ouvert");
  ok(await p.locator('a[href*="u=operations&n=2"]').count() === 0, "Chemin : niveau 2 verrouillé au départ");
  await p.click('a[href*="u=operations&n=1"]'); await p.waitForSelector("text=1/8");
  let explications = 0;
  for (let i = 0; i < 8; i++) {
    await repondreAuHasard(p);
    if (i === 0) {
      await p.locator("button", { hasText: /^Valider$/ }).click();
      await p.waitForSelector('[role="status"]');
      await capture(p, S, "s5e-correction-immediate");
      if (/Pourquoi/.test(await p.textContent('[role="status"]'))) explications++;
      await p.locator("button", { hasText: /Continuer/ }).click(); await p.waitForTimeout(400);
    } else if (/Pourquoi/.test(await valider(p))) explications++;
  }
  await p.waitForSelector("text=Ton score");
  const fin = await p.textContent("main");
  ok(/\d(,5)?\/8/.test(fin), "Fin de leçon : le score s'affiche");
  ok(explications === 8, "Correction immédiate : chaque réponse est validée avec une explication (8/8)");
  await p.click("text=Mon chemin"); await p.waitForSelector("text=Nombres et opérations");
  ok(await p.locator('a[href*="u=operations&n=2"]').count() === 1, "Chemin : niveau 2 débloqué après la leçon");

  // 4. Lecture : texte affiché + réponses rédigées
  await p.goto(URL + "/matiere/?m=francais"); await p.waitForSelector("text=Compréhension de texte");
  await p.click('a[href*="u=comprehension&n=1"]'); await p.waitForSelector("text=Jour de tempête");
  ok(await p.isVisible("text=Ce matin-là, Léa a ouvert les rideaux"), "Lecture : le texte s'affiche avec la question");
  for (let i = 0; i < 6; i++) { await repondreAuHasard(p); await valider(p); }
  ok(await p.locator("#redaction").count() === 1, "Lecture : une question à réponse rédigée apparaît");
  await capture(p, S, "s5c-redaction");
  await repondreAuHasard(p);
  const retro = await valider(p);
  ok(/exemple de bonne réponse/i.test(retro), "Réponse rédigée : commentaires et exemple de bonne réponse affichés tout de suite");
  await repondreAuHasard(p); await valider(p);
  await p.waitForSelector("text=Ton score");
  ok(await p.isVisible("text=Tes parents vont lire tes réponses écrites"), "Fin de lecture : l'élève sait que ses parents vont lire ses réponses");
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

  // 7b. Lien d'installation pour l'appareil d'un enfant
  await p.locator("li", { hasText: "Démo Élève 2" }).locator("button", { hasText: "Lien d'installation" }).click();
  await p.waitForSelector("text=Lien d'installation de Démo Élève 2 copié");
  const lienInstall = await p.evaluate(() => navigator.clipboard.readText());
  const ctxE = await b.newContext({ ...tel });
  const pe = await ctxE.newPage();
  await pe.goto(lienInstall); await pe.waitForSelector("text=Installer mon profil");
  await capture(pe, S, "s7b-installation");
  await pe.click("text=Installer mon profil"); await pe.waitForSelector("text=Tape ton code secret");
  await pe.fill("#code-secret", "9753"); await pe.click("text=Entrer"); await pe.waitForSelector("text=Mes matières");
  ok((await pe.textContent("main")).includes("Démo Élève 2"), "Lien d'installation : profil installé sur un appareil neuf, sans code parent");
  await pe.goto(URL + "/"); await pe.waitForSelector("text=Qui joue ?");
  ok(await pe.locator("text=Démo Élève 2").count() === 1, "Appareil de l'enfant : « Qui joue ? » affiche son profil");
  await ctxE.close();

  // 7b'. Inviter l'autre parent (qui a déjà créé son propre code et un joueur en double)
  await p.click("text=Inviter l'autre parent >> nth=1");
  await p.waitForSelector("text=Lien d'invitation copié");
  const lienParent = await p.evaluate(() => navigator.clipboard.readText());
  const ctxP = await b.newContext({ ...tel });
  const pp = await ctxP.newPage();
  await pp.goto(URL + "/"); await pp.click("text=Je suis un parent");
  await pp.fill("#code", "1111"); await pp.fill("#code2", "1111"); await pp.click("text=Enregistrer le code");
  await pp.fill("#prenom", "Doublon"); await pp.fill("#code-enfant", "4444"); await pp.click("text=C'est parti");
  await pp.waitForSelector("text=Qui joue ?");
  await pp.goto(lienParent); await pp.waitForSelector("text=Bienvenue dans la famille");
  ok(await pp.isChecked('input[type="checkbox"]'), "Invitation parent : effacer les doublons proposé par défaut");
  await capture(pp, S, "s7d-invitation-parent");
  await pp.click("text=Rejoindre la famille"); await pp.waitForSelector("#code");
  await pp.fill("#code", "2468"); await pp.click("text=Ouvrir"); await pp.waitForSelector("text=Corrections détaillées");
  ok(true, "Autre parent : le code parent commun ouvre l'Espace parents");
  await pp.click("text=🎒 Joueurs");
  const joueurs = await pp.textContent("main");
  ok(joueurs.includes("Démo Élève 2") && !joueurs.includes("Doublon"), "Autre parent : mêmes joueurs, doublon effacé");
  await ctxP.close();

  // 7c. Impression
  await p.click("text=🖨️ Imprimer"); await p.waitForSelector("text=Imprimer une feuille");
  ok(await p.isVisible("text=Feuille d'exercices") && await p.isVisible("text=Jour de tempête"), "Impression : feuille de français prête (avec le texte)");
  await p.emulateMedia({ media: "print" });
  await p.pdf({ path: S + "/feuille-francais.pdf", format: "Letter" }).catch(() => {});
  await p.emulateMedia({ media: "screen" });
  await p.click("text=Voir le corrigé à l'écran");
  ok(await p.isVisible("text=Corrigé (parents)") && await p.isVisible("text=Réponse modèle"), "Impression : corrigé disponible pour les parents");

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
