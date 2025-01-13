import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Dynamically determine the API target based on the mode
  const isProduction = mode === "production";
  const apiTarget = isProduction
    ? "https://realestate-api-0sig.onrender.com"
    : "http://localhost:5000";

  return {
    server: {
      proxy: {
        "/api": {
          target: apiTarget,
          secure: false,
          changeOrigin: true,
        },
      },
    },
    plugins: [react()],
  };
});
