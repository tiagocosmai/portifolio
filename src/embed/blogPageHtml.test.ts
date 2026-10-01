import { describe, expect, it } from "vitest";
import { injectPageMeta, localizedBlogFiles, readBlogArticles, readLocalizedBlogArticles } from "./blogPageHtml";

const INDEX = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="description" content="My personal portfolio website." />
    <title>Portifólio - Tiago Cosmai</title>
  </head>
  <body></body>
</html>`;

describe("blog page html", () => {
  it("reads Portuguese titles from the articles catalog", () => {
    const articles = readBlogArticles(
      JSON.stringify({
        articles: [
          {
            slug: "o-agente-secreto",
            locales: { pt: { title: "Título", description: 'Aspas "aqui"' } },
          },
          { slug: "BAD SLUG", locales: { pt: { title: "x", description: "y" } } },
        ],
      }),
    );
    expect(articles).toEqual([
      { slug: "o-agente-secreto", title: "Título", description: 'Aspas "aqui"' },
    ]);
  });

  it("builds a share page for each language of the blog and of each article", () => {
    const articles = readLocalizedBlogArticles(
      JSON.stringify({
        articles: [
          {
            slug: "o-agente-secreto",
            locales: {
              pt: { title: "Título", description: "Descrição" },
              en: { title: "Title", description: "Description" },
              es: { title: "Título es", description: "Descripción" },
            },
          },
        ],
      }),
    );
    expect(localizedBlogFiles(articles)).toEqual([
      expect.objectContaining({
        fileName: "pt/blog/index.html",
        url: "https://tiagocosmai.github.io/pt/blog",
      }),
      expect.objectContaining({
        fileName: "pt/blog/o-agente-secreto/index.html",
        title: "Título",
        url: "https://tiagocosmai.github.io/pt/blog/o-agente-secreto",
      }),
      expect.objectContaining({
        fileName: "en/blog/index.html",
        url: "https://tiagocosmai.github.io/en/blog",
      }),
      expect.objectContaining({
        fileName: "en/blog/o-agente-secreto/index.html",
        title: "Title",
        url: "https://tiagocosmai.github.io/en/blog/o-agente-secreto",
      }),
      expect.objectContaining({
        fileName: "es/blog/index.html",
        url: "https://tiagocosmai.github.io/es/blog",
      }),
      expect.objectContaining({
        fileName: "es/blog/o-agente-secreto/index.html",
        title: "Título es",
        url: "https://tiagocosmai.github.io/es/blog/o-agente-secreto",
      }),
    ]);
  });

  it("replaces the title and description and adds share tags", () => {
    const html = injectPageMeta(INDEX, {
      title: 'Agente "secreto"',
      description: "Uma reflexão",
      url: "https://tiagocosmai.github.io/blog/o-agente-secreto",
      type: "article",
    });
    expect(html).toContain("<title>Agente &quot;secreto&quot;</title>");
    expect(html).toContain('content="Uma reflexão"');
    expect(html).toContain(
      '<meta property="og:url" content="https://tiagocosmai.github.io/blog/o-agente-secreto" />',
    );
    expect(html).toContain('<meta property="og:type" content="article" />');
    expect(html).not.toContain("My personal portfolio website.");
  });
});
