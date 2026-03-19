import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App", () => {
  it("renderiza o hero", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /tiago cosmai/i }),
    ).toBeInTheDocument();
  });

  it("alterna tema claro/escuro", () => {
    window.scrollTo = vi.fn();
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /light mode/i }));
    expect(
      screen.getByRole("button", { name: /dark mode/i }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /dark mode/i }));
    expect(
      screen.getByRole("button", { name: /light mode/i }),
    ).toBeInTheDocument();
  });
});
