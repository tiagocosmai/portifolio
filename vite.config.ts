/// <reference types="vitest/config" />
import fs from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";
import { injectPageMeta, readBlogArticles } from "./src/embed/blogPageHtml";

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
      const articles = readBlogArticles(fs.readFileSync(catalog, "utf8"));
      const blogDir = path.resolve(outDir, "blog");
      fs.mkdirSync(blogDir, { recursive: true });
      fs.writeFileSync(
        path.join(blogDir, "index.html"),
        injectPageMeta(index, {
          title: "Blog — Tiago Cosmai",
          description:
            "Ensaios sobre tecnologia, carreira e inteligência artificial.",
          url: `${PORTFOLIO_ORIGIN}/blog`,
          type: "website",
        }),
      );
      for (const article of articles) {
        const dir = path.join(blogDir, article.slug);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(
          path.join(dir, "index.html"),
          injectPageMeta(index, {
            title: article.title,
            description: article.description,
            url: `${PORTFOLIO_ORIGIN}/blog/${article.slug}`,
            type: "article",
          }),
        );
      }
    },
  };
}

// Site na raiz: https://tiagocosmai.github.io (publicado a partir do repo portifolio → tiagocosmai.github.io)
export default defineConfig({
  plugins: [react(), blogSharePages()],
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
