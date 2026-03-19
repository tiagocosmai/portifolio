import { describe, expect, it } from "vitest";
import { sectionHeadingClass } from "./sectionHeading";

describe("sectionHeadingClass", () => {
  it("returns Matrix green when dark", () => {
    expect(sectionHeadingClass(true)).toBe("text-[#00FF41]");
  });

  it("returns emerald heading when light", () => {
    expect(sectionHeadingClass(false)).toBe("text-[#14532d]");
  });
});
