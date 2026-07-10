import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" so the build works both at username.github.io/rent-curacao/
// and later at the root of a custom domain without a rebuild config change.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
