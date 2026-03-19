import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { ThemeProvider, type ThemeMode } from "../context/ThemeContext";
import { LocaleProvider } from "../context/LocaleContext";
import type { Locale } from "../types/locale";

export function AllProviders({
  children,
  mode = "dark",
}: {
  children: ReactNode;
  mode?: ThemeMode;
}) {
  return (
    <ThemeProvider mode={mode}>
      <LocaleProvider>{children}</LocaleProvider>
    </ThemeProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions & { mode?: ThemeMode; locale?: Locale },
) {
  const { mode = "dark", locale, ...renderOptions } = options ?? {};
  try {
    localStorage.clear();
    if (locale) localStorage.setItem("portfolio-locale", locale);
  } catch {
    /* ignore */
  }
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders mode={mode}>{children}</AllProviders>
    ),
    ...renderOptions,
  });
}

/** Secções usadas por Navigation.scrollToSection */
export function mountSectionAnchors() {
  const ids = [
    "expertise",
    "certifications",
    "history",
    "education",
    "languages",
    "projects",
    "personal-projects",
    "courses",
    "hobbies",
    "resume",
    "contact",
  ];
  for (const id of ids) {
    if (!document.getElementById(id)) {
      const el = document.createElement("div");
      el.id = id;
      document.body.appendChild(el);
    }
  }
}
