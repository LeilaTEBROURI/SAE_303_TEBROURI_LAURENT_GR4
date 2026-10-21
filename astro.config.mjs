import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import netlify from "@astrojs/netlify";

export default defineConfig({
  output: "server",
  adapter: netlify({
    devFeatures: { edgeFunctions: false },
  }),
  vite: { plugins: [tailwindcss()] },
});
