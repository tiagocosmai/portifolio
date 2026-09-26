import { useEffect, useState } from "react";

export function useElementInView(
  elementId: string,
  enabled: boolean,
  rootMargin = "0px",
) {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setInView(false);
      return;
    }

    const element = document.getElementById(elementId);
    if (!element || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { rootMargin });
    observer.observe(element);
    return () => observer.disconnect();
  }, [elementId, enabled, rootMargin]);

  return inView;
}
