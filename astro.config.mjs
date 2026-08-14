import { defineConfig } from "astro/config";
import path from "path";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://helenaswane.vercel.app/",
  vite: {
    resolve: {
      alias: {
        "@assets": path.resolve("./src/assets"),
      },
    },
  },

  integrations: [
    sitemap({
      filter: (page) => !page.includes("/admin"),
    }),
  ],
});
