import * as Plot from "@observablehq/plot";
import type { GeoJsonObject } from "geojson";
import donnees from "../assets/synthese-notebook.json";
import quartiers from "../assets/quartiers.json";
import chaleur from "../assets/chaleur.json";
import fond from "../assets/fond-carte.json";
const sourceChaleur =
  "Sources : Bordeaux Métropole, surfaces chaudes du 11 juillet 2022 ; ANCT, contours des QPV 2024. Calcul : surface chaude rapportée à la superficie totale de chaque QPV.";
const sourceLieux =
  "Sources : a’urba, carte « Espaces fraîcheur », extraction du 19 octobre 2026 ; ANCT, contours des QPV 2024. Lieux dont la géométrie rencontre le QPV ou son tampon de 300 m.";
const routes = {
  type: "FeatureCollection",
  features: fond.features.filter(
    (f) => f.properties.typeCarte === "Route principale",
  ),
} as GeoJsonObject;
const eaux = {
  type: "FeatureCollection",
  features: fond.features.filter(
    (f) => f.properties.typeCarte === "Cours d’eau",
  ),
} as GeoJsonObject;
// Même inversion des anneaux que la cellule chaleurCarte du notebook.
// D3 attend ici des anneaux extérieurs orientés dans le sens horaire.
const chaleurPlot = {
  type: "FeatureCollection",
  features: chaleur.features.map((feature) => ({
    ...feature,
    geometry: {
      ...feature.geometry,
      coordinates: feature.geometry.type === "Polygon"
        ? feature.geometry.coordinates.map((anneau) => [...anneau].reverse())
        : feature.geometry.coordinates.map((polygone) =>
            polygone.map((anneau) => [...anneau].reverse())),
    },
  })),
} as GeoJsonObject;
const geoQuartiers = quartiers as GeoJsonObject;
const parChaleur = [...donnees].sort(
  (a, b) => b.part_chaude_pct - a.part_chaude_pct,
);
const parLieux = [...donnees].sort(
  (a, b) => a.nombre_lieux_frais - b.nombre_lieux_frais,
);
const style = {
  background: "transparent",
  color: "#2f2f2f",
  fontFamily: "Inter, sans-serif",
};
const fondMarks = () => [
  Plot.geo(eaux, { stroke: "#64748b", strokeWidth: 1.2, fill: "none" }),
  Plot.geo(routes, {
    stroke: "#8f8577",
    strokeWidth: 0.5,
    strokeOpacity: 0.45,
    fill: "none",
  }),
];
export const graphiquesNotebook: Plot.PlotOptions[] = [
  {
    title:
      "Les surfaces chaudes sont réparties dans plusieurs secteurs de Bordeaux Métropole",
    subtitle:
      "Les surfaces chaudes apparaissent dans et autour de plusieurs QPV, mais leur étendue varie selon les secteurs.",
    caption:
      sourceChaleur +
      " Fond : OpenStreetMap, routes principales et cours d’eau, extraction du 21 octobre 2026, ODbL.",
    width: 850,
    height: 550,
    style,
    projection: { type: "mercator", domain: geoQuartiers },
    marks: [
      Plot.geo(chaleurPlot, {
        fill: "#fedcc5",
        stroke: "none",
      }),
      ...fondMarks(),
      Plot.geo(geoQuartiers, {
        fill: "none",
        stroke: "#60457b",
        strokeWidth: 1.5,
      }),
    ],
    ariaLabel:
      "Surfaces chaudes en orange, quartiers prioritaires en violet, routes en gris et cours d’eau en bleu.",
  },
  {
    title: "Thorez Goëlands présente la part de surface chaude la plus élevée",
    subtitle:
      "Plusieurs QPV dépassent 90 % de surface chaude, tandis que Carriet se situe presque entièrement hors des surfaces chaudes relevées.",
    caption: sourceChaleur,
    width: 1000,
    height: 650,
    marginLeft: 330,
    marginRight: 55,
    style,
    x: { domain: [0, 105], label: "Part de surface chaude (%)", grid: true },
    y: { domain: parChaleur.map((d) => d.quartier), label: null },
    marks: [
      Plot.barX(parChaleur, {
        x: "part_chaude_pct",
        y: "quartier",
        fill: "#b34d25",
      }),
      Plot.text(parChaleur, {
        x: "part_chaude_pct",
        y: "quartier",
        text: (d) =>
          d.part_chaude_pct.toLocaleString("fr-FR", {
            maximumFractionDigits: 1,
          }),
        dx: 6,
        textAnchor: "start",
      }),
    ],
    ariaLabel:
      "Classement des 23 quartiers par surface chaude, de Thorez Goëlands à Carriet.",
  },
  {
    title: "La majorité des QPV ont plus de 50 % de surface chaude",
    subtitle:
      "18 des 23 QPV se situent entre 50 % et 100 % de surface chaude, avec une concentration dans les valeurs élevées.",
    caption: sourceChaleur,
    width: 850,
    height: 420,
    style,
    x: { domain: [0, 100], label: "Part de surface chaude (%)", grid: true },
    y: { label: "Nombre de QPV", grid: true },
    marks: [
      Plot.rectY(donnees, {
        ...Plot.binX({ y: "count" }, { x: "part_chaude_pct", thresholds: 10 }),
        fill: "#b34d25",
        stroke: "#fffbee",
      }),
      Plot.ruleX([50], { stroke: "#c49e4b", strokeWidth: 2 }),
      Plot.ruleY([0]),
    ],
    ariaLabel:
      "Histogramme des parts de surface chaude : 18 quartiers dépassent 50 %.",
  },
  {
    title: "Part de surface chaude par QPV",
    subtitle:
      "Thorez Goëlands atteint 100 % de surface chaude, tandis que plusieurs quartiers restent sous 50 %.",
    caption:
      sourceChaleur + " Fond : OpenStreetMap, routes et cours d’eau, ODbL.",
    width: 850,
    height: 550,
    style,
    projection: { type: "mercator", domain: geoQuartiers },
    color: {
      type: "linear",
      domain: [0, 100],
      range: ["#f6d365", "#6b2715"],
      legend: false,
      label: "Part de surface chaude (%)",
    },
    marks: [
      ...fondMarks(),
      Plot.geo(
        {
          type: "FeatureCollection",
          features: quartiers.features.map((f) => ({
            ...f,
            properties: {
              ...f.properties,
              part: donnees.find((d) => d.code_qp === f.properties.code_qp)!
                .part_chaude_pct,
            },
          })),
        } as GeoJsonObject,
        { fill: (f) => f.properties.part, stroke: "#2f2f2f", strokeWidth: 1.3 },
      ),
    ],
    ariaLabel:
      "Carte colorée selon la part de surface chaude de chacun des 23 quartiers.",
  },
  {
    title: "Composition des lieux frais recensés par QPV",
    subtitle:
      "Le nombre total et les types de lieux frais recensés varient selon les quartiers prioritaires.",
    caption: sourceLieux,
    width: 1000,
    height: 650,
    marginLeft: 330,
    style,
    x: { label: "Nombre de lieux frais recensés", grid: true },
    y: { label: null, domain: parLieux.map((d) => d.quartier) },
    color: {
      domain: [
        "Espace végétalisé",
        "Eau et rafraîchissement",
        "Bâtiment ou autre lieu",
      ],
      range: ["#2c6d4b", "#2d7e9e", "#60457b"],
      legend: true,
      label: "Type de lieu frais",
    },
    marks: [
      Plot.barX(
        donnees.flatMap((d) =>
          Object.entries(d.comptes).map(([famille, nombre]) => ({
            quartier: d.quartier,
            famille,
            nombre,
          })),
        ),
        { x: "nombre", y: "quartier", fill: "famille" },
      ),
      Plot.ruleX([0]),
    ],
    ariaLabel:
      "Barres empilées montrant les trois familles de lieux frais dans chaque quartier et à 300 mètres.",
  },
  {
    title: "Les lieux frais recensés varient fortement d’un QPV à l’autre",
    subtitle:
      "Marne-Capucins se distingue nettement, tandis que plusieurs QPV recensent très peu de lieux frais à proximité.",
    caption: sourceLieux,
    width: 1000,
    height: 650,
    marginLeft: 330,
    marginRight: 55,
    style,
    x: { label: "Nombre de lieux frais proches", grid: true },
    y: { label: null, domain: parLieux.map((d) => d.quartier) },
    marks: [
      Plot.barX(parLieux, {
        x: "nombre_lieux_frais",
        y: "quartier",
        fill: (d) => (d.quartier === "Marne-Capucins" ? "#c49e4b" : "#60457b"),
      }),
      Plot.text(parLieux, {
        x: "nombre_lieux_frais",
        y: "quartier",
        text: "nombre_lieux_frais",
        dx: 6,
        textAnchor: "start",
      }),
      Plot.ruleX([0]),
    ],
    ariaLabel:
      "Classement des lieux frais : Marne-Capucins en compte 41, Thorez Goëlands aucun.",
  },
];
