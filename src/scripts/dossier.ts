// Comme dans les TP : un événement de formulaire actualise les textes du dossier.
import quartiers from "../assets/indicateurs.json";
const dossier = document.querySelector<HTMLElement>("[data-dossier]");
if (dossier) {
  const quartier = quartiers.find(
    (q) => q.code_qp === dossier.dataset.dossier,
  )!;
  function afficherDistance(distance: number) {
    if (![100, 300, 500].includes(distance)) return;
    const total =
      quartier[`nombre_lieux_frais_${distance}m` as "nombre_lieux_frais_300m"];
    const counts = quartier[`comptes_${distance}m` as "comptes_300m"];
    const places = dossier!.querySelector("#places-count, #trial-vegetation");
    if (places)
      places.textContent = `${total} ${total === 1 ? "lieu ponctuel" : "lieux ponctuels"}`;
    const water = dossier!.querySelector("#water-count, #trial-water");
    if (water)
      water.textContent = `${counts["Eau et rafraîchissement"]} lieux d’eau`;
    for (const caption of dossier!.querySelectorAll(
      ".distance-caption, .trial-distance",
    ))
      caption.textContent = `Dans le QPV ou à ${distance} m de son contour`;
    const interpretation = dossier!.querySelector(
      "[data-lieux-interpretation]",
    );
    if (interpretation)
      interpretation.textContent = `${total} lieux ponctuels sont recensés dans le QPV ou à ${distance} m de son contour.`;
    for (const el of dossier!.querySelectorAll<HTMLElement>(
      "[data-detail-family]",
    ))
      el.textContent = String(
        counts[el.dataset.detailFamily as keyof typeof counts],
      );
    for (const el of dossier!.querySelectorAll("[data-detail-distance]"))
      el.textContent = String(distance);
  }
  document.addEventListener("distance-change", ((event: CustomEvent) => {
    if (event.detail.code === quartier.code_qp)
      afficherDistance(event.detail.distance);
  }) as EventListener);
  afficherDistance(300);
}
