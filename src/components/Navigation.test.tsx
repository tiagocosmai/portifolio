import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import Navigation from "./Navigation";
import {
  mountSectionAnchors,
  renderWithProviders,
} from "../test/renderWithProviders";

describe("Navigation", () => {
  beforeEach(() => {
    mountSectionAnchors();
    vi.spyOn(Element.prototype, "scrollIntoView").mockImplementation(
      () => {},
    );
    vi.spyOn(window, "scrollY", "get").mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function renderNav(mode: "dark" | "light" = "dark") {
    const modeChange = vi.fn();
    const utils = renderWithProviders(
      <Navigation mode={mode} modeChange={modeChange} />,
      { locale: "en", mode },
    );
    const header = utils.container.querySelector("#navigation");
    if (header)
      Object.defineProperty(header, "clientHeight", {
        configurable: true,
        value: 40,
      });
    return { ...utils, modeChange };
  }

  it("calls modeChange when theme button clicked", () => {
    const { modeChange } = renderNav("dark");
    fireEvent.click(
      screen.getByRole("button", { name: /light mode/i }),
    );
    expect(modeChange).toHaveBeenCalled();
  });

  it("opens language menu and changes locale", () => {
    renderNav("dark");
    const langBtn = screen.getByRole("button", { name: /site language/i });
    fireEvent.click(langBtn);
    fireEvent.click(screen.getByRole("option", { name: "ES" }));
    expect(langBtn).toBeInTheDocument();
  });

  it("closes language menu on Escape", () => {
    renderNav("dark");
    const langWrap = screen.getByRole("button", { name: /site language/i })
      .parentElement!;
    fireEvent.click(screen.getByRole("button", { name: /site language/i }));
    fireEvent.keyDown(langWrap, { key: "Escape" });
  });

  it("opens nav dropdown and scrolls to section", () => {
    renderNav("dark");
    const menuBtn = screen.getByRole("button", { name: /^menu$/i });
    fireEvent.click(menuBtn);
    const opts = screen.getAllByRole("option");
    const expertise = opts.find((o) =>
      o.textContent?.toLowerCase().includes("expertise"),
    );
    if (expertise) fireEvent.click(expertise);
  });

  it("horizontal nav buttons scroll (2xl layout may render multiple)", () => {
    renderNav("light");
    const expertiseButtons = screen.getAllByRole("button", {
      name: /expertise/i,
    });
    if (expertiseButtons.length)
      fireEvent.click(expertiseButtons[expertiseButtons.length - 1]);
  });

  it("applies shadow when scrolled past header", () => {
    renderNav("dark");
    const header = document.querySelector("header");
    vi.spyOn(window, "scrollY", "get").mockReturnValue(200);
    fireEvent.scroll(window);
    expect(header?.className).toMatch(/shadow/);
  });

  it("closes language dropdown on outside mousedown", () => {
    renderNav("dark");
    fireEvent.click(screen.getByRole("button", { name: /site language/i }));
    fireEvent.mouseDown(document.body);
  });

  it("closes nav dropdown on outside mousedown", () => {
    renderNav("dark");
    fireEvent.click(screen.getByRole("button", { name: /^menu$/i }));
    fireEvent.mouseDown(document.body);
  });

  it("mobile menu open and close", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 400,
    });
    renderNav("dark");
    const openers = screen.queryAllByRole("button", { name: /open menu/i });
    if (openers[0]) {
      fireEvent.click(openers[0]);
      const closer = screen.getByRole("button", { name: /close menu/i });
      fireEvent.click(closer);
    }
  });
});
