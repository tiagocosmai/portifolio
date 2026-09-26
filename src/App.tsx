import { useCallback, useEffect, useRef, useState } from "react";
import {
  Main,
  Timeline,
  Expertise,
  Certifications,
  Education,
  Languages,
  Hobbies,
  Project,
  PersonalProjects,
  Courses,
  Contact,
  Navigation,
  Footer,
} from "./components";
import BlogFrame from "./components/BlogFrame";
import FadeIn from "./components/FadeIn";
import { FixedSocialBar } from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider, type ThemeMode } from "./context/ThemeContext";
import { LocaleProvider, useLocale } from "./context/LocaleContext";
import { SHOW_CONTACT } from "./config/features";
import {
  isArticlesFrameOrigin,
  parseBlogScrollY,
  postToFrame,
  preferencesMessage,
  scrollTopMessage,
} from "./embed/messages";
import { useElementInView } from "./lib/useElementInView";

function App() {
  const [mode, setMode] = useState<ThemeMode>("dark");

  const handleModeChange = () => {
    setMode((m) => (m === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    document.title = "Portifólio - Tiago Cosmai";
  }, []);

  return (
    <ThemeProvider mode={mode}>
      <LocaleProvider>
        <PortfolioShell mode={mode} onModeChange={handleModeChange} />
      </LocaleProvider>
    </ThemeProvider>
  );
}

function PortfolioShell({
  mode,
  onModeChange,
}: {
  mode: ThemeMode;
  onModeChange: () => void;
}) {
  const { locale, t } = useLocale();
  const [view, setView] = useState<"portfolio" | "blog">("portfolio");
  const [blogScrollY, setBlogScrollY] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pendingSection = useRef<string | null>(null);
  const prefsRef = useRef({ locale, theme: mode });
  prefsRef.current = { locale, theme: mode };

  const primaryVisible = useElementInView(
    "primary-content",
    view === "portfolio",
    "-64px 0px 0px 0px",
  );
  const socialBarVisible = view === "blog" || !primaryVisible;
  const isDark = mode === "dark";

  const publishPreferences = useCallback(() => {
    const frame = iframeRef.current?.contentWindow;
    if (!frame) return;
    const current = prefsRef.current;
    try {
      postToFrame(frame, preferencesMessage(current.locale, current.theme));
    } catch {
      /* The iframe is still on about:blank. */
    }
  }, []);

  useEffect(() => {
    if (view !== "blog") return;
    publishPreferences();
  }, [view, locale, mode, publishPreferences]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!isArticlesFrameOrigin(event.origin)) return;
      const scrollY = parseBlogScrollY(event.data);
      if (scrollY === null) return;
      setBlogScrollY(scrollY);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (view !== "portfolio") return;
    const id = pendingSection.current;
    if (!id) return;
    pendingSection.current = null;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, [view]);

  const openBlog = () => {
    setBlogScrollY(0);
    setView("blog");
  };

  const openSection = (id: string) => {
    if (view === "blog") {
      pendingSection.current = id;
      setView("portfolio");
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollBlogToTop = () => {
    const frame = iframeRef.current?.contentWindow;
    if (!frame) return;
    try {
      postToFrame(frame, scrollTopMessage());
    } catch {
      /* The iframe is still on about:blank. */
    }
  };

  return (
    <div
      className={`relative min-h-screen font-sans transition-colors duration-300 ${
        isDark ? "bg-[#030806] text-white" : "bg-[#f0fdf7] text-[#0d1116]"
      } ${view === "portfolio" && socialBarVisible ? "pb-16" : ""}`}
    >
      <Navigation
        mode={mode}
        modeChange={onModeChange}
        blogActive={view === "blog"}
        onOpenBlog={openBlog}
        onOpenSection={openSection}
      />
      {view === "blog" ? (
        <BlogFrame
          frameRef={iframeRef}
          title={t("nav_blog")}
          isDark={isDark}
          onLoad={publishPreferences}
        />
      ) : (
        <>
          <FadeIn transitionDuration={700}>
            <Main />
            <Expertise />
            <Certifications />
            <Timeline />
            <Education />
            <Languages />
            <Project />
            <PersonalProjects />
            <Courses />
            <Hobbies />
            {SHOW_CONTACT ? <Contact /> : null}
          </FadeIn>
          <Footer />
        </>
      )}
      <FixedSocialBar visible={socialBarVisible} />
      <ScrollToTop
        blogActive={view === "blog"}
        blogScrollY={blogScrollY}
        onBlogScrollTop={scrollBlogToTop}
        docked={socialBarVisible}
      />
    </div>
  );
}

export default App;
