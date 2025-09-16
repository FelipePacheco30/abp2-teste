import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://backend:4000", // nome do serviço no docker-compose
        changeOrigin: true,
      },
    },
  },
});
