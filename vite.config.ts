/// <reference types="vitest/config" />
import fs from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react";
import type { Connect, Plugin, PreviewServer, ViteDevServer } from "vite";
import { defineConfig } from "vitest/config";
import { injectPageMeta, localizedBlogFiles, readLocalizedBlogArticles } from "./src/embed/blogPageHtml";
import { LOCALES } from "./src/types/locale";
import {
  CURRICULO_ROUTES,
  renderCurriculoHtml,
} from "./src/resume/curriculoRoutes";

const PORTFOLIO_ORIGIN = "https://tiagocosmai.github.io";

function articlesCatalogPath(): string | null {
  const candidates = [
    path.resolve("articles/data/articles.json"),
    path.resolve("../articles/data/articles.json"),
  ];
  return candidates.find((file) => fs.existsSync(file)) ?? null;
}

function blogSharePages(): Plugin {
  let outDir = "dist";
  return {
    name: "blog-share-pages",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      const indexPath = path.resolve(outDir, "index.html");
      if (!fs.existsSync(indexPath)) return;
      const index = fs.readFileSync(indexPath, "utf8");
      fs.writeFileSync(path.resolve(outDir, "404.html"), index);

      const catalog = articlesCatalogPath();
      if (!catalog) {
        console.warn(
          "[blog-share-pages] articles catalog not found; /blog/:slug uses the 404 fallback",
        );
        return;
      }
      const articles = readLocalizedBlogArticles(fs.readFileSync(catalog, "utf8"));
      for (const page of localizedBlogFiles(articles, PORTFOLIO_ORIGIN)) {
        const filePath = path.resolve(outDir, page.fileName);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(
          filePath,
          injectPageMeta(index, {
            title: page.title,
            description: page.description,
            url: page.url,
            type: page.type,
          }),
        );
      }
      for (const { value: locale } of LOCALES) {
        const localeHome = path.resolve(outDir, locale, "index.html");
        fs.mkdirSync(path.dirname(localeHome), { recursive: true });
        fs.writeFileSync(localeHome, index);
      }
    },
  };
}

function serveCurriculo(
  req: Connect.IncomingMessage,
  res: Connect.ServerResponse,
  next: Connect.NextFunction,
) {
  const requestPath = (req.url ?? "").split("?")[0].replace(/\/$/, "") || "/";
  const route = CURRICULO_ROUTES.find((item) => item.urlPath === requestPath);
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
  plugins: [react(), curriculoPages(), blogSharePages()],
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
