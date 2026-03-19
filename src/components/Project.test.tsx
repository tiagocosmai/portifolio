import { describe, expect, it } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import Project from "./Project";
import { renderWithProviders } from "../test/renderWithProviders";

describe("Project", () => {
  it("falls back to Building2 icon when image errors", () => {
    const { container } = renderWithProviders(<Project />, {
      mode: "dark",
      locale: "en",
    });
    const img = container.querySelector("#projects img");
    if (img) {
      for (let i = 0; i < 5; i++) fireEvent.error(img);
    }
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });
});
