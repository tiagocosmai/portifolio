import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LocaleProvider, useLocale } from "./LocaleContext";
import { ThemeProvider } from "./ThemeContext";

function Probe() {
  const { locale, setLocale, t } = useLocale();
  return (
    <div>
      <span data-testid="loc">{locale}</span>
      <span data-testid="nav">{t("nav_contact")}</span>
      <button type="button" onClick={() => setLocale("es")}>
        es
      </button>
    </div>
  );
}

describe("LocaleProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "en";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("provides locale and t()", () => {
    localStorage.setItem("portfolio-locale", "en");
    render(
      <ThemeProvider mode="dark">
        <LocaleProvider>
          <Probe />
        </LocaleProvider>
      </ThemeProvider>,
    );
    expect(screen.getByTestId("loc")).toHaveTextContent("en");
    expect(screen.getByTestId("nav").textContent).toBeTruthy();
  });

  it("setLocale updates html lang and persists", () => {
    render(
      <ThemeProvider mode="dark">
        <LocaleProvider>
          <Probe />
        </LocaleProvider>
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "es" }));
    expect(screen.getByTestId("loc")).toHaveTextContent("es");
    expect(document.documentElement.lang).toBe("es");
    expect(localStorage.getItem("portfolio-locale")).toBe("es");
  });

  it("t returns key when missing from resources", () => {
    function BadKey() {
      const { t } = useLocale();
      return <span>{t("___nonexistent_key___")}</span>;
    }
    render(
      <ThemeProvider mode="dark">
        <LocaleProvider>
          <BadKey />
        </LocaleProvider>
      </ThemeProvider>,
    );
    expect(screen.getByText("___nonexistent_key___")).toBeInTheDocument();
  });

  it("ignores localStorage errors on read", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    render(
      <ThemeProvider mode="dark">
        <LocaleProvider>
          <Probe />
        </LocaleProvider>
      </ThemeProvider>,
    );
    expect(screen.getByTestId("loc")).toHaveTextContent("en");
  });

  it("ignores localStorage errors on setLocale", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("denied");
    });
    render(
      <ThemeProvider mode="dark">
        <LocaleProvider>
          <Probe />
        </LocaleProvider>
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "es" }));
    expect(screen.getByTestId("loc")).toHaveTextContent("es");
  });

  it("useLocale throws outside provider", () => {
    function Oops() {
      useLocale();
      return null;
    }
    expect(() => render(<Oops />)).toThrow(/useLocale must be used within LocaleProvider/);
  });
});
