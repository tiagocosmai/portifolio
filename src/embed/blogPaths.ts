const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const QUERY = /^\?[A-Za-z0-9._~%=&+-]*$/;

function queryOf(search: string): string {
  if (search === "") return "";
  return QUERY.test(search) ? search : "";
}

/** Portfolio URL `/blog` or `/blog/:slug` → path inside the articles app. */
export function articlesPathFromPortfolio(pathname: string, search: string): string | null {
  const path = pathname.replace(/\/+$/, "") || "/";
  const query = queryOf(search);
  if (path === "/blog") return `/${query}`;
  if (!path.startsWith("/blog/")) return null;
  const slug = path.slice("/blog/".length);
  if (!SLUG.test(slug)) return null;
  return `/${slug}${query}`;
}

/** Articles router path → portfolio URL under `/blog`. */
export function portfolioPathFromArticles(pathname: string, search: string): string | null {
  const path = pathname.replace(/\/+$/, "") || "/";
  const query = queryOf(search);
  if (path === "/") return `/blog${query}`;
  const slug = path.startsWith("/") ? path.slice(1) : path;
  if (slug.includes("/") || !SLUG.test(slug)) return null;
  return `/blog/${slug}${query}`;
}

export function articlesFrameUrl(articlesPath: string, isDev = import.meta.env.DEV): string {
  const base = (isDev ? "http://localhost:5174/" : "/articles/").replace(/\/$/, "");
  if (articlesPath === "/" || articlesPath.startsWith("/?")) {
    return `${base}/${articlesPath.slice(1)}`;
  }
  return `${base}${articlesPath}`;
}
