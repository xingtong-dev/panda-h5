import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/v1": {
        target: "https://pandamarketitaly.com",
        changeOrigin: true,
      },
    },
  },
});
