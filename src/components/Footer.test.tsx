import { describe, expect, it, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import Footer from "./Footer";
import { renderWithProviders } from "../test/renderWithProviders";

vi.mock("../resume/generateResumePdf", () => ({
  generateResumePdf: vi.fn(() => Promise.resolve()),
}));

describe("Footer", () => {
  it("renders resume section and social row", () => {
    renderWithProviders(<Footer />, { mode: "dark", locale: "en" });
    expect(
      screen.getByRole("heading", { name: /resume download/i }),
    ).toBeInTheDocument();
  });

  it("opens resume panel and triggers PDF flow", async () => {
    renderWithProviders(<Footer />, { locale: "en" });
    fireEvent.click(
      screen.getByRole("button", { name: /PDF options & generation/i }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: /open print preview/i }),
    );
    const { generateResumePdf } = await import("../resume/generateResumePdf");
    await waitFor(() =>
      expect(vi.mocked(generateResumePdf)).toHaveBeenCalled(),
    );
  });
});
