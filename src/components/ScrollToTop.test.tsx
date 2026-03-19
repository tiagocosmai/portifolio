import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import ScrollToTop from "./ScrollToTop";
import { renderWithProviders } from "../test/renderWithProviders";

describe("ScrollToTop", () => {
  beforeEach(() => {
    vi.spyOn(window, "scrollY", "get").mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("becomes visible after scroll past threshold", () => {
    renderWithProviders(<ScrollToTop />, { mode: "dark", locale: "en" });
    const btn = screen.getByRole("button", { name: /back to top/i });
    expect(btn.className).toMatch(/opacity-0/);
    vi.spyOn(window, "scrollY", "get").mockReturnValue(400);
    fireEvent.scroll(window);
    expect(btn.className).toMatch(/opacity-100/);
  });

  it("scrolls to top on click", () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;
    vi.spyOn(window, "scrollY", "get").mockReturnValue(500);
    renderWithProviders(<ScrollToTop />, { mode: "light", locale: "en" });
    fireEvent.scroll(window);
    fireEvent.click(screen.getByRole("button", { name: /back to top/i }));
    expect(scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });
});
