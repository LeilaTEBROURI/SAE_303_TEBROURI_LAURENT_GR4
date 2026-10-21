import { adresseQuartier } from "../utils/quartiers";
// Même organisation que TP7/leaflet : données → carte → fonction de rendu → événements.
import L from "leaflet";
import type { GeoJsonObject, Feature } from "geojson";
import quartiers from "../assets/quartiers.json";
import chaleur from "../assets/chaleur.json";
import metropole from "../assets/metropole.json";
import fondCarte from "../assets/fond-carte.json";
import lieux from "../assets/lieux.json";
import indicateurs from "../assets/indicateurs.json";

const explorer = document.querySelector<HTMLElement>("[data-explorer]");
if (explorer) {
  const mapElement = explorer.querySelector<HTMLElement>("[data-map]")!;
  const select = explorer.querySelector<HTMLSelectElement>("[data-quartier]");
  const detail = explorer.dataset.detail === "true";
  const number = (n: number) =>
    n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
  let code = explorer.dataset.code || "";
  let distance = 300;
  const map = L.map(mapElement, {
    scrollWheelZoom: false,
    attributionControl: false,
  });
  // Séparer le fond, la chaleur et les quartiers garde les calques lisibles.
  map.createPane("contexte");
  map.getPane("contexte")!.style.zIndex = "300";
  map.createPane("chaleur");
  map.getPane("chaleur")!.style.zIndex = "350";
  const heatRenderer = L.canvas({ pane: "chaleur" });
  // Même contour métropolitain de l’API Géo que dans le notebook.
  const context = L.geoJSON(metropole as GeoJsonObject, {
    pane: "contexte",
    interactive: false,
    style: {
      color: "#c5c0b4",
      weight: 1,
      fillColor: "#eae6db",
      fillOpacity: 1,
    },
  }).addTo(map);
  const allBounds = context.getBounds();
  map.fitBounds(allBounds, { padding: [12, 12] });
  const heatLayer = L.geoJSON(chaleur as GeoJsonObject, {
    interactive: false,
    style: {
      renderer: heatRenderer,
      color: "#de6d37",
      weight: 0,
      fillColor: "#de6d37",
      fillOpacity: 0.62,
    },
  }).addTo(map);
  map.createPane("reperes");
  map.getPane("reperes")!.style.zIndex = "375";
  const fondRenderer = L.canvas({ pane: "reperes" });
  L.geoJSON(fondCarte as GeoJsonObject, {
    pane: "reperes",
    interactive: false,
    style: (feature) => ({
      renderer: fondRenderer,
      color:
        feature?.properties.typeCarte === "Cours d’eau" ? "#64748b" : "#8f8577",
      weight: feature?.properties.typeCarte === "Cours d’eau" ? 1.5 : 0.7,
      opacity: 0.65,
      fill: false,
    }),
  }).addTo(map);
  const qpLayer = L.geoJSON(quartiers as GeoJsonObject, {
    style: {
      color: "#60457b",
      weight: 2,
      fillColor: "#fffbee",
      fillOpacity: 0,
    },
    onEachFeature(feature, layer) {
      layer.bindTooltip(feature.properties.quartier, { sticky: true });
      layer.on("click", () => {
        if (detail && feature.properties.code_qp !== code) {
          window.location.href = adresseQuartier(feature.properties);
          return;
        }
        code = feature.properties.code_qp;
        if (select) select.value = code;
        renderSelection(true);
      });
      // Un lien clavier par quartier complète la sélection accessible par liste.
      layer.on("add", () => {
        const el = (layer as L.Path).getElement();
        if (el) {
          el.setAttribute("tabindex", "0");
          el.setAttribute("role", "button");
          el.setAttribute(
            "aria-label",
            `Sélectionner ${feature.properties.quartier}`,
          );
          el.addEventListener("keydown", (e) => {
            if (
              (e as KeyboardEvent).key === "Enter" ||
              (e as KeyboardEvent).key === " "
            ) {
              e.preventDefault();
              if (detail && feature.properties.code_qp !== code) {
                window.location.href = adresseQuartier(feature.properties);
                return;
              }
              code = feature.properties.code_qp;
              if (select) select.value = code;
              renderSelection(true);
            }
          });
        }
      });
    },
  }).addTo(map);
  const placesLayer = L.featureGroup().addTo(map);
  const palette = (famille: string) =>
    famille === "Espace végétalisé"
      ? "#2c6d4b"
      : famille === "Bâtiment ou autre lieu"
        ? "#7c6995"
        : "#2d7e9e";
  const counts = explorer.querySelector<HTMLElement>("[data-counts]")!;
  function renderPlaces() {
    placesLayer.clearLayers();
    const selected = lieux.features.filter((f) =>
      !code
        ? f.properties[`qpv_proches_${distance}m` as "qpv_proches_300m"]
            .length > 0
        : f.properties[
            `qpv_proches_${distance}m` as "qpv_proches_300m"
          ].includes(code),
    );
    for (const feature of selected) {
      const color = palette(feature.properties.famille);
      const layer = L.geoJSON(feature as Feature, {
        style: { color, weight: 1, fillColor: color, fillOpacity: 0.48 },
        pointToLayer: (_f, latlng) =>
          L.circleMarker(latlng, {
            radius: detail ? 5 : 3,
            weight: 1,
            color: "#fffbee",
            fillColor: color,
            fillOpacity: 1,
          }),
      });
      const popup = document.createElement("div");
      const heading = document.createElement("strong");
      heading.textContent = feature.properties.nom;
      const family = document.createElement("p");
      family.textContent = feature.properties.famille;
      const note = document.createElement("small");
      note.textContent = "Entrée, accès et horaires à vérifier.";
      popup.append(heading, family, note);
      // La même fiche s’ouvre au survol ; le clic reste disponible sur mobile.
      layer.bindPopup(popup, { autoPan: false }).addTo(placesLayer);
      let fermeture: number | undefined;
      const garderOuvert = () => window.clearTimeout(fermeture);
      const fermerApresSurvol = () => {
        garderOuvert();
        fermeture = window.setTimeout(() => layer.closePopup(), 180);
      };
      layer.on("mouseover", (event: L.LeafletMouseEvent) => {
        garderOuvert();
        layer.openPopup(event.latlng);
      });
      layer.on("mouseout", fermerApresSurvol);
      layer.on("popupopen", () => {
        const fiche = layer.getPopup()?.getElement();
        if (fiche) {
          // Laisser le temps de déplacer le pointeur du point vers la fiche.
          fiche.onmouseenter = garderOuvert;
          fiche.onmouseleave = fermerApresSurvol;
        }
      });
      layer.on("popupclose remove", garderOuvert);
    }
  }
  function renderSelection(zoom: boolean) {
    const q = indicateurs.find((q) => q.code_qp === code);
    const set = (attr: string, value: string) => {
      explorer!.querySelector<HTMLElement>(attr)!.textContent = value;
    };
    set("[data-nom]", q?.quartier ?? "Toute la métropole");
    set(
      "[data-commune]",
      q
        ? `${q.communes} · Quartier prioritaire`
        : "28 communes · 23 QPV à explorer",
    );
    set("[data-chaud]", q ? `${number(q.part_chaude_pct)} %` : `${distance} m`);
    const metric = explorer!.querySelector<HTMLElement>(".panel-metric span")!;
    metric.textContent = q
      ? "de surface chaude dans le QPV"
      : "pour les lieux ponctuels à la distance choisie";
    counts.replaceChildren();
    if (q) {
      const values = q[`comptes_${distance}m` as "comptes_300m"];
      for (const [name, value] of Object.entries(values)) {
        const row = document.createElement("div");
        const dt = document.createElement("dt");
        dt.textContent = name;
        const dd = document.createElement("dd");
        dd.textContent = String(value);
        row.append(dt, dd);
        counts.append(row);
      }
    }
    const open = explorer!.querySelector<HTMLAnchorElement>("[data-open]")!;
    open.href = q ? adresseQuartier(q) : "/#dossiers";
    open.textContent = q ? "Ouvrir ce dossier →" : "Choisir un dossier →";
    open.hidden = detail;

    qpLayer.setStyle((f) => ({
      color: f?.properties.code_qp === code ? "#2f2f2f" : "#60457b",
      weight: f?.properties.code_qp === code ? 4 : 2,
      fillOpacity: 0,
    }));
    if (zoom) {
      const f = quartiers.features.find((f) => f.properties.code_qp === code);
      if (f)
        map.fitBounds(
          L.geoJSON(f as Feature)
            .getBounds()
            .pad(detail ? 0.8 : 0.6),
          { maxZoom: 15, animate: false },
        );
      else map.fitBounds(allBounds, { padding: [12, 12] });
    }
    renderPlaces();
  }
  select?.addEventListener("change", () => {
    code = select.value;
    renderSelection(true);
  });
  explorer
    .querySelectorAll<HTMLInputElement>('input[name="distance"]')
    .forEach((input) => {
      input.addEventListener("change", () => {
        distance = Number(input.value);
        renderSelection(false);
        document.dispatchEvent(
          new CustomEvent("distance-change", { detail: { distance, code } }),
        );
      });
    });
  explorer.querySelectorAll<HTMLInputElement>("[data-layer]").forEach((input) =>
    input.addEventListener("change", () => {
      const layer =
        input.dataset.layer === "quartiers"
          ? qpLayer
          : input.dataset.layer === "chaleur"
            ? heatLayer
            : placesLayer;
      if (input.checked) map.addLayer(layer);
      else map.removeLayer(layer);
    }),
  );
  explorer.querySelector("[data-reset]")!.addEventListener("click", () => {
    if (detail) {
      renderSelection(true);
    } else {
      code = "";
      if (select) select.value = "";
      renderSelection(true);
    }
  });
  renderSelection(detail);
  new ResizeObserver(() => map.invalidateSize()).observe(mapElement);
}
