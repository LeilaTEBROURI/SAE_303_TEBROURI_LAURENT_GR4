// Fonction reprise sans modification du notebook Observable du 21 octobre.
export function _nuageChaleurFraicheur(Plot){return(
(donnees) => {
  const qpvPrioritaire = donnees.reduce(
    (maximum, d) =>
      d.part_chaude_pct > maximum.part_chaude_pct ? d : maximum
  );

  return Plot.plot({
  title: "Chaleur et lieux frais recensés dans les QPV",
subtitle: `${qpvPrioritaire.quartier} cumule la part de surface chaude la plus élevée (${qpvPrioritaire.part_chaude_pct.toFixed(1)} %) et ${qpvPrioritaire.nombre_lieux_frais} lieux frais recensés à proximité.`,
    caption: "Sources : Bordeaux Métropole, surfaces chaudes relevées le 11 juillet 2022 ; a’urba, carte « Espaces fraîcheur » ; ANCT, contours des QPV 2024.",
    width: 750,
    height: 550,
    style: {
      background: "#fff8e6",
      color: "#1c1917",
      fontFamily: "Georgia, serif"
    },
    x: {
      label: "Part de surface chaude (%)",
      domain: [0, 100],
      grid: true
    },
    y: {
      label: "Nombre de lieux frais recensés",
      grid: true
    },
    marks: [
      Plot.dot(donnees, {
        x: "part_chaude_pct",
        y: "nombre_lieux_frais",
        r: 7,
        fill: d =>
          d.quartier === qpvPrioritaire.quartier
            ? "#d4a72c"
            : "#6b3f2a",
        stroke: "#fff8e6",
        strokeWidth: 1
      }),
      Plot.tip(
        donnees,
        Plot.pointer({
          x: "part_chaude_pct",
          y: "nombre_lieux_frais",
          title: d =>
            `${d.quartier}\n` +
            `${d.part_chaude_pct.toFixed(1)} % de surface chaude\n` +
            `${d.nombre_lieux_frais} lieux frais recensés`
        })
      ),
      Plot.text([qpvPrioritaire], {
        x: "part_chaude_pct",
        y: "nombre_lieux_frais",
        text: "quartier",
        dx: -10,
        dy: -12,
        textAnchor: "end",
        fill: "#1c1917",
        fontWeight: "bold"
      }),
      Plot.ruleX([0], {
        stroke: "#1c1917"
      }),
      Plot.ruleY([0], {
        stroke: "#1c1917"
      })
    ]
  });
}
)}
