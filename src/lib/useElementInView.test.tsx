import { describe, expect, it, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { useElementInView } from "./useElementInView";

function Probe({ enabled }: { enabled: boolean }) {
  const inView = useElementInView("primary-content", enabled);
  return <span data-testid="in-view">{String(inView)}</span>;
}

describe("useElementInView", () => {
  afterEach(() => {
    delete (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver;
    document.getElementById("primary-content")?.remove();
  });

  it("treats a disabled watch as out of view", () => {
    render(<Probe enabled={false} />);
    expect(screen.getByTestId("in-view")).toHaveTextContent("false");
  });

  it("follows the intersection observer", () => {
    const element = document.createElement("div");
    element.id = "primary-content";
    document.body.appendChild(element);

    let report: IntersectionObserverCallback = () => {};
    class MockObserver {
      constructor(callback: IntersectionObserverCallback) {
        report = callback;
      }
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords() {
        return [];
      }
    }
    vi.stubGlobal("IntersectionObserver", MockObserver);

    render(<Probe enabled />);
    act(() => {
      report(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(screen.getByTestId("in-view")).toHaveTextContent("false");
  });
});
