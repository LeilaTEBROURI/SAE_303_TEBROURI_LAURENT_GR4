// Comme les filtres du TP4 : lire les sélections, puis actualiser les résultats.
import quartiers from "../assets/indicateurs.json";
const selectA = document.querySelector<HTMLSelectElement>("#quartier-a")!;
const selectB = document.querySelector<HTMLSelectElement>("#quartier-b")!;
const selectDistance = document.querySelector<HTMLSelectElement>(
  "#distance-comparaison",
)!;
const format = (n: number) =>
  n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });

function afficherQuartier(side: string, code: string, distance: number) {
  const q = quartiers.find((q) => q.code_qp === code)!;
  const card = document.querySelector<HTMLElement>(
    `[data-comparison="${side}"]`,
  )!;
  const values: Record<string, string> = {
    quartier: q.quartier,
    communes: q.communes,
    part_chaude_pct: format(q.part_chaude_pct),
    surface_qpv_ha: format(q.surface_qpv_ha),
    surface_chaude_ha: format(q.surface_chaude_ha),
    nombre_lieux_frais: String(
      q[`nombre_lieux_frais_${distance}m` as "nombre_lieux_frais_300m"],
    ),
  };
  for (const el of card.querySelectorAll<HTMLElement>("[data-field]"))
    el.textContent = values[el.dataset.field!];
  for (const el of card.querySelectorAll("[data-distance]"))
    el.textContent = String(distance);
  const counts = q[`comptes_${distance}m` as "comptes_300m"];
  for (const el of card.querySelectorAll<HTMLElement>("[data-family]"))
    el.textContent = String(counts[el.dataset.family as keyof typeof counts]);
  card.querySelector<HTMLProgressElement>("[data-heat-bar]")!.value =
    q.part_chaude_pct;
  card.querySelector<HTMLAnchorElement>("[data-dossier-link]")!.href =
    `/quartiers/${q.code_qp}/`;
  return q;
}
function afficherComparaison() {
  const distance = Number(selectDistance.value);
  const a = afficherQuartier("a", selectA.value, distance);
  const b = afficherQuartier("b", selectB.value, distance);
  document.querySelector("#comparison-status")!.textContent =
    a.code_qp === b.code_qp
      ? "Tu compares le même quartier dans les deux dossiers. Choisis un autre quartier pour observer les différences."
      : `${a.quartier} et ${b.quartier} · rayon commun de ${distance} m. Écart de surface chaude : ${format(Math.abs(a.part_chaude_pct - b.part_chaude_pct))} points de pourcentage.`;
}
[selectA, selectB, selectDistance].forEach((select) =>
  select.addEventListener("change", afficherComparaison),
);
afficherComparaison();
