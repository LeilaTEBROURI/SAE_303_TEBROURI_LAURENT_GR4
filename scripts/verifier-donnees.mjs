import assert from "node:assert/strict";
import fs from "node:fs";
const read = (p) =>
  JSON.parse(fs.readFileSync(new URL(p, import.meta.url), "utf8"));
const rows = read("../src/assets/indicateurs.json");
const lieux = read("../src/assets/lieux.json");
const meta = read("../src/assets/methode-notebook.json");
assert.equal(rows.length, 23);
assert.equal(new Set(rows.map((q) => q.code_qp)).size, 23);
assert.equal(meta.turf, "7.2.0");
assert.equal(meta.distance_m, 300);
assert.equal(meta.lieux_source, 1396);
assert.equal(meta.lieux_ponctuels_eligibles, 1020);
assert.equal(meta.lieux_non_ponctuels_ecartes, 376);
assert.equal(meta.intersections_ignorees, 0);
assert.deepEqual(rows, read("../public/donnees/indicateurs_qpv.json"));
for (const q of rows) {
  assert(
    q.surface_qpv_ha > 0 && q.part_chaude_pct >= 0 && q.part_chaude_pct <= 100,
  );
  for (const rayon of [100, 300, 500]) {
    const counts = q[`comptes_${rayon}m`];
    const total = q[`nombre_lieux_frais_${rayon}m`];
    assert.equal(
      Object.values(counts).reduce((a, b) => a + b, 0),
      total,
    );
    const places = lieux.features.filter((p) =>
      p.properties[`qpv_proches_${rayon}m`].includes(q.code_qp),
    );
    assert.equal(places.length, total, `${q.quartier} / ${rayon}`);
    for (const [famille, n] of Object.entries(counts))
      assert.equal(
        places.filter((p) => p.properties.famille === famille).length,
        n,
      );
  }
  assert.equal(q.nombre_lieux_frais, q.nombre_lieux_frais_300m);
  assert(
    q.nombre_lieux_frais_100m <= q.nombre_lieux_frais_300m &&
      q.nombre_lieux_frais_300m <= q.nombre_lieux_frais_500m,
  );
  assert(!Object.keys(q).some((k) => k.includes("vegetation")));
}
for (const p of lieux.features) {
  assert.equal(p.geometry.type, "Point");
  assert(p.geometry.coordinates.every(Number.isFinite));
  assert(
    p.properties.qpv_proches.every((code) =>
      rows.some((q) => q.code_qp === code),
    ),
  );
}
for (const [name, n] of [
  ["Dorat", 0],
  ["Thorez Goëlands", 0],
  ["Haut Livrac", 7],
  ["Marne-Capucins", 40],
  ["Quartier Champ de Course", 1],
  ["Carle Vernet - Terres Neuves", 8],
])
  assert.equal(rows.find((q) => q.quartier === name).nombre_lieux_frais, n);
const csv = fs.readFileSync(
  new URL("../public/donnees/indicateurs_qpv.csv", import.meta.url),
  "utf8",
);
assert.equal(csv.trim().split("\n").length, 24);
console.log(
  "69 cas vérifiés : points, catégories et totaux cohérents aux trois rayons ; référence 300 m conservée.",
);
