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
    expect(window.location.pathname).toBe("/en/blog");
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
    expect(window.location.pathname).toBe("/en");
  });

  it("opens a shared article URL inside the portfolio shell", () => {
    localStorage.setItem("portfolio-locale", "pt");
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
      "/pt/blog/desenvolvedores-escravos-da-tecnologia-ia",
    );
  });

  it("rewrites the portfolio URL when the language changes outside the blog", () => {
    localStorage.setItem("portfolio-locale", "pt");
    window.history.replaceState(null, "", "/");
    render(<App />);
    expect(window.location.pathname).toBe("/pt");

    fireEvent.click(screen.getByRole("button", { name: "Idioma do site" }));
    fireEvent.click(screen.getByRole("button", { name: "EN" }));
    expect(window.location.pathname).toBe("/en");
  });

  it("switches the portfolio and the blog when the URL is in another language", () => {
    localStorage.setItem("portfolio-locale", "pt");
    window.history.replaceState(null, "", "/en/blog/o-agente-secreto");
    render(<App />);

    expect(screen.getByRole("button", { name: "Site language" })).toHaveTextContent("EN");
    expect(screen.getByTitle("Blog")).toHaveAttribute(
      "src",
      "http://localhost:5174/o-agente-secreto",
    );
    expect(window.location.pathname).toBe("/en/blog/o-agente-secreto");

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
      "/en/blog/desenvolvedores-escravos-da-tecnologia-ia",
    );

    fireEvent.click(screen.getByRole("button", { name: "Site language" }));
    fireEvent.click(screen.getByRole("button", { name: "ES" }));
    expect(window.location.pathname).toBe(
      "/es/blog/desenvolvedores-escravos-da-tecnologia-ia",
    );
    expect(localStorage.getItem("portfolio-locale")).toBe("es");
    expect(screen.getByRole("button", { name: "Idioma del sitio" })).toHaveTextContent("ES");
  });
});
