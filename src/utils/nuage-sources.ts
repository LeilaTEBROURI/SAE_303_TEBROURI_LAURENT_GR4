import * as Plot from "@observablehq/plot";
import indicateurs from "../assets/synthese-notebook.json";
const format = (n: number) =>
  n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
export function optionsNuage(interactif = false): Plot.PlotOptions {
  return {
    title: "Chaleur et lieux frais recensés dans les QPV",
    subtitle:
      "Thorez Goëlands cumule 100 % de surface chaude et aucun lieu frais recensé dans le quartier ou à 300 m.",
    caption:
      "Sources : Bordeaux Métropole, chaleur du 11 juillet 2022 ; a’urba, Espaces fraîcheur, extraction du 19 octobre 2026 ; ANCT, contours QPV 2024. Comptage de toutes les géométries rencontrant le tampon de 300 m.",
    width: 750,
    height: 550,
    marginLeft: 65,
    x: { domain: [0, 100], label: "Part de surface chaude (%)", grid: true },
    y: { label: "Nombre de lieux frais recensés à 300 m", grid: true },
    marks: [
      Plot.dot(indicateurs, {
        x: "part_chaude_pct",
        y: "nombre_lieux_frais",
        r: 7,
        fill: "#de6d37",
        stroke: "white",
        title: interactif
          ? undefined
          : (d) =>
              `${d.quartier}\n${format(d.part_chaude_pct)} % de surface chaude\n${d.nombre_lieux_frais} lieux recensés`,
      }),
      Plot.text(
        indicateurs.filter((d) => d.code_qp === "QN03324N"),
        {
          x: "part_chaude_pct",
          y: "nombre_lieux_frais",
          text: "quartier",
          dx: -10,
          dy: -12,
          textAnchor: "end",
        },
      ),
      ...(interactif
        ? [
            Plot.tip(
              indicateurs,
              Plot.pointer({
                x: "part_chaude_pct",
                y: "nombre_lieux_frais",
                title: (d: (typeof indicateurs)[number]) =>
                  `${d.quartier}\n${format(d.part_chaude_pct)} % de surface chaude\n${d.nombre_lieux_frais} lieux recensés à 300 m`,
                fill: "#fffbee",
                stroke: "#2f2f2f",
                fontSize: 13,
                lineWidth: 38,
              }),
            ),
          ]
        : []),
    ],
    ariaLabel:
      "Chaleur et lieux recensés dans les 23 QPV : Thorez Goëlands présente 100 % de surface chaude et aucun lieu ponctuel à 300 m. Marne-Capucins compte 41 lieux.",
  };
}
