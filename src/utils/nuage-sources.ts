import * as Plot from "@observablehq/plot";
import indicateurs from "../assets/synthese-notebook.json";
import { _nuageChaleurFraicheur } from "./nuage-notebook.js";

// Réutiliser la fonction originale avec les mêmes données côté serveur et client.
export function optionsNuage(): Plot.PlotOptions {
  let options: Plot.PlotOptions | undefined;
  const graphique = _nuageChaleurFraicheur({
    ...Plot,
    plot: (configuration: Plot.PlotOptions) => {
      options = configuration;
      return configuration;
    },
  });
  graphique(indicateurs);
  if (!options) throw new Error("Le graphique du notebook n’a pas produit d’options.");
  return {
    ...options,
    // L’habillage reste celui du site.
    style: { background: "transparent", color: "#2f2f2f", fontFamily: "inherit" },
    ariaLabel: "Chaleur et lieux recensés dans les 23 QPV : Thorez Goëlands présente 100 % de surface chaude et aucun lieu à 300 m. Marne-Capucins compte 41 lieux.",
  };
}
