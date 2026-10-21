import fs from "node:fs";
import { fileURLToPath } from "node:url";
import * as turf from "@turf/turf";
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const root = fileURLToPath(new URL("..", import.meta.url));
const [qpvPath, lieuxPath, fondPath] = process.argv.slice(2);
if (!fondPath)
  throw new Error("Fournir les fichiers QPV, lieux frais et routes/eaux.");
const q = read(qpvPath);
const lieux = read(lieuxPath);
const old = read(root + "/src/assets/indicateurs.json");
const famille = (c) =>
  c === "Espace végétalisé"
    ? c
    : [
          "Brumisateur",
          "Fontaine à boire",
          "Fontaine à boire de Bordeaux",
          "Piscine",
          "Plage",
          "Point d'eau accessible",
        ].includes(c)
      ? "Eau et rafraîchissement"
      : "Bâtiment ou autre lieu";
const zones = turf.buffer(q, 0.3, { units: "kilometers" });
const rows = q.features.map((f, i) => {
  const selected = lieux.features.filter((l) =>
    turf.booleanIntersects(l, zones.features[i]),
  );
  const ancien = old.find((d) => d.code_qp === f.properties.code_qp);
  return {
    code_qp: ancien.code_qp,
    quartier: ancien.quartier,
    communes: ancien.communes,
    surface_qpv_ha: ancien.surface_qpv_ha,
    surface_chaude_ha: ancien.surface_chaude_ha,
    part_chaude_pct: ancien.part_chaude_pct,
    nombre_lieux_frais: selected.length,
    comptes: Object.fromEntries(
      [
        "Espace végétalisé",
        "Eau et rafraîchissement",
        "Bâtiment ou autre lieu",
      ].map((x) => [
        x,
        selected.filter((l) => famille(l.properties.categorie) === x).length,
      ]),
    ),
  };
});
fs.writeFileSync(
  root + "/src/assets/synthese-notebook.json",
  JSON.stringify(rows),
);
const raw = read(fondPath);
const retenus = raw.features.flatMap((f) => {
  const eau =
    ["river", "canal"].includes(f.properties.waterway) ||
    String(f.properties.name).includes("Garonne");
  const route = ["motorway", "trunk", "primary", "secondary"].includes(
    f.properties.highway,
  );
  if (!eau && !route) return [];
  const g = {
    ...f,
    properties: { typeCarte: eau ? "Cours d’eau" : "Route principale" },
  };
  return [turf.simplify(g, { tolerance: 0.00002, highQuality: true })];
});
fs.writeFileSync(
  root + "/src/assets/fond-carte.json",
  JSON.stringify({ type: "FeatureCollection", features: retenus }),
);
console.log(
  JSON.stringify({
    quartiers: rows.length,
    zero: rows.filter((x) => !x.nombre_lieux_frais).map((x) => x.quartier),
    max: rows.reduce((a, b) =>
      a.nombre_lieux_frais > b.nombre_lieux_frais ? a : b,
    ).nombre_lieux_frais,
    geometries: retenus.length,
    size: fs.statSync(root + "/src/assets/fond-carte.json").size,
  }),
);

fs.writeFileSync(
  root + "/public/donnees/synthese_notebook.json",
  JSON.stringify(rows),
);
const colonnes = [
  "quartier",
  "communes",
  "part_chaude_pct",
  "nombre_lieux_frais",
];
const cellule = (valeur) => '"' + String(valeur).replaceAll('"', '""') + '"';
fs.writeFileSync(
  root + "/public/donnees/synthese_notebook.csv",
  [
    colonnes.join(","),
    ...rows.map((r) => colonnes.map((k) => cellule(r[k])).join(",")),
  ].join("\n") + "\n",
);
