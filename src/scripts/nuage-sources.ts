import * as Plot from "@observablehq/plot";
import { optionsNuage } from "../utils/nuage-sources";

const conteneur = document.querySelector("[data-nuage-sources] figure > div");
if (conteneur) {
  const { title, subtitle, caption, ...dessin } = optionsNuage();
  const graphique = Plot.plot(dessin);
  graphique
    .querySelectorAll("g[aria-label], g[aria-description]")
    .forEach((groupe) => {
      groupe.removeAttribute("aria-label");
      groupe.removeAttribute("aria-description");
    });
  conteneur.replaceChildren(graphique);
}
