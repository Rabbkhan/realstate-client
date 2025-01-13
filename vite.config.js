import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        // target: "http://localhost:5000",
        target: "https://realestate-api-0sig.onrender.com",
        secure: true,
      },
    },
  },

  plugins: [react()],
});
