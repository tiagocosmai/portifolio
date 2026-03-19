import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { generateResumePdf } from "./generateResumePdf";

describe("generateResumePdf", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("completes print flow when iframe document is ready", async () => {
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => {});
    const p = generateResumePdf(
      "<!DOCTYPE html><html><head></head><body>ok</body></html>",
      "cv.pdf",
    );
    await vi.runAllTimersAsync();
    await p;
    printSpy.mockRestore();
  });

  it("rejects when iframe has no contentDocument", async () => {
    const orig = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "iframe") {
        const el = orig("iframe") as HTMLIFrameElement;
        Object.defineProperty(el, "contentDocument", {
          value: null,
          configurable: true,
        });
        Object.defineProperty(el, "contentWindow", {
          value: null,
          configurable: true,
        });
        return el;
      }
      return orig(tag);
    });
    await expect(
      generateResumePdf("<html></html>", "x.pdf"),
    ).rejects.toThrow("iframe_unavailable");
    vi.restoreAllMocks();
  });

  it("schedules print via onload when readyState is not complete", async () => {
    const orig = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "iframe") {
        const el = orig("iframe") as HTMLIFrameElement & {
          _doc?: { readyState: string };
        };
        const mockDoc = {
          open: vi.fn(),
          write: vi.fn(),
          close: vi.fn(),
          get readyState() {
            return "loading";
          },
        };
        const mockWin = { focus: vi.fn(), print: vi.fn() };
        Object.defineProperty(el, "contentDocument", {
          value: mockDoc,
          configurable: true,
        });
        Object.defineProperty(el, "contentWindow", {
          value: mockWin,
          configurable: true,
        });
        queueMicrotask(() => {
          if (typeof el.onload === "function") (el as HTMLIFrameElement).onload!(new Event("load"));
        });
        return el;
      }
      return orig(tag);
    });
    const p = generateResumePdf("<html></html>", "y.pdf");
    await vi.runAllTimersAsync();
    await p;
    vi.restoreAllMocks();
  });

  it("ignores print() throwing", async () => {
    const orig = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "iframe") {
        const el = orig("iframe") as HTMLIFrameElement;
        const mockWin = {
          focus: vi.fn(),
          print: vi.fn(() => {
            throw new Error("print blocked");
          }),
        };
        Object.defineProperty(el, "contentDocument", {
          value: {
            open: vi.fn(),
            write: vi.fn(),
            close: vi.fn(),
            readyState: "complete",
          },
          configurable: true,
        });
        Object.defineProperty(el, "contentWindow", {
          value: mockWin,
          configurable: true,
        });
        return el;
      }
      return orig(tag);
    });
    const p = generateResumePdf("<html></html>", "z.pdf");
    await vi.runAllTimersAsync();
    await p;
    vi.restoreAllMocks();
  });
});
