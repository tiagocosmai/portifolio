import type { Ref } from "react";
import { articlesFrameSrc } from "../embed/messages";

export default function BlogFrame({
  frameRef,
  title,
  isDark,
  onLoad,
}: {
  frameRef: Ref<HTMLIFrameElement>;
  title: string;
  isDark: boolean;
  onLoad: () => void;
}) {
  return (
    <iframe
      ref={frameRef}
      title={title}
      src={articlesFrameSrc()}
      onLoad={onLoad}
      className={`fixed top-16 left-0 z-30 block h-[calc(100dvh-4rem-3.5rem)] w-full border-0 ${
        isDark ? "bg-[#030806]" : "bg-[#f0fdf7]"
      }`}
    />
  );
}
