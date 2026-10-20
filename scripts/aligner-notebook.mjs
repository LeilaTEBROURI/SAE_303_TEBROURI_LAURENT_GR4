// Reproduction des cellules du PDF NOTEBOOK FINI, version sans corrections.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as turf from "@turf/turf";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [qPath, hPath, pPath] = process.argv.slice(2);
if (!pPath)
  throw Error("Fournir les fichiers QPV, chaleur, lieux frais originaux.");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const quartiers = read(qPath),
  chaleur = read(hPath),
  lieux = read(pPath);
const round = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const familles = [
  "Espace végétalisé",
  "Eau et rafraîchissement",
  "Bâtiment ou autre lieu",
];
const famille = (c) =>
  c === "Espace végétalisé"
    ? familles[0]
    : [
          "Brumisateur",
          "Fontaine à boire",
          "Fontaine à boire de Bordeaux",
          "Piscine",
          "Plage",
          "Point d'eau accessible",
        ].includes(c)
      ? familles[1]
      : familles[2];
// Même filtre de coordonnées que le notebook, sans dédoublonnage supplémentaire.
const points = lieux.features.flatMap((lieu, index) => {
  const coords = lieu.geometry?.coordinates;
  if (
    !Array.isArray(coords) ||
    coords.length < 2 ||
    !Number.isFinite(Number(coords[0])) ||
    !Number.isFinite(Number(coords[1]))
  )
    return [];
  return [
    turf.point([Number(coords[0]), Number(coords[1])], {
      nom: lieu.properties.nom,
      categorie: lieu.properties.categorie,
      famille: famille(lieu.properties.categorie),
      source_index: index,
      qpv_proches: [],
      qpv_proches_100m: [],
      qpv_proches_300m: [],
      qpv_proches_500m: [],
    }),
  ];
});
const rayons = [100, 300, 500];
const zonesParRayon = Object.fromEntries(
  rayons.map((rayon) => {
    const zones = turf.buffer(quartiers, rayon / 1000, { units: "kilometers" });
    if (!zones || zones.features.length !== quartiers.features.length)
      throw Error("Tampons incohérents : " + rayon);
    return [rayon, zones];
  }),
);
const zones = zonesParRayon[300];
const chaleurCarte = chaleur.features.map((f) => ({
  ...f,
  geometry: {
    ...f.geometry,
    coordinates:
      f.geometry.type === "Polygon"
        ? f.geometry.coordinates.map((a) => [...a].reverse())
        : f.geometry.coordinates.map((p) => p.map((a) => [...a].reverse())),
  },
}));
const heat = chaleurCarte.map((surface) => ({
  surface,
  bbox: turf.bbox(surface),
}));
const chevauche = (a, b) =>
  a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];
const controles = [];
const rows = quartiers.features
  .map((q, index) => {
    const box = turf.bbox(q),
      area = turf.area(q);
    let hot = 0,
      errors = 0;
    for (const h of heat) {
      if (!chevauche(box, h.bbox)) continue;
      try {
        const intersection = turf.intersect(
          turf.featureCollection([q, h.surface]),
        );
        if (intersection) hot += turf.area(intersection);
      } catch {
        errors++;
      }
    }
    const selected = points.filter((p) =>
      turf.booleanPointInPolygon(p, zones.features[index]),
    );
    for (const p of selected) {
      p.properties.qpv_proches.push(q.properties.code_qp);
      p.properties.qpv_proches_300m.push(q.properties.code_qp);
    }
    const r = {
      code_qp: q.properties.code_qp,
      quartier: q.properties.lib_qp,
      communes: q.properties.lib_com,
      surface_qpv_ha: round(area / 1e4),
      surface_chaude_ha: round(hot / 1e4),
      part_chaude_pct: round((100 * hot) / area),
      nombre_lieux_frais: selected.length,
      nombre_lieux_frais_300m: selected.length,
      comptes_300m: Object.fromEntries(
        familles.map((f) => [
          f,
          selected.filter((p) => p.properties.famille === f).length,
        ]),
      ),
    };
    for (const rayon of [100, 500]) {
      const proches = points.filter((p) =>
        turf.booleanPointInPolygon(p, zonesParRayon[rayon].features[index]),
      );
      for (const p of proches)
        p.properties[`qpv_proches_${rayon}m`].push(q.properties.code_qp);
      r[`nombre_lieux_frais_${rayon}m`] = proches.length;
      r[`comptes_${rayon}m`] = Object.fromEntries(
        familles.map((f) => [
          f,
          proches.filter((p) => p.properties.famille === f).length,
        ]),
      );
    }
    controles.push({
      code_qp: r.code_qp,
      quartier: r.quartier,
      part_chaude_pct_non_arrondie: (100 * hot) / area,
      nombre_lieux_frais: selected.length,
      intersections_ignorees: errors,
    });
    console.log(
      r.quartier,
      r.part_chaude_pct,
      r.nombre_lieux_frais,
      "exceptions",
      errors,
    );
    return r;
  })
  .sort((a, b) => a.quartier.localeCompare(b.quartier, "fr"));
for (const [name, n] of [
  ["Dorat", 0],
  ["Thorez Goëlands", 0],
  ["Haut Livrac", 7],
  ["Marne-Capucins", 40],
  ["Quartier Champ de Course", 1],
])
  if (rows.find((r) => r.quartier === name)?.nombre_lieux_frais !== n)
    throw Error("Désaccord avec le PDF : " + name);
if (rows.length !== 23 || new Set(rows.map((r) => r.code_qp)).size !== 23)
  throw Error("Codes incohérents");
const dump = (name, data) =>
  fs.writeFileSync(path.join(root, name), JSON.stringify(data));
const simple = (f) => {
  try {
    return turf.simplify(f, { tolerance: 0.00002, highQuality: true });
  } catch {
    return f;
  }
};
dump("src/assets/indicateurs.json", rows);
dump(
  "src/assets/lieux.json",
  turf.featureCollection(
    points.filter((p) => p.properties.qpv_proches_500m.length),
  ),
);
dump(
  "src/assets/quartiers.json",
  turf.featureCollection(
    quartiers.features.map((q) =>
      simple({
        ...q,
        properties: {
          code_qp: q.properties.code_qp,
          quartier: q.properties.lib_qp,
        },
      }),
    ),
  ),
);
dump(
  "src/assets/chaleur.json",
  turf.featureCollection(
    chaleur.features.map((h) =>
      simple({ ...h, properties: { delta: h.properties.delta } }),
    ),
  ),
);
dump("src/assets/methode-notebook.json", {
  reference: "PDF NOTEBOOK FINI — version sans corrections",
  turf: "7.2.0",
  distance_m: 300,
  distances_site_m: [100, 300, 500],
  ajout_site: "100 et 500 m ; 300 m reste la référence du notebook",
  quartiers: 23,
  chaleur_source: chaleur.features.length,
  lieux_source: lieux.features.length,
  lieux_ponctuels_eligibles: points.length,
  lieux_non_ponctuels_ecartes: lieux.features.length - points.length,
  lieux_affiches: points.filter((p) => p.properties.qpv_proches_500m.length)
    .length,
  intersections_ignorees: controles.reduce(
    (s, c) => s + c.intersections_ignorees,
    0,
  ),
  controles,
});
dump("public/donnees/indicateurs_qpv.json", rows);
const headers = [
  "code_qp",
  "quartier",
  "communes",
  "surface_qpv_ha",
  "surface_chaude_ha",
  "part_chaude_pct",
  ...rayons.flatMap((r) => [
    `nombre_lieux_frais_${r}m`,
    ...familles.map((f) => `${r}m_${f}`),
  ]),
];
const quote = (v) => '"' + String(v).replaceAll('"', '""') + '"';
const lignes = rows.map((r) => [
  r.code_qp,
  r.quartier,
  r.communes,
  r.surface_qpv_ha,
  r.surface_chaude_ha,
  r.part_chaude_pct,
  ...rayons.flatMap((d) => [
    r[`nombre_lieux_frais_${d}m`],
    ...familles.map((f) => r[`comptes_${d}m`][f]),
  ]),
]);
fs.writeFileSync(
  path.join(root, "public/donnees/indicateurs_qpv.csv"),
  "\uFEFF" +
    [headers, ...lignes].map((row) => row.map(quote).join(";")).join("\n"),
);
console.log("Terminé : trois rayons exportés, 300 m inchangé.");
