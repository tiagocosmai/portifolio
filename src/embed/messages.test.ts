import { describe, expect, it } from "vitest";
import {
  EMBED_CHANNEL,
  articlesFrameSrc,
  isArticlesFrameOrigin,
  parseBlogScrollY,
  preferencesMessage,
  scrollTopMessage,
} from "./messages";

describe("embed messages", () => {
  it("points the iframe at the articles dev server or the GitHub Pages path", () => {
    expect(articlesFrameSrc(true)).toBe("http://localhost:5174/");
    expect(articlesFrameSrc(false)).toBe("/articles/");
  });

  it("builds preference and scroll-top payloads", () => {
    expect(preferencesMessage("pt", "dark")).toEqual({
      channel: EMBED_CHANNEL,
      topic: "preferences",
      locale: "pt",
      theme: "dark",
    });
    expect(scrollTopMessage()).toEqual({
      channel: EMBED_CHANNEL,
      topic: "scroll-top",
    });
  });

  it("treats localhost and 127.0.0.1 as the same blog frame", () => {
    expect(isArticlesFrameOrigin("http://localhost:5174")).toBe(true);
    expect(isArticlesFrameOrigin("http://127.0.0.1:5174")).toBe(true);
    expect(isArticlesFrameOrigin("http://localhost:9999")).toBe(false);
    expect(isArticlesFrameOrigin("https://example.com")).toBe(false);
  });

  it("reads a finite scroll report and ignores anything else", () => {
    expect(
      parseBlogScrollY({ channel: EMBED_CHANNEL, topic: "scroll", scrollY: 480 }),
    ).toBe(480);
    expect(parseBlogScrollY({ channel: EMBED_CHANNEL, topic: "scroll", scrollY: Number.NaN })).toBeNull();
    expect(parseBlogScrollY({ channel: "other", topic: "scroll", scrollY: 10 })).toBeNull();
    expect(parseBlogScrollY(null)).toBeNull();
  });
});
