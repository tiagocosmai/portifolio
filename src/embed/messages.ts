import type { ThemeMode } from "../context/ThemeContext";
import type { Locale } from "../types/locale";
import { portfolioPathFromArticles } from "./blogPaths";

export const EMBED_CHANNEL = "tiagocosmai-embed";

export function articlesFrameSrc(isDev = import.meta.env.DEV): string {
  if (isDev) return "http://localhost:5174/";
  return "/articles/";
}

export function articlesFrameOrigin(): string {
  return new URL(articlesFrameSrc(), window.location.href).origin;
}

function isLoopback(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function isArticlesFrameOrigin(origin: string): boolean {
  const expected = articlesFrameOrigin();
  if (origin === expected) return true;
  try {
    const actual = new URL(origin);
    const wanted = new URL(expected);
    return (
      actual.protocol === wanted.protocol &&
      actual.port === wanted.port &&
      isLoopback(actual.hostname) &&
      isLoopback(wanted.hostname)
    );
  } catch {
    return false;
  }
}

export function preferencesMessage(locale: Locale, theme: ThemeMode, origin?: string) {
  return {
    channel: EMBED_CHANNEL,
    topic: "preferences" as const,
    locale,
    theme,
    ...(origin ? { origin } : {}),
  };
}

export function scrollTopMessage() {
  return { channel: EMBED_CHANNEL, topic: "scroll-top" as const };
}

export function navigateMessage(path: string) {
  return { channel: EMBED_CHANNEL, topic: "navigate" as const, path };
}

export function parseBlogLocation(
  data: unknown,
): { pathname: string; search: string } | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  if (record.channel !== EMBED_CHANNEL || record.topic !== "location") return null;
  if (typeof record.pathname !== "string" || typeof record.search !== "string") return null;
  if (portfolioPathFromArticles(record.pathname, record.search) === null) return null;
  return { pathname: record.pathname, search: record.search };
}

export function parseBlogScrollY(data: unknown): number | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  if (record.channel !== EMBED_CHANNEL || record.topic !== "scroll") return null;
  if (typeof record.scrollY !== "number" || !Number.isFinite(record.scrollY)) return null;
  return record.scrollY;
}

export function postToFrame(frame: Window, message: unknown) {
  frame.postMessage(message, articlesFrameOrigin());
}
