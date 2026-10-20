// Comme les contrôles des TP : sélectionner les éléments, puis écouter les événements.
const toggle = document.querySelector<HTMLInputElement>("#mode-loupe")!;
const light = document.querySelector<HTMLElement>("#spotlight")!;
const storageKey = "enquete-mode-loupe";

function afficherModeLoupe(active: boolean) {
  toggle.checked = active;
  if (active) {
    document.documentElement.dataset.modeLoupe = "active";
  } else {
    delete document.documentElement.dataset.modeLoupe;
  }
}

function restaurerModeLoupe() {
  let active = document.documentElement.dataset.modeLoupe === "active";
  try {
    const preference = localStorage.getItem(storageKey);
    if (preference !== null) active = preference === "active";
  } catch {
    // En navigation avec stockage bloqué, conserver le fonctionnement de la page.
  }
  afficherModeLoupe(active);
}

function enregistrerModeLoupe(active: boolean) {
  afficherModeLoupe(active);
  try {
    localStorage.setItem(storageKey, active ? "active" : "inactif");
  } catch {
    // Une erreur de stockage ne doit pas bloquer le bouton.
  }
}

toggle.addEventListener("change", () => enregistrerModeLoupe(toggle.checked));
document.addEventListener("pointermove", (event) => {
  light.style.setProperty("--x", `${event.clientX}px`);
  light.style.setProperty("--y", `${event.clientY}px`);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") enregistrerModeLoupe(false);
});

// Synchroniser le bouton au chargement et lors d’un retour avec l’historique.
restaurerModeLoupe();
window.addEventListener("pageshow", restaurerModeLoupe);
