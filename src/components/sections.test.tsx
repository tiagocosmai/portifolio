import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/renderWithProviders";
import Expertise from "./Expertise";
import Certifications from "./Certifications";
import Education from "./Education";
import { Languages } from "./Languages";
import Hobbies from "./Hobbies";
import Project from "./Project";
import Courses from "./Courses";
import Main from "./Main";

describe("section components (smoke + headings)", () => {
  it("renders Expertise dark", () => {
    renderWithProviders(<Expertise />, { mode: "dark" });
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders Expertise light", () => {
    renderWithProviders(<Expertise />, { mode: "light" });
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders Certifications dark and light", () => {
    const { unmount } = renderWithProviders(<Certifications />, {
      mode: "dark",
    });
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    unmount();
    renderWithProviders(<Certifications />, { mode: "light" });
  });

  it("renders Education timeline", () => {
    renderWithProviders(<Education />, { mode: "dark" });
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renders Languages", () => {
    renderWithProviders(<Languages />, { mode: "light" });
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renders Hobbies", () => {
    renderWithProviders(<Hobbies />, { mode: "dark" });
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renders Project cards", () => {
    renderWithProviders(<Project />, { mode: "dark" });
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renders Courses", () => {
    renderWithProviders(<Courses />, { locale: "pt" });
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    renderWithProviders(<Courses />, { locale: "en" });
    renderWithProviders(<Courses />, { locale: "es" });
  });

  it("renders Main hero dark", () => {
    renderWithProviders(<Main />, { mode: "dark" });
    expect(
      screen.getByRole("heading", { name: /tiago cosmai/i }),
    ).toBeInTheDocument();
  });

  it("renders Main hero light", () => {
    renderWithProviders(<Main />, { mode: "light" });
    expect(
      screen.getByRole("heading", { name: /tiago cosmai/i }),
    ).toBeInTheDocument();
  });
});
