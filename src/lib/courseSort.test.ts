import { describe, expect, it } from "vitest";
import {
  extractLatestYearFromCoursePt,
  sortCourseItemsByYearDesc,
} from "./courseSort";

describe("extractLatestYearFromCoursePt", () => {
  it("returns max year when range appears", () => {
    expect(
      extractLatestYearFromCoursePt(
        "Administração no Século 21 (Trilha de Conhecimento) 2018/2019 – 42 Horas",
      ),
    ).toBe(2019);
  });

  it("returns single year", () => {
    expect(extractLatestYearFromCoursePt("Foo – 2026 – 1 Hora")).toBe(2026);
  });

  it("returns 0 when no year", () => {
    expect(extractLatestYearFromCoursePt("Master Class GitHub Actions – 4 Horas")).toBe(
      0,
    );
  });
});

describe("sortCourseItemsByYearDesc", () => {
  it("orders newest first", () => {
    const sorted = sortCourseItemsByYearDesc([
      { pt: "A – 2010 – 1 Hora" },
      { pt: "B – 2026 – 1 Hora" },
      { pt: "C – 2020 – 2 Horas" },
    ]);
    expect(sorted.map((x) => x.pt)).toEqual([
      "B – 2026 – 1 Hora",
      "C – 2020 – 2 Horas",
      "A – 2010 – 1 Hora",
    ]);
  });
});
