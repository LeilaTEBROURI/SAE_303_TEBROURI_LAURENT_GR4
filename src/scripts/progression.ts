import quartiers from "../assets/indicateurs.json";
const codes = quartiers.map((q) => q.code_qp);
const storageKey = "dossiers-consultes";

function lireDossiers(): string[] {
  const data: unknown = JSON.parse(localStorage.getItem(storageKey) || "[]");
  return Array.isArray(data)
    ? [
        ...new Set(
          data.filter(
            (code): code is string =>
              typeof code === "string" && codes.includes(code),
          ),
        ),
      ]
    : [];
}

function afficherProgression() {
  let seen: string[] = [];
  try {
    seen = lireDossiers();
    const code =
      document.querySelector<HTMLElement>("[data-dossier]")?.dataset.dossier;
    if (code && codes.includes(code) && !seen.includes(code)) {
      seen.push(code);
      localStorage.setItem(storageKey, JSON.stringify(seen));
    }
  } catch {
    const note = document.querySelector("[data-progress-note]");
    if (note)
      note.textContent =
        "Le stockage est indisponible : la progression ne peut pas être mémorisée.";
  }
  const text = document.querySelector("[data-progress-text]");
  if (text)
    text.textContent =
      seen.length === codes.length
        ? `Les ${codes.length} dossiers sont consultés. À toi de croiser les indices !`
        : `${seen.length} dossier${seen.length > 1 ? "s" : ""} consulté${seen.length > 1 ? "s" : ""} sur ${codes.length}`;
  const bar = document.querySelector<HTMLProgressElement>(
    "[data-progress-bar]",
  );
  if (bar) bar.value = seen.length;
  for (const label of document.querySelectorAll<HTMLElement>(
    ".dossier-status",
  )) {
    label.textContent = seen.includes(label.dataset.code!)
      ? "Consulté ✓"
      : "À explorer";
  }
}

afficherProgression();
window.addEventListener("pageshow", afficherProgression);
window.addEventListener("storage", (event) => {
  if (event.key === storageKey) afficherProgression();
});
