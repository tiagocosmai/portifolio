import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import Timeline from "./Timeline";
import { renderWithProviders } from "../test/renderWithProviders";

describe("Timeline", () => {
  beforeEach(() => {
    vi.spyOn(Element.prototype, "scrollIntoView").mockImplementation(() => {});
  });

  it("renders experience heading", () => {
    renderWithProviders(<Timeline />, { mode: "dark", locale: "en" });
    expect(
      screen.getByRole("heading", { name: /experience/i }),
    ).toBeInTheDocument();
  });

  it("expands entry when show more exists", () => {
    renderWithProviders(<Timeline />, { mode: "light", locale: "en" });
    const more = screen.queryAllByRole("button", { name: /show more/i })[0];
    if (more) {
      fireEvent.click(more);
      expect(
        screen.getByRole("button", { name: /show less/i }),
      ).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /show less/i }));
    }
  });
});
