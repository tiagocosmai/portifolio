import { useThemeMode } from "../context/ThemeContext";
import ResumeDownload from "./ResumeDownload";
import { SocialLinksRow } from "./SocialLinksRow";

export function FixedSocialBar({ visible }: { visible: boolean }) {
  const mode = useThemeMode();
  const isDark = mode === "dark";

  if (!visible) return null;

  return (
    <div
      data-testid="fixed-social-bar"
      className={`fixed inset-x-0 bottom-0 z-[60] border-t ${
        isDark
          ? "border-white/10 bg-[#030806]"
          : "border-black/10 bg-[#f0fdf7]"
      }`}
    >
      <div className="flex h-14 items-center justify-center px-16">
        <SocialLinksRow variant="footer" />
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      id="resume"
      className="scroll-mt-20 border-t border-black/10 py-10 dark:border-white/10"
    >
      <div className="px-[5%] md:px-[10%]">
        <ResumeDownload />
      </div>
    </footer>
  );
}
