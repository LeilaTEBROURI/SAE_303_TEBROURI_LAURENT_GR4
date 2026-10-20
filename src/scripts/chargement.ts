const ecran = document.querySelector<HTMLElement>("#chargement-enquete")!;
const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)");
let enCours = false;
let depart: ReturnType<typeof setTimeout> | undefined;
let secours: ReturnType<typeof setTimeout> | undefined;

function masquer() {
  clearTimeout(depart);
  clearTimeout(secours);
  ecran.hidden = true;
  enCours = false;
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
  enCours = true;
  ecran.hidden = false;
  // Rendre la page utilisable si une navigation est interrompue.
  secours = setTimeout(masquer, 10000);
}

// Navigation classique Astro : les contrôles, téléchargements et liens externes restent natifs.
document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const lien = event.target.closest<HTMLAnchorElement>("a[href]");
  if (
    !lien ||
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    lien.hasAttribute("download") ||
    (lien.target && lien.target !== "_self")
  )
    return;
  const destination = new URL(lien.href, window.location.href);
  if (
    destination.origin !== location.origin ||
    !["http:", "https:"].includes(destination.protocol) ||
    (destination.pathname === location.pathname &&
      destination.search === location.search)
  )
    return;
  event.preventDefault();
  if (enCours) return;
  afficher();
  depart = setTimeout(
    () => {
      window.location.assign(destination.href);
    },
    mouvementReduit.matches ? 0 : 1500,
  );
});

window.addEventListener("pageshow", masquer);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") masquer();
});

document
  .querySelector<HTMLButtonElement>("#tester-chargement")
  ?.addEventListener("click", () => {
    if (enCours) return;
    afficher();
    depart = setTimeout(masquer, mouvementReduit.matches ? 1000 : 3000);
  });
