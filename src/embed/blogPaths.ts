import { isLocale, type Locale } from "../types/locale";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const QUERY = /^\?[A-Za-z0-9._~%=&+-]*$/;

function queryOf(search: string): string {
  if (search === "") return "";
  return QUERY.test(search) ? search : "";
}

function barePath(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

/** First path segment when it is one of the site languages. */
export function localeFromPortfolioPath(pathname: string): Locale | null {
  const segment = barePath(pathname).split("/")[1] ?? "";
  return isLocale(segment) ? segment : null;
}

export function stripLocalePrefix(pathname: string): string {
  const path = barePath(pathname);
  const locale = localeFromPortfolioPath(path);
  if (!locale) return path;
  const rest = path.slice(locale.length + 1);
  return rest || "/";
}

/** Rewrites a portfolio path so it matches the active language. */
export function localizePortfolioPath(pathnameWithSearch: string, locale: Locale): string {
  const queryAt = pathnameWithSearch.indexOf("?");
  const pathname = queryAt === -1 ? pathnameWithSearch : pathnameWithSearch.slice(0, queryAt);
  const search = queryAt === -1 ? "" : pathnameWithSearch.slice(queryAt);
  const path = stripLocalePrefix(pathname);
  if (path === "/") return `/${locale}${search}`;
  return `/${locale}${path}${search}`;
}

const ADMIN_SECTIONS = new Set(["posts", "comentarios"]);

function adminArticlesPath(path: string, query: string): string | null {
  if (path === "/admin") return `/admin${query}`;
  if (!path.startsWith("/admin/")) return null;
  const section = path.slice("/admin/".length);
  if (!ADMIN_SECTIONS.has(section)) return null;
  return `/admin/${section}${query}`;
}

/** Portfolio URL `/blog` or `/blog/:slug` → path inside the articles app. */
export function articlesPathFromPortfolio(pathname: string, search: string): string | null {
  const path = stripLocalePrefix(pathname);
  const query = queryOf(search);
  const admin = adminArticlesPath(path, query);
  if (admin) return admin;
  if (path === "/blog") return `/${query}`;
  if (!path.startsWith("/blog/")) return null;
  const slug = path.slice("/blog/".length);
  if (!SLUG.test(slug)) return null;
  return `/${slug}${query}`;
}

/** Articles router path → portfolio URL under `/blog`. */
export function portfolioPathFromArticles(
  pathname: string,
  search: string,
  locale: Locale = "pt",
): string | null {
  const path = barePath(pathname);
  const query = queryOf(search);
  if (path === "/admin" || path === "/admin/posts" || path === "/admin/comentarios") {
    return localizePortfolioPath(`${path}${query}`, locale);
  }
  if (path === "/") return localizePortfolioPath(`/blog${query}`, locale);
  const slug = path.startsWith("/") ? path.slice(1) : path;
  if (slug.includes("/") || !SLUG.test(slug)) return null;
  return localizePortfolioPath(`/blog/${slug}${query}`, locale);
}

export const ARTICLES_PRODUCTION_ORIGIN = "https://tiagocosmai-articles.vercel.app";

export function articlesFrameUrl(articlesPath: string, isDev = import.meta.env.DEV): string {
  const base = isDev ? "http://localhost:5174" : ARTICLES_PRODUCTION_ORIGIN;
  if (articlesPath === "/" || articlesPath.startsWith("/?")) {
    return `${base}/${articlesPath.slice(1)}`;
  }
  return `${base}${articlesPath}`;
}
