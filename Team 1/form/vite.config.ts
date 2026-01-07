import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: "/form",
  server: {
    port: 5173,
    host: "0.0.0.0", // Required for Docker
    allowedHosts: true, // Required for ngrok
    hmr: {
      clientPort: 443, // Required for ngrok SSL
      path: "/form/@vite/client",
    },
  },
  plugins: [react()],
  // plugins: [react(), mode === "development" && componentTagger()].filter(
  //   Boolean
  // ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
