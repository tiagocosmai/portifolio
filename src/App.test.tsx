import { act, render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("renderiza o hero", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /tiago cosmai/i }),
    ).toBeInTheDocument();
  });

  it("alterna tema claro/escuro", () => {
    window.scrollTo = vi.fn();
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /light mode/i }));
    expect(
      screen.getByRole("button", { name: /dark mode/i }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /dark mode/i }));
    expect(
      screen.getByRole("button", { name: /light mode/i }),
    ).toBeInTheDocument();
  });

  it("opens the blog in an iframe and returns to the chosen section", () => {
    localStorage.setItem("portfolio-locale", "en");
    const scrollIntoView = vi
      .spyOn(Element.prototype, "scrollIntoView")
      .mockImplementation(() => {});
    render(<App />);

    fireEvent.click(screen.getAllByRole("button", { name: /^blog$/i }).at(-1)!);

    const frame = screen.getByTitle("Blog") as HTMLIFrameElement;
    expect(frame).toHaveAttribute("src", "http://localhost:5174/");
    expect(frame).toHaveAttribute("allow", "clipboard-write");
    expect(window.location.pathname).toBe("/blog");
    expect(
      screen.queryByRole("heading", { name: /tiago cosmai/i }),
    ).not.toBeInTheDocument();

    const postMessage = vi
      .spyOn(frame.contentWindow!, "postMessage")
      .mockImplementation(() => {});
    fireEvent.click(screen.getByRole("button", { name: /light mode/i }));
    expect(postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        topic: "preferences",
        theme: "light",
        locale: "en",
      }),
      "http://localhost:5174",
    );

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: "http://localhost:5174",
          data: { channel: "tiagocosmai-embed", topic: "scroll", scrollY: 500 },
        }),
      );
    });
    fireEvent.click(screen.getByRole("button", { name: /back to top/i }));
    expect(postMessage).toHaveBeenCalledWith(
      expect.objectContaining({ topic: "scroll-top" }),
      "http://localhost:5174",
    );
    expect(screen.getByTitle("Blog")).toBeInTheDocument();

    fireEvent.click(
      screen.getAllByRole("button", { name: /expertise/i }).at(-1)!,
    );
    expect(
      screen.getByRole("heading", { name: /tiago cosmai/i }),
    ).toBeInTheDocument();
    expect(scrollIntoView).toHaveBeenCalled();
    expect(screen.queryByTitle("Blog")).not.toBeInTheDocument();
    expect(window.location.pathname).toBe("/");
  });

  it("opens a shared article URL inside the portfolio shell", () => {
    window.history.replaceState(null, "", "/blog/o-agente-secreto");
    render(<App />);

    const frame = screen.getByTitle("Blog") as HTMLIFrameElement;
    expect(frame).toHaveAttribute(
      "src",
      "http://localhost:5174/o-agente-secreto",
    );
    expect(
      screen.queryByRole("heading", { name: /tiago cosmai/i }),
    ).not.toBeInTheDocument();

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: "http://localhost:5174",
          data: {
            channel: "tiagocosmai-embed",
            topic: "location",
            pathname: "/desenvolvedores-escravos-da-tecnologia-ia",
            search: "",
          },
        }),
      );
    });
    expect(window.location.pathname).toBe(
      "/blog/desenvolvedores-escravos-da-tecnologia-ia",
    );
  });
});
