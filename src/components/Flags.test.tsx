import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import type { Locale } from "../types/locale";
import {
  BRFlag,
  USFlag,
  ESFlag,
  LocaleFlag,
  LANGUAGE_OPTIONS,
} from "./Flags";

describe("Flags", () => {
  it("renders flag components", () => {
    const { container: c1 } = render(<BRFlag />);
    const { container: c2 } = render(<USFlag />);
    const { container: c3 } = render(<ESFlag />);
    expect(c1.querySelector("svg")).toBeTruthy();
    expect(c2.querySelector("svg")).toBeTruthy();
    expect(c3.querySelector("svg")).toBeTruthy();
  });

  it("LocaleFlag renders for each LANGUAGE_OPTIONS", () => {
    for (const { value } of LANGUAGE_OPTIONS) {
      const { container } = render(<LocaleFlag locale={value} />);
      expect(container.querySelector("svg")).toBeTruthy();
    }
  });

  it("LocaleFlag returns null for unknown locale", () => {
    const { container } = render(
      <LocaleFlag locale={"xx" as unknown as Locale} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
