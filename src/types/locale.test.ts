import { describe, expect, it } from "vitest";
import { isTri, LOCALES } from "./locale";

describe("locale types", () => {
  it("isTri accepts valid tri objects", () => {
    expect(isTri({ pt: "a", en: "b", es: "c" })).toBe(true);
  });

  it("isTri rejects invalid", () => {
    expect(isTri(null)).toBe(false);
    expect(isTri(undefined)).toBe(false);
    expect(isTri({})).toBe(false);
    expect(isTri({ pt: 1, en: "b", es: "c" })).toBe(false);
    expect(isTri("x")).toBe(false);
  });

  it("LOCALES has pt, en, es", () => {
    expect(LOCALES.map((l) => l.value)).toEqual(["pt", "en", "es"]);
  });
});
