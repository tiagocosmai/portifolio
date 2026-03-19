import { describe, expect, it } from "vitest";
import coursesData from "../data/courses.json";
import {
  localizeCourseLine,
  localizeCourseProvider,
  type CoursesDataPt,
} from "./courseI18n";

describe("localizeCourseProvider", () => {
  it("returns PT unchanged", () => {
    expect(localizeCourseProvider("Fundação Bradesco", "pt")).toBe(
      "Fundação Bradesco",
    );
  });

  it("maps known providers to EN/ES", () => {
    expect(localizeCourseProvider("Fundação Bradesco", "en")).toBe(
      "Bradesco Foundation",
    );
    expect(localizeCourseProvider("Fundação Bradesco", "es")).toBe(
      "Fundación Bradesco",
    );
  });

  it("returns original string for unknown provider", () => {
    expect(localizeCourseProvider("Unknown Org XYZ", "en")).toBe("Unknown Org XYZ");
    expect(localizeCourseProvider("Unknown Org XYZ", "es")).toBe("Unknown Org XYZ");
  });
});

describe("localizeCourseLine — exhaustive courses.json", () => {
  const data = coursesData as CoursesDataPt;

  it("translates every distance course line to en and es", () => {
    for (const g of data.distance) {
      for (const it of g.items) {
        const en = localizeCourseLine(it.pt, "en");
        const es = localizeCourseLine(it.pt, "es");
        expect(typeof en).toBe("string");
        expect(typeof es).toBe("string");
        expect(en.length).toBeGreaterThan(0);
        expect(es.length).toBeGreaterThan(0);
      }
    }
  });

  it("translates presential and events", () => {
    for (const it of data.presential) {
      expect(localizeCourseLine(it.pt, "en")).toBeTruthy();
      expect(localizeCourseLine(it.pt, "es")).toBeTruthy();
    }
    for (const it of data.events) {
      expect(localizeCourseLine(it.pt, "en")).toBeTruthy();
      expect(localizeCourseLine(it.pt, "es")).toBeTruthy();
    }
  });

  it("returns PT unchanged", () => {
    const line = data.distance[0]?.items[0]?.pt ?? "x";
    expect(localizeCourseLine(line, "pt")).toBe(line);
  });
});

describe("localizeCourseLine — normalization edges", () => {
  it("handles hours suffix patterns in EN/ES", () => {
    const s = "Foo – 2020 – 5 Horas";
    expect(localizeCourseLine(s, "en")).toMatch(/hours/i);
    expect(localizeCourseLine(s, "es")).toMatch(/horas/i);
  });
});
