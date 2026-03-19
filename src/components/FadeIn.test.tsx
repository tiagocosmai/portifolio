import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import FadeIn from "./FadeIn";

describe("FadeIn", () => {
  it("renders children with staggered visibility", async () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    render(
      <FadeIn delay={10} transitionDuration={20} onComplete={onComplete}>
        <span>a</span>
        <span>b</span>
      </FadeIn>,
    );
    expect(screen.getByText("a")).toBeInTheDocument();
    await vi.advanceTimersByTimeAsync(500);
    vi.useRealTimers();
  });

  it("visible false animates toward hidden", async () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <FadeIn delay={5} transitionDuration={10} visible>
        <span>x</span>
      </FadeIn>,
    );
    rerender(
      <FadeIn delay={5} transitionDuration={10} visible={false}>
        <span>x</span>
      </FadeIn>,
    );
    await vi.advanceTimersByTimeAsync(200);
    vi.useRealTimers();
  });

  it("uses custom wrapper tags", () => {
    const { container } = render(
      <FadeIn wrapperTag="section" childTag="p">
        <span>in</span>
      </FadeIn>,
    );
    expect(container.querySelector("section")).toBeTruthy();
    expect(container.querySelector("p")).toBeTruthy();
  });
});
