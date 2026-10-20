export const rubriques = [
  { id: "quartiers", titre: "Les quartiers et les organismes" },
  { id: "mesures", titre: "La chaleur et les chiffres" },
  { id: "carte", titre: "Lire la carte et les données" },
  { id: "solutions", titre: "Les pistes pour rafraîchir la ville" },
] as const;

export const glossaire = [
  {
    id: "qpv",
    rubrique: "quartiers",
    mot: "QPV",
    complet: "Quartier prioritaire de la politique de la ville",
    definition:
      "Quartier identifié par l’État, notamment à partir des revenus de ses habitants, pour y concentrer des actions publiques. Ici, les 23 quartiers étudiés suivent les contours officiels de 2024. Ce classement ne mesure pas leur chaleur.",
    source: "https://www.insee.fr/fr/metadonnees/definition/c2114",
    sourceLabel: "Définition de l’Insee",
  },
  {
    id: "bm",
    rubrique: "quartiers",
    mot: "BM",
    complet: "Bordeaux Métropole",
    definition:
      "Le territoire regroupant Bordeaux et les communes voisines. Dans les données de chaleur, BM indique que l’écart de température est comparé à la référence de Bordeaux Métropole.",
  },
  {
    id: "anct",
    rubrique: "quartiers",
    mot: "ANCT",
    complet: "Agence nationale de la cohésion des territoires",
    definition:
      "Organisme public qui accompagne les territoires. Il met notamment à disposition les contours des quartiers prioritaires utilisés dans cette enquête.",
    source: "https://anct.gouv.fr/quartiers-prioritaires",
    sourceLabel: "Présentation de l’ANCT",
  },
  {
    id: "sig",
    rubrique: "quartiers",
    mot: "SIG",
    complet: "Système d’information géographique",
    definition:
      "Un outil qui rassemble des informations sur une carte. SIG Ville est le site de référence utilisé ici pour les contours des quartiers prioritaires.",
  },
  {
    id: "acmg",
    rubrique: "quartiers",
    mot: "ACMG",
    complet: "Association climatologique de la Moyenne-Garonne et du Sud-Ouest",
    definition:
      "Association citée comme fournisseur des données de température de surface par Bordeaux Métropole.",
    source:
      "https://www.pari47.fr/association-climatologique-de-la-moyenne-garonne/",
    sourceLabel: "Présentation par la fédération d’associations Pari47",
  },
  {
    id: "ademe",
    rubrique: "quartiers",
    mot: "ADEME",
    complet: "Agence de la transition écologique",
    definition:
      "Organisme public qui accompagne la transition écologique. Ses ressources présentent les familles de solutions de rafraîchissement citées dans notre conclusion.",
    source:
      "https://agirpourlatransition.ademe.fr/collectivites/conseils/adaptation/rafraichissement-urbain",
    sourceLabel: "Ressources de l’ADEME",
  },
  {
    id: "temperature-surface",
    rubrique: "mesures",
    mot: "Température de surface",
    definition:
      "Température des sols, des toitures ou d’autres surfaces observées. Elle est différente de la température de l’air et ne dit pas directement ce qu’une personne ressent.",
  },
  {
    id: "delta",
    rubrique: "mesures",
    mot: "Delta (δ)",
    definition:
      "Un écart par rapport à une valeur de référence. Ici, delta ≥ 3 veut dire que le polygone appartient à une classe publiée d’au moins +3 °C par rapport à la référence métropolitaine du 11 juillet 2022. Ce n’est pas une température absolue de 3 °C.",
  },
  {
    id: "part-chaude",
    rubrique: "mesures",
    mot: "Part de surface chaude",
    definition:
      "La proportion de la superficie du quartier comptée comme chaude dans les données retenues. Par exemple, 40 % correspond à 40 m² chauds sur 100 m² de quartier. Ce pourcentage ne représente pas la part des habitants exposés.",
  },
  {
    id: "denominateur",
    rubrique: "mesures",
    mot: "Dénominateur",
    definition:
      "La quantité de référence par laquelle on divise. Pour la part chaude, c’est la superficie totale du quartier : surface chaude ÷ superficie du quartier × 100.",
  },
  {
    id: "hectare",
    rubrique: "mesures",
    mot: "Hectare (ha)",
    definition:
      "Une unité de superficie. Un hectare vaut 10 000 m² : c’est, par exemple, un carré de 100 mètres de côté.",
  },
  {
    id: "effectif",
    rubrique: "mesures",
    mot: "Effectif brut",
    definition:
      "Un nombre compté directement, sans le diviser par une population ou une superficie. Ici, 7 lieux signifie 7 fiches retenues dans l’inventaire, pas 7 lieux pour 1 000 habitants.",
  },
  {
    id: "seuil",
    rubrique: "mesures",
    mot: "Seuil d’analyse",
    definition:
      "Une limite choisie pour sélectionner ou comparer les données. Notre choix delta ≥ 3 sert à l’analyse ; il ne désigne pas un niveau de danger pour la santé.",
  },
  {
    id: "causalite",
    rubrique: "mesures",
    mot: "Causalité",
    definition:
      "Le fait qu’un phénomène en provoque un autre. Observer deux caractéristiques dans un même quartier ne suffit pas à démontrer que l’une cause l’autre.",
  },
  {
    id: "vol-oiseau",
    rubrique: "carte",
    mot: "À vol d’oiseau",
    definition:
      "Une distance directe sur la carte. Elle ne suit pas les rues et ne tient pas compte des obstacles ou des entrées. Ainsi, 300 m à vol d’oiseau ne signifie pas un trajet à pied de 300 m.",
  },
  {
    id: "tampon",
    rubrique: "carte",
    mot: "Zone tampon / rayon de proximité",
    definition:
      "Une zone élargie autour du contour d’un quartier. Avec 300 m, on retient les points dans le quartier et jusqu’à 300 m au-delà de ses limites. La distance ne part pas du centre du quartier.",
  },
  {
    id: "geometrie",
    rubrique: "carte",
    mot: "Géométrie",
    definition:
      "La forme qui situe un objet sur la carte : un point pour un équipement, ou un contour pour un quartier ou un parc.",
  },
  {
    id: "polygone",
    rubrique: "carte",
    mot: "Polygone / objet surfacique",
    definition:
      "Une forme fermée qui couvre une surface sur la carte. Un parc peut ainsi être dessiné par son contour, plutôt que par un point. Ces lieux dessinés comme des surfaces sont exclus du comptage repris du notebook.",
  },
  {
    id: "ponctuel",
    rubrique: "carte",
    mot: "Lieu ponctuel",
    definition:
      "Une fiche de lieu représentée par un point sur la carte, comme une fontaine ou un bâtiment. Ponctuel décrit ici la forme de la donnée, pas une ouverture temporaire.",
  },
  {
    id: "inventaire",
    rubrique: "carte",
    mot: "Inventaire / lieu recensé",
    definition:
      "La liste des lieux présents dans la source de données. Elle peut être incomplète. Un lieu recensé n’est pas forcément ouvert ou gratuit ; un zéro ne prouve pas qu’aucun lieu n’existe sur le terrain.",
  },
  {
    id: "calque",
    rubrique: "carte",
    mot: "Calque",
    definition:
      "Une couche d’informations que l’on peut afficher ou masquer sur la carte. Ici, on peut activer séparément les quartiers, la chaleur et les lieux recensés.",
  },
  {
    id: "geojson",
    rubrique: "carte",
    mot: "GeoJSON",
    definition:
      "Un format de fichier qui enregistre les formes d’une carte et les informations associées. C’est l’un des formats utilisés pour préparer ce site.",
  },
  {
    id: "api",
    rubrique: "carte",
    mot: "API",
    complet: "Interface de programmation d’application",
    definition:
      "Un moyen pour un logiciel de récupérer des informations auprès d’un autre service. Ici, l’API Géo de l’État fournit le contour de Bordeaux Métropole.",
  },
  {
    id: "turf",
    rubrique: "carte",
    mot: "Turf.js",
    definition:
      "Une bibliothèque de fonctions pour calculer des surfaces, des intersections et des zones de proximité sur une carte. Elle sert à préparer nos résultats ; il n’est pas nécessaire de la connaître pour explorer le site.",
  },
  {
    id: "geodesique",
    rubrique: "carte",
    mot: "Surface géodésique",
    definition:
      "Une superficie calculée en tenant compte de la courbure de la Terre, plutôt qu’en traitant la carte comme une simple feuille plane.",
  },
  {
    id: "lambert",
    rubrique: "carte",
    mot: "Lambert-93",
    definition:
      "Un système de coordonnées utilisé pour représenter la France sur une carte et travailler en mètres. Le calcul actuel de cette enquête utilise les fonctions de Turf, sans convertir les données dans ce système.",
  },
  {
    id: "svg",
    rubrique: "carte",
    mot: "SVG",
    complet: "Scalable Vector Graphics",
    definition:
      "Un format d’image fait de formes et de lignes plutôt que d’une grille de pixels. Les graphiques préparés dans ce format restent nets lorsqu’on les agrandit.",
  },
  {
    id: "build",
    rubrique: "carte",
    mot: "Build / construction du site",
    definition:
      "L’étape qui prépare les pages et les fichiers du site avant leur mise à disposition. Un graphique préparé à cette étape n’a pas besoin d’être recalculé dans le navigateur du visiteur.",
  },
  {
    id: "notebook",
    rubrique: "carte",
    mot: "Notebook",
    definition:
      "Un document interactif qui rassemble nos explications, nos calculs et nos graphiques. Le lien de la page Sources permet de consulter le travail dont proviennent les résultats.",
  },
  {
    id: "vegetalisation",
    rubrique: "solutions",
    mot: "Végétalisation",
    definition:
      "Ajouter des arbres ou d’autres plantes dans un espace. C’est une piste d’aménagement à étudier selon le lieu, ses usages et les besoins d’entretien.",
  },
  {
    id: "canopee",
    rubrique: "solutions",
    mot: "Canopée",
    definition:
      "La couverture formée par le feuillage des arbres lorsqu’on la regarde du dessus. Nos données ne mesurent pas cette couverture.",
  },
  {
    id: "desimpermeabilisation",
    rubrique: "solutions",
    mot: "Désimperméabilisation",
    definition:
      "Remplacer ou ouvrir des surfaces étanches, comme certains revêtements de cour, pour permettre à l’eau de mieux pénétrer dans le sol. Cette piste doit être étudiée sur place.",
  },
];
