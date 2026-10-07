import type { Ref } from "react";

export default function BlogFrame({
  frameRef,
  title,
  isDark,
  onLoad,
  src,
}: {
  frameRef: Ref<HTMLIFrameElement>;
  title: string;
  isDark: boolean;
  onLoad: () => void;
  src: string;
}) {
  return (
    <iframe
      ref={frameRef}
      title={title}
      src={src}
      allow="clipboard-write; storage-access"
      onLoad={onLoad}
      className={`fixed top-16 left-0 z-30 block h-[calc(100dvh-4rem-3.5rem)] w-full border-0 ${
        isDark ? "bg-[#030806]" : "bg-[#f0fdf7]"
      }`}
    />
  );
}
