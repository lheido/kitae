import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import nodejs from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    react(),
  ],
  output: "server",
  adapter: nodejs({ mode: "standalone" }),
  vite: {
    // Fix dev build issue after installing dockerode
    build: {
      target: "esnext",
    },
    optimizeDeps: {
      exclude: ["cpu-features", "ssh2"],
      esbuildOptions: {
        target: "esnext",
        supported: { bigint: true },
      },
    },
  },
});
