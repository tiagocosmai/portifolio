import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import PersonalProjects from "./PersonalProjects";
import { renderWithProviders } from "../test/renderWithProviders";

describe("PersonalProjects", () => {
  beforeEach(() => {
    sessionStorage.clear();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        stargazers_count: 7,
        language: "TypeScript",
        updated_at: new Date().toISOString(),
      }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders project grid and loads GitHub stats", async () => {
    renderWithProviders(<PersonalProjects />, { mode: "dark", locale: "en" });
    expect(
      screen.getByRole("heading", { level: 2, name: /personal projects/i }),
    ).toBeInTheDocument();
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it("uses sessionStorage cache when fresh", async () => {
    const repo = "tiagocosmai/study-materials";
    sessionStorage.setItem(
      `portfolio-gh-stats:${repo}`,
      JSON.stringify({
        data: {
          stars: 2,
          language: "TS",
          updated_at: new Date().toISOString(),
        },
        at: Date.now(),
      }),
    );
    renderWithProviders(<PersonalProjects />, { mode: "light", locale: "en" });
    await waitFor(() => {
      expect(screen.getByText(/★\s*2/)).toBeInTheDocument();
    });
  });

  it("ignores invalid sessionStorage cache JSON", async () => {
    sessionStorage.setItem("portfolio-gh-stats:tiagocosmai/portifolio", "{");
    renderWithProviders(<PersonalProjects />, { mode: "dark", locale: "en" });
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it("survives fetch failure", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network"));
    renderWithProviders(<PersonalProjects />, { mode: "dark", locale: "en" });
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it("survives sessionStorage setItem failure after fetch", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        stargazers_count: 1,
        language: null,
        updated_at: "",
      }),
    });
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    renderWithProviders(<PersonalProjects />, { mode: "dark", locale: "en" });
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    spy.mockRestore();
  });
});
