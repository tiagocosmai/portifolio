import { describe, expect, it } from "vitest";
import { deepPick } from "./deepPick";
import type { Locale } from "../types/locale";

describe("deepPick", () => {
  it("returns primitives as-is", () => {
    expect(deepPick(42, "en")).toBe(42);
    expect(deepPick("x", "pt")).toBe("x");
    expect(deepPick(null, "es")).toBe(null);
  });

  it("picks tri string for locale with fallback to en", () => {
    const tri = { pt: "a", en: "b", es: "c" };
    expect(deepPick(tri, "pt")).toBe("a");
    expect(deepPick(tri, "en")).toBe("b");
    expect(deepPick(tri, "es")).toBe("c");
    const partial = { pt: "p", en: "e", es: "" };
    expect(deepPick(partial as { pt: string; en: string; es: string }, "es")).toBe("");
  });

  it("uses en when locale string missing", () => {
    const o = { pt: "", en: "fallback", es: "" };
    expect(deepPick(o, "pt")).toBe("");
  });

  it("picks tri string arrays", () => {
    const triArr = {
      pt: ["um"],
      en: ["one"],
      es: ["uno"],
    };
    expect(deepPick(triArr, "en")).toEqual(["one"]);
  });

  it("maps arrays recursively", () => {
    const arr = [{ pt: "x", en: "y", es: "z" }];
    expect(deepPick(arr, "en")).toEqual(["y"]);
  });

  it("maps objects recursively", () => {
    const obj = {
      a: { pt: "1", en: "2", es: "3" },
      b: { nested: { pt: "p", en: "e", es: "s" } },
    };
    expect(deepPick(obj, "es")).toEqual({ a: "3", b: { nested: "s" } });
  });

  it("handles empty object", () => {
    expect(deepPick({}, "pt" as Locale)).toEqual({});
  });
});
