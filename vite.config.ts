import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePath = repositoryName ? `/${repositoryName}/` : "/";

export default defineConfig({
  plugins: [react()],
  base: basePath,
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts"]
  }
});
