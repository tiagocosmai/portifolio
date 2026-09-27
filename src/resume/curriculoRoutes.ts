import appConfig from "../data/config.json";
import type { Locale } from "../types/locale";
import { buildResumeHtml } from "./buildResumeHtml";

export const CURRICULO_ROUTES: {
  urlPath: string;
  fileName: string;
  locale: Locale;
}[] = [
  { urlPath: "/curriculo", fileName: "curriculo/index.html", locale: "pt" },
  { urlPath: "/curriculo/en", fileName: "curriculo/en/index.html", locale: "en" },
  { urlPath: "/curriculo/es", fileName: "curriculo/es/index.html", locale: "es" },
];

export function curriculoHref(locale: Locale): string {
  return locale === "pt" ? "/curriculo" : `/curriculo/${locale}`;
}

export function renderCurriculoHtml(locale: Locale): string {
  const portfolioUrl =
    (appConfig as { site?: { portfolioUrl?: string } }).site?.portfolioUrl ??
    "https://tiagocosmai.github.io";
  return buildResumeHtml(locale, "ai", { portfolioUrl });
}
