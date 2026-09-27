import { describe, expect, it } from "vitest";
import { buildResumeHtml } from "./buildResumeHtml";
import { curriculoHref, CURRICULO_ROUTES } from "./curriculoRoutes";

const portfolioUrl = "https://tiagocosmai.github.io";

describe("AI resume", () => {
  it("keeps the visual complete mode and adds a labeled full document", () => {
    const visual = buildResumeHtml("pt", "complete", { portfolioUrl });
    const ai = buildResumeHtml("pt", "ai", { portfolioUrl });

    expect(visual).toContain("col-sidebar");
    expect(visual).not.toContain("Tenho como princípios a qualidade de software");
    expect(ai).toContain('data-resume-format="ai-reading"');
    expect(ai).toContain('data-resume-completeness="complete"');
    expect(ai).toContain("Tenho como princípios a qualidade de software");
    expect(ai).toContain("application/ld+json");
    expect(ai).toContain("https://www.hackerrank.com/profile/tiagocosmai");
    expect(ai).toContain("<dt>Cargo</dt>");
    expect(ai).not.toContain("col-sidebar");
    expect(ai).toContain('href="/curriculo" hreflang="pt-BR" aria-current="page"');
  });

  it("publishes one static page per language", () => {
    expect(CURRICULO_ROUTES.map((route) => route.fileName)).toEqual([
      "curriculo/index.html",
      "curriculo/en/index.html",
      "curriculo/es/index.html",
    ]);
    expect(curriculoHref("pt")).toBe("/curriculo");
    expect(curriculoHref("en")).toBe("/curriculo/en");
    const english = buildResumeHtml("en", "ai", { portfolioUrl });
    expect(english).toContain('lang="en"');
    expect(english).toContain("Prescription Mission");
    expect(english).toContain('href="/curriculo/en" hreflang="en" aria-current="page"');
  });
});
