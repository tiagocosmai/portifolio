import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import Contact from "./Contact";
import { renderWithProviders } from "../test/renderWithProviders";

describe("Contact", () => {
  let hrefValue: string;
  let origLocation: Location;

  beforeEach(() => {
    origLocation = window.location;
    hrefValue = "http://localhost/";
    // jsdom: substituir location para permitir mailto sem navigation
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        get href() {
          return hrefValue;
        },
        set href(v: string) {
          hrefValue = v;
        },
        assign: () => {},
        replace: () => {},
        reload: () => {},
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: origLocation,
    });
  });

  it("shows validation messages when submitting empty", () => {
    renderWithProviders(<Contact />, { mode: "dark", locale: "en" });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));
    expect(
      screen.getByText(/please enter your name/i),
    ).toBeInTheDocument();
  });

  it("submits via mailto and shows success message", () => {
    renderWithProviders(<Contact />, { mode: "light", locale: "en" });
    fireEvent.change(screen.getByLabelText(/your name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "a@b.co" },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: "Hello" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));
    expect(hrefValue).toMatch(/^mailto:/);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
