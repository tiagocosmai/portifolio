import { describe, expect, it } from "vitest";
import {
  Main,
  Navigation,
  Footer,
  Expertise,
  Certifications,
  Timeline,
  Education,
  Languages,
  Hobbies,
  Project,
  PersonalProjects,
  Courses,
  Contact,
} from "./index";

describe("components barrel", () => {
  it("exports all section components", () => {
    expect(Main).toBeDefined();
    expect(Navigation).toBeDefined();
    expect(Footer).toBeDefined();
    expect(Expertise).toBeDefined();
    expect(Certifications).toBeDefined();
    expect(Timeline).toBeDefined();
    expect(Education).toBeDefined();
    expect(Languages).toBeDefined();
    expect(Hobbies).toBeDefined();
    expect(Project).toBeDefined();
    expect(PersonalProjects).toBeDefined();
    expect(Courses).toBeDefined();
    expect(Contact).toBeDefined();
  });
});
