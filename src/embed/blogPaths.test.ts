import { describe, expect, it } from "vitest";
import {
  articlesFrameUrl,
  articlesPathFromPortfolio,
  localeFromPortfolioPath,
  localizePortfolioPath,
  portfolioPathFromArticles,
} from "./blogPaths";

describe("blog paths", () => {
  it("maps a shared article URL onto the articles app", () => {
    expect(articlesPathFromPortfolio("/blog/o-agente-secreto", "")).toBe(
      "/o-agente-secreto",
    );
    expect(articlesPathFromPortfolio("/blog/o-agente-secreto/", "")).toBe(
      "/o-agente-secreto",
    );
    expect(articlesPathFromPortfolio("/blog", "?tag=AI")).toBe("/?tag=AI");
    expect(articlesPathFromPortfolio("/", "")).toBeNull();
    expect(articlesPathFromPortfolio("/blog/../secret", "")).toBeNull();
  });

  it("maps the portfolio admin URL onto the articles app", () => {
    expect(articlesPathFromPortfolio("/admin", "")).toBe("/admin");
    expect(articlesPathFromPortfolio("/pt/admin", "")).toBe("/admin");
    expect(articlesPathFromPortfolio("/en/admin/posts", "")).toBe("/admin/posts");
    expect(articlesPathFromPortfolio("/es/admin/comentarios", "?status=pending")).toBe(
      "/admin/comentarios?status=pending",
    );
    expect(articlesPathFromPortfolio("/admin/secret", "")).toBeNull();
    expect(portfolioPathFromArticles("/admin", "")).toBe("/pt/admin");
    expect(portfolioPathFromArticles("/admin/posts", "", "en")).toBe("/en/admin/posts");
    expect(articlesFrameUrl("/admin", false)).toBe(
      "https://tiagocosmai-articles.vercel.app/admin",
    );
  });

  it("maps an articles route back to the portfolio blog URL", () => {
    expect(portfolioPathFromArticles("/o-agente-secreto", "")).toBe(
      "/pt/blog/o-agente-secreto",
    );
    expect(portfolioPathFromArticles("/", "?tag=AI")).toBe("/pt/blog?tag=AI");
    expect(portfolioPathFromArticles("/a/b", "")).toBeNull();
  });

  it("prefixes every known language, including portuguese", () => {
    expect(localizePortfolioPath("/", "pt")).toBe("/pt");
    expect(localizePortfolioPath("/blog/o-agente-secreto", "pt")).toBe(
      "/pt/blog/o-agente-secreto",
    );
    expect(articlesPathFromPortfolio("/pt/blog/o-agente-secreto", "")).toBe(
      "/o-agente-secreto",
    );
    expect(localeFromPortfolioPath("/pt")).toBe("pt");
    expect(localeFromPortfolioPath("/pt/blog/o-agente-secreto")).toBe("pt");
  });

  it("keeps english and spanish prefixes on blog URLs and reads them back", () => {
    expect(articlesPathFromPortfolio("/en/blog/o-agente-secreto", "")).toBe(
      "/o-agente-secreto",
    );
    expect(articlesPathFromPortfolio("/es/blog", "?tag=AI")).toBe("/?tag=AI");
    expect(articlesPathFromPortfolio("/en", "")).toBeNull();
    expect(portfolioPathFromArticles("/o-agente-secreto", "", "en")).toBe(
      "/en/blog/o-agente-secreto",
    );
    expect(portfolioPathFromArticles("/", "?tag=AI", "es")).toBe("/es/blog?tag=AI");
    expect(localizePortfolioPath("/blog/o-agente-secreto", "en")).toBe(
      "/en/blog/o-agente-secreto",
    );
    expect(localizePortfolioPath("/en/blog/o-agente-secreto", "pt")).toBe(
      "/pt/blog/o-agente-secreto",
    );
    expect(localizePortfolioPath("/", "es")).toBe("/es");
    expect(localeFromPortfolioPath("/es/blog/o-agente-secreto")).toBe("es");
    expect(localeFromPortfolioPath("/blog/o-agente-secreto")).toBeNull();
  });

  it("builds the iframe URL for dev and for the Vercel site", () => {
    expect(articlesFrameUrl("/o-agente-secreto", true)).toBe(
      "http://localhost:5174/o-agente-secreto",
    );
    expect(articlesFrameUrl("/?tag=AI", true)).toBe("http://localhost:5174/?tag=AI");
    expect(articlesFrameUrl("/", false)).toBe("https://tiagocosmai-articles.vercel.app/");
    expect(articlesFrameUrl("/o-agente-secreto", false)).toBe(
      "https://tiagocosmai-articles.vercel.app/o-agente-secreto",
    );
  });
});
