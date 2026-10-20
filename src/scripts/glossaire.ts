const recherche = document.querySelector<HTMLInputElement>(
  "#recherche-glossaire",
)!;
const boutons = [
  ...document.querySelectorAll<HTMLButtonElement>("[data-glossary-theme]"),
];
const sections = [
  ...document.querySelectorAll<HTMLElement>("[data-glossary-section]"),
];
const mots = [
  ...document.querySelectorAll<HTMLElement>("[data-glossary-word]"),
];
const statut = document.querySelector<HTMLElement>("#resultats-glossaire")!;
const aucunResultat = document.querySelector<HTMLElement>("#glossaire-vide")!;
let theme = "";

function normaliser(texte: string) {
  return texte
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function filtrer() {
  const termes = normaliser(recherche.value)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  let total = 0;
  for (const mot of mots) {
    const correspond =
      (!theme || mot.dataset.rubrique === theme) &&
      termes.every((terme) =>
        normaliser(mot.dataset.glossaryWord ?? "").includes(terme),
      );
    mot.hidden = !correspond;
    if (correspond) total++;
  }
  for (const section of sections) {
    section.hidden = !section.querySelector(
      "[data-glossary-word]:not([hidden])",
    );
  }
  for (const bouton of boutons) {
    bouton.setAttribute(
      "aria-pressed",
      String(bouton.dataset.glossaryTheme === theme),
    );
  }
  statut.textContent = `${total} ${total === 1 ? "mot trouvé" : "mots trouvés"}.`;
  aucunResultat.hidden = total > 0;
}

recherche.addEventListener("input", filtrer);
for (const bouton of boutons) {
  bouton.addEventListener("click", () => {
    // Un second clic sur la catégorie réaffiche tous les thèmes.
    theme =
      theme === bouton.dataset.glossaryTheme
        ? ""
        : bouton.dataset.glossaryTheme!;
    filtrer();
  });
}

document
  .querySelector<HTMLButtonElement>("#reinitialiser-glossaire")
  ?.addEventListener("click", () => {
    recherche.value = "";
    theme = "";
    filtrer();
    recherche.focus();
  });

window.addEventListener("hashchange", () => {
  recherche.value = "";
  theme = "";
  filtrer();
  document
    .getElementById(decodeURIComponent(location.hash.slice(1)))
    ?.scrollIntoView();
});
