import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import ResumeDownload from "./ResumeDownload";
import { renderWithProviders } from "../test/renderWithProviders";

const generateResumePdf = vi.fn();

vi.mock("../resume/generateResumePdf", () => ({
  generateResumePdf: (...args: unknown[]) => generateResumePdf(...args),
}));

describe("ResumeDownload", () => {
  beforeEach(() => {
    generateResumePdf.mockReset();
  });

  it("offers the AI reading PDF and a link to the HTML page", async () => {
    generateResumePdf.mockResolvedValue(undefined);
    renderWithProviders(<ResumeDownload />, { locale: "en" });
    fireEvent.click(
      screen.getByRole("button", { name: /PDF options & generation/i }),
    );
    expect(
      screen.getByRole("link", { name: /HTML version for AI reading/i }),
    ).toHaveAttribute("href", "/curriculo/en");
    fireEvent.click(screen.getByRole("button", { name: /AI reading/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /open print preview/i }),
    );
    await waitFor(() => expect(generateResumePdf).toHaveBeenCalled());
    const html = generateResumePdf.mock.calls[0][0] as string;
    const filename = generateResumePdf.mock.calls[0][1] as string;
    expect(html).toContain('data-resume-format="ai-reading"');
    expect(filename).toBe("Tiago_Cosmai_CV_en_ai.pdf");
  });

  it("shows error alert when generateResumePdf rejects", async () => {
    generateResumePdf.mockRejectedValueOnce(new Error("x"));
    renderWithProviders(<ResumeDownload />, { locale: "en" });
    fireEvent.click(
      screen.getByRole("button", { name: /PDF options & generation/i }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: /open print preview/i }),
    );
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("custom mode: toggles checkboxes and generates successfully", async () => {
    generateResumePdf.mockResolvedValue(undefined);
    renderWithProviders(<ResumeDownload />, { locale: "en" });
    fireEvent.click(
      screen.getByRole("button", { name: /PDF options & generation/i }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: /^Custom /i }),
    );
    const checkboxes = screen.getAllByRole("checkbox");
    for (const cb of checkboxes) {
      fireEvent.click(cb);
      fireEvent.click(cb);
    }
    fireEvent.click(
      screen.getByRole("button", { name: /open print preview/i }),
    );
    await waitFor(() => expect(generateResumePdf).toHaveBeenCalled());
  });

  it("custom mode shows hint when no detail sections selected", () => {
    renderWithProviders(<ResumeDownload />, { locale: "en" });
    fireEvent.click(
      screen.getByRole("button", { name: /PDF options & generation/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: /^Custom /i }));
    const boxes = screen.getAllByRole("checkbox");
    const sectionBoxes = boxes.slice(0, 9);
    for (const idx of [1, 2, 3, 4]) {
      const cb = sectionBoxes[idx] as HTMLInputElement;
      if (cb?.checked) fireEvent.click(cb);
    }
    expect(
      screen.getByText(/No section with extra options is selected/i),
    ).toBeInTheDocument();
  });
});
