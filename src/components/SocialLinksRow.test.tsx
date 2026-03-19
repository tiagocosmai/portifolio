import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { SocialLinksRow } from "./SocialLinksRow";
import { renderWithProviders } from "../test/renderWithProviders";

describe("SocialLinksRow", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn(() => Promise.resolve()) },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders hero variant with GitHub link", () => {
    renderWithProviders(<SocialLinksRow variant="hero" />, { mode: "dark" });
    expect(screen.getAllByLabelText(/github/i)[0]).toBeInTheDocument();
  });

  it("renders footer variant", () => {
    renderWithProviders(<SocialLinksRow variant="footer" />, { mode: "light" });
    expect(screen.getAllByLabelText(/github/i)[0]).toBeInTheDocument();
  });

  it("copies Discord username when clipboard available", async () => {
    renderWithProviders(<SocialLinksRow variant="hero" />, { mode: "dark" });
    const discordBtn = screen.getByLabelText(/discord/i);
    fireEvent.click(discordBtn);
    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalled(),
    );
  });

  it("ignores clipboard failure", async () => {
    vi.spyOn(navigator.clipboard!, "writeText").mockRejectedValueOnce(
      new Error("no"),
    );
    renderWithProviders(<SocialLinksRow variant="hero" />, { mode: "dark" });
    fireEvent.click(screen.getByLabelText(/discord/i));
  });
});
