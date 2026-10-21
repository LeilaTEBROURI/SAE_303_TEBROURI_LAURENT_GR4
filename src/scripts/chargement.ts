const ecran = document.querySelector<HTMLElement>("#chargement-enquete")!;
const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)");
let depart: ReturnType<typeof setTimeout> | undefined;
let secours: ReturnType<typeof setTimeout> | undefined;

function masquer() {
  clearTimeout(depart);
  clearTimeout(secours);
  ecran.hidden = true;
}

const repliques = [
  {
    debut: "Ne bouge pas…",
    fin: "on suit sa trace.",
    detail: "Ouverture de la prochaine pièce du dossier…",
  },
  {
    debut: "Il file avec le sac…",
    fin: "pas avec les preuves.",
    detail: "On rassemble les indices…",
  },
  {
    debut: "Un instant, détective…",
    fin: "ça se précise.",
    detail: "Le prochain dossier arrive…",
  },
  {
    debut: "Chut…",
    fin: "il nous a presque vus.",
    detail: "On avance discrètement…",
  },
  {
    debut: "Garde l’œil ouvert…",
    fin: "il y a une piste.",
    detail: "On vérifie les pièces du dossier…",
  },
  {
    debut: "Il prend la fuite…",
    fin: "on garde le cap.",
    detail: "En route vers les prochains indices…",
  },
];
let derniereReplique = "";
try {
  derniereReplique = sessionStorage.getItem("enquete-derniere-replique") ?? "";
} catch {
  // La variation fonctionne aussi sans accès au stockage du navigateur.
}

function changerReplique() {
  const choix = repliques.filter(
    (replique) => replique.debut !== derniereReplique,
  );
  const replique = choix[Math.floor(Math.random() * choix.length)]!;
  ecran.querySelector<HTMLElement>('[data-loading-line="1"]')!.textContent =
    replique.debut;
  ecran.querySelector<HTMLElement>('[data-loading-line="2"]')!.textContent =
    replique.fin;
  ecran.querySelector<HTMLElement>(".case-loading-caption")!.textContent =
    replique.detail;
  derniereReplique = replique.debut;
  try {
    sessionStorage.setItem("enquete-derniere-replique", derniereReplique);
  } catch {
    // Garder simplement la dernière réplique en mémoire sur cette page.
  }
}

function afficher() {
  changerReplique();
  ecran.hidden = false;
  // Rendre la page utilisable si une navigation est interrompue.
  secours = setTimeout(masquer, 10000);
}

// Une seule introduction par onglet ; les liens gardent leur navigation native.
const cleIntroduction = "enquete-introduction-vue";
let premiereOuverture = false;
try {
  premiereOuverture = sessionStorage.getItem(cleIntroduction) !== "oui";
  sessionStorage.setItem(cleIntroduction, "oui");
} catch {
  // Sans stockage, ne pas imposer une animation à chaque navigation.
}
if (premiereOuverture && !mouvementReduit.matches) {
  afficher();
  depart = setTimeout(masquer, 1500);
}
window.addEventListener("pageshow", (event) => {
  if (event.persisted) masquer();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") masquer();
});
