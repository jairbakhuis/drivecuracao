import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Keep relative assets so the app also works on a repository-path Pages URL.
// Route-specific shells rewrite their asset references to the custom-domain root.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
