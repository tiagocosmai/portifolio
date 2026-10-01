export type BlogArticleMeta = {
  slug: string;
  title: string;
  description: string;
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function readBlogArticles(json: string): BlogArticleMeta[] {
  const data = JSON.parse(json) as { articles?: unknown };
  if (!Array.isArray(data.articles)) return [];
  const articles: BlogArticleMeta[] = [];
  for (const item of data.articles) {
    if (!item || typeof item !== "object") continue;
    const record = item as {
      slug?: unknown;
      locales?: { pt?: { title?: unknown; description?: unknown } };
    };
    const slug = record.slug;
    const title = record.locales?.pt?.title;
    const description = record.locales?.pt?.description;
    if (typeof slug !== "string" || !SLUG.test(slug)) continue;
    if (typeof title !== "string" || typeof description !== "string") continue;
    articles.push({ slug, title, description });
  }
  return articles;
}

export function injectPageMeta(
  indexHtml: string,
  meta: { title: string; description: string; url: string; type: "article" | "website" },
): string {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const url = escapeHtml(meta.url);
  let html = indexHtml.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${description}" />`,
  );
  const tags = [
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<link rel="canonical" href="${url}" />`,
  ].join("\n    ");
  return html.replace("</head>", `    ${tags}\n  </head>`);
}
