import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { SECTION_ICONS, SectionTitleIcon, type SectionIconKey } from "./sectionIcons";

describe("sectionIcons", () => {
  it("renders SectionTitleIcon for every key", () => {
    (Object.keys(SECTION_ICONS) as SectionIconKey[]).forEach((name) => {
      const { container } = render(<SectionTitleIcon name={name} className="test-icon" />);
      expect(container.querySelector(".test-icon")).toBeTruthy();
    });
  });
});
