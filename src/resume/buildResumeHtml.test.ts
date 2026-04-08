import { describe, expect, it } from "vitest";
import {
  buildResumeHtml,
  defaultCustomResumeSelection,
  CUSTOM_RESUME_SECTION_ORDER,
  type CustomResumeSectionKey,
  type ResumeMode,
} from "./buildResumeHtml";

const portfolioUrl = "https://tiagocosmai.github.io/";

describe("buildResumeHtml", () => {
  const modes: ResumeMode[] = [
    "ultra_compact",
    "compact",
    "objective",
    "favorito",
    "complete",
    "custom",
  ];

  it.each(modes)("produces valid HTML for mode %s", (mode) => {
    const html =
      mode === "custom"
        ? buildResumeHtml("pt", "custom", {
            portfolioUrl,
            customSelection: defaultCustomResumeSelection(),
          })
        : buildResumeHtml("en", mode, { portfolioUrl });
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("Tiago");
    expect(html).toContain("</html>");
  });

  it("supports es locale", () => {
    const html = buildResumeHtml("es", "compact", { portfolioUrl });
    expect(html).toContain('lang="es"');
  });

  it("custom mode respects toggled sections", () => {
    const sel = defaultCustomResumeSelection();
    for (const key of CUSTOM_RESUME_SECTION_ORDER) {
      sel.sections[key as CustomResumeSectionKey] = false;
    }
    sel.sections.expertise = true;
    const html = buildResumeHtml("pt", "custom", {
      portfolioUrl,
      customSelection: sel,
    });
    expect(html).toContain("Tiago Cosmai");
  });

  it("custom mode shows detail toggles when sections enabled", () => {
    const sel = defaultCustomResumeSelection();
    sel.sections.history = true;
    sel.historyDetail = true;
    sel.showSkills = true;
    sel.sections.certifications = true;
    sel.certificationsDetail = true;
    sel.sections.education = true;
    sel.educationDetail = true;
    sel.sections.languages = true;
    sel.languagesDetail = true;
    buildResumeHtml("en", "custom", { portfolioUrl, customSelection: sel });
  });

  it("custom mode: history detail off clears showSkills branch", () => {
    const sel = defaultCustomResumeSelection();
    sel.sections.history = true;
    sel.historyDetail = false;
    sel.showSkills = true;
    buildResumeHtml("en", "custom", { portfolioUrl, customSelection: sel });
  });

  it("empty portfolioUrl skips portfolio row in sidebar", () => {
    const html = buildResumeHtml("pt", "compact", { portfolioUrl: "   " });
    expect(html).toContain("mailto:");
  });

  it("resume contact sidebar: LinkedIn/GitHub show URL as link text; no url-print; no HackerRank/Credly", () => {
    const html = buildResumeHtml("en", "compact", { portfolioUrl });
    const marker = '<div class="block contact-sidebar">';
    const start = html.indexOf(marker);
    expect(start).toBeGreaterThan(-1);
    const block = html.slice(start, start + 6000);
    expect(block).not.toContain('class="url-print"');
    expect(block).toContain(
      '<a class="main-link" href="https://www.linkedin.com/in/tiagocosmai/">https://www.linkedin.com/in/tiagocosmai/</a>',
    );
    expect(block).toContain(
      '<a class="main-link" href="https://github.com/tiagocosmai">https://github.com/tiagocosmai</a>',
    );
    expect(block).toContain("tiagocosmai.github.io");
    expect(block).not.toContain("hackerrank");
    expect(block).not.toContain("credly");
  });

  it("uses default custom selection when custom mode omits selection", () => {
    const html = buildResumeHtml("en", "custom", { portfolioUrl });
    expect(html).toContain("Tiago");
  });
});
