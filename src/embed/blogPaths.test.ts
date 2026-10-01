import { describe, expect, it } from "vitest";
import {
  articlesFrameUrl,
  articlesPathFromPortfolio,
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

  it("maps an articles route back to the portfolio blog URL", () => {
    expect(portfolioPathFromArticles("/o-agente-secreto", "")).toBe(
      "/blog/o-agente-secreto",
    );
    expect(portfolioPathFromArticles("/", "?tag=AI")).toBe("/blog?tag=AI");
    expect(portfolioPathFromArticles("/a/b", "")).toBeNull();
  });

  it("builds the iframe URL for dev and for GitHub Pages", () => {
    expect(articlesFrameUrl("/o-agente-secreto", true)).toBe(
      "http://localhost:5174/o-agente-secreto",
    );
    expect(articlesFrameUrl("/?tag=AI", true)).toBe("http://localhost:5174/?tag=AI");
    expect(articlesFrameUrl("/", false)).toBe("/articles/");
    expect(articlesFrameUrl("/o-agente-secreto", false)).toBe(
      "/articles/o-agente-secreto",
    );
  });
});
