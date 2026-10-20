// Transformer le nom affiché en une adresse lisible, sans accents ni espaces.
export function slugQuartier(nom: string) {
  return nom
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function adresseQuartier(quartier: { quartier: string }) {
  return `/quartiers/${slugQuartier(quartier.quartier)}/`;
}
