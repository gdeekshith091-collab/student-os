import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "Student OS",
        short_name: "Student OS",
        description:
          "Your semester and career intelligence system.",

        theme_color: "#7c3aed",
        background_color: "#ffffff",

        display: "standalone",

        start_url: "/",
        scope: "/",

        icons: [
          {
            src: "/student-os-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/student-os-icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});