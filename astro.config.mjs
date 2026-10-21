import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import netlify from "@astrojs/netlify";

// Chaque commande garde son cache : un build ne casse pas le serveur local.
const commandeAstro = process.argv.find((argument) =>
  ["dev", "build", "check", "preview"].includes(argument),
) ?? "dev";

export default defineConfig({
  output: "server",
  adapter: netlify({
    devFeatures: { edgeFunctions: false },
  }),
  vite: {
    cacheDir: `node_modules/.vite-${commandeAstro}`,
    plugins: [tailwindcss()],
  },
});
