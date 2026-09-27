/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import type { Connect, Plugin, PreviewServer, ViteDevServer } from "vite";
import { defineConfig } from "vitest/config";
import {
  CURRICULO_ROUTES,
  renderCurriculoHtml,
} from "./src/resume/curriculoRoutes";

function serveCurriculo(
  req: Connect.IncomingMessage,
  res: Connect.ServerResponse,
  next: Connect.NextFunction,
) {
  const path = (req.url ?? "").split("?")[0].replace(/\/$/, "") || "/";
  const route = CURRICULO_ROUTES.find((item) => item.urlPath === path);
  if (!route) {
    next();
    return;
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(renderCurriculoHtml(route.locale));
}

function curriculoPages(): Plugin {
  return {
    name: "curriculo-pages",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(serveCurriculo);
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use(serveCurriculo);
    },
    generateBundle() {
      for (const route of CURRICULO_ROUTES) {
        this.emitFile({
          type: "asset",
          fileName: route.fileName,
          source: renderCurriculoHtml(route.locale),
        });
      }
    },
  };
}

// Site na raiz: https://tiagocosmai.github.io (publicado a partir do repo portifolio → tiagocosmai.github.io)
export default defineConfig({
  plugins: [react(), curriculoPages()],
  base: "/",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html", "lcov"],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules/**",
        "dist/**",
        "**/*.test.{ts,tsx}",
        "**/types/**",
        "src/setupTests.ts",
        "src/main.tsx",
        "src/vite-env.d.ts",
        "**/*.config.*",
        "scripts/**",
        "src/test/**",
      ],
    },
  },
});
