import { LOCALES, type Locale } from "../types/locale";

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

const BLOG_LOCALES = LOCALES.map((item) => item.value);
type BlogLocale = Locale;

export const BLOG_INDEX_COPY: Record<BlogLocale, { title: string; description: string }> = {
  pt: {
    title: "Blog — Tiago Cosmai",
    description: "Ensaios sobre tecnologia, carreira e inteligência artificial.",
  },
  en: {
    title: "Blog — Tiago Cosmai",
    description: "Essays on technology, career, and artificial intelligence.",
  },
  es: {
    title: "Blog — Tiago Cosmai",
    description: "Ensayos sobre tecnología, carrera e inteligencia artificial.",
  },
};

export type LocalizedBlogArticle = {
  slug: string;
  locales: Partial<Record<BlogLocale, { title: string; description: string }>>;
};

export function readLocalizedBlogArticles(json: string): LocalizedBlogArticle[] {
  const data = JSON.parse(json) as { articles?: unknown };
  if (!Array.isArray(data.articles)) return [];
  const articles: LocalizedBlogArticle[] = [];
  for (const item of data.articles) {
    if (!item || typeof item !== "object") continue;
    const record = item as {
      slug?: unknown;
      locales?: Partial<Record<BlogLocale, { title?: unknown; description?: unknown }>>;
    };
    if (typeof record.slug !== "string" || !SLUG.test(record.slug)) continue;
    const locales: LocalizedBlogArticle["locales"] = {};
    for (const locale of BLOG_LOCALES) {
      const entry = record.locales?.[locale];
      if (typeof entry?.title !== "string" || typeof entry.description !== "string") continue;
      locales[locale] = { title: entry.title, description: entry.description };
    }
    if (!locales.pt) continue;
    articles.push({ slug: record.slug, locales });
  }
  return articles;
}

export function localizedBlogFiles(
  articles: LocalizedBlogArticle[],
  origin = "https://tiagocosmai.github.io",
): { fileName: string; title: string; description: string; url: string; type: "article" | "website" }[] {
  const files: {
    fileName: string;
    title: string;
    description: string;
    url: string;
    type: "article" | "website";
  }[] = [];
  for (const locale of BLOG_LOCALES) {
    const prefix = `/${locale}`;
    const root = `${locale}/blog`;
    const index = BLOG_INDEX_COPY[locale];
    files.push({
      fileName: `${root}/index.html`,
      title: index.title,
      description: index.description,
      url: `${origin}${prefix}/blog`,
      type: "website",
    });
    for (const article of articles) {
      const copy = article.locales[locale];
      if (!copy) continue;
      files.push({
        fileName: `${root}/${article.slug}/index.html`,
        title: copy.title,
        description: copy.description,
        url: `${origin}${prefix}/blog/${article.slug}`,
        type: "article",
      });
    }
  }
  return files;
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
