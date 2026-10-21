import L from "leaflet";
import type { GeoJsonObject } from "geojson";
import metropole from "../assets/metropole.json";
import chaleur from "../assets/chaleur.json";
import lieux from "../assets/lieux.json";

const element = document.querySelector<HTMLElement>("[data-home-map]");
if (element) {
  const carte = L.map(element, {
    preferCanvas: true,
    scrollWheelZoom: false,
    attributionControl: false,
    zoomSnap: 0.1,
  });
  const contour = L.geoJSON(metropole as GeoJsonObject, {
    interactive: false,
    style: {
      color: "#c5c0b4",
      weight: 1,
      fillColor: "#eae6db",
      fillOpacity: 1,
    },
  }).addTo(carte);
  L.geoJSON(chaleur as GeoJsonObject, {
    interactive: false,
    style: { stroke: false, fillColor: "#de6d37", fillOpacity: 0.62 },
  }).addTo(carte);
  L.geoJSON(lieux as GeoJsonObject, {
    pointToLayer(feature, latlng) {
      const couleur =
        feature.properties.famille === "Eau et rafraîchissement"
          ? "#2d7e9e"
          : feature.properties.famille === "Espace végétalisé"
            ? "#2c6d4b"
            : "#60457b";
      return L.circleMarker(latlng, {
        radius: 3,
        color: couleur,
        weight: 0.5,
        fillColor: couleur,
        fillOpacity: 0.6,
      });
    },
    onEachFeature(feature, couche) {
      const contenu = document.createElement("span");
      contenu.textContent = `${feature.properties.nom} — ${feature.properties.famille}`;
      couche.bindTooltip(contenu);
    },
  }).addTo(carte);
  const cadrer = () => {
    carte.invalidateSize();
    carte.fitBounds(contour.getBounds(), { padding: [14, 14], animate: false });
  };
  cadrer();
  new ResizeObserver(cadrer).observe(element);
}
