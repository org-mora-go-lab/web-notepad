import { type RefObject, useLayoutEffect, useState } from "react";

import { useNotepadStore } from "@/src/4-entity/notepad";

export function useVisualLines(
  content: string,
  editorRef: RefObject<HTMLTextAreaElement | null>,
) {
  const [visualLines, setVisualLines] = useState<number[]>([0]);
  // Font size changes rewrap lines without resizing the textarea.
  const fontScale = useNotepadStore((state) => state.settings.fontScale);

  useLayoutEffect(() => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const mirror = document.createElement("div");
    mirror.setAttribute("aria-hidden", "true");
    const editor = textarea.closest<HTMLElement>(".note-editor");
    if (!editor) return;
    mirror.style.position = "fixed";
    editor.append(mirror);

    const measure = () => {
      // Native textarea line boxes can round fractional heights differently in mobile WebViews.
      // Resolve the responsive/scaled target independently of the previous rounded override.
      mirror.style.lineHeight = "var(--editor-target-line-height)";
      const target = Number.parseFloat(getComputedStyle(mirror).lineHeight);
      if (Number.isFinite(target))
        editor.style.setProperty(
          "--editor-line-height",
          Math.round(target) + "px",
        );
      const style = getComputedStyle(textarea);
      Object.assign(mirror.style, {
        position: "fixed",
        top: "0",
        left: "0",
        visibility: "hidden",
        pointerEvents: "none",
        boxSizing: "border-box",
        width: `${textarea.clientWidth}px`,
        padding: style.padding,
        font: style.font,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        tabSize: style.tabSize,
        whiteSpace: style.whiteSpace,
        overflowWrap: style.overflowWrap,
        wordBreak: style.wordBreak,
        textSizeAdjust: style.getPropertyValue("text-size-adjust") || "100%",
        webkitTextSizeAdjust: "100%",
      });
      const logicalLines = content.split("\n");
      const blocks = logicalLines.map((line) => {
        const block = document.createElement("div");
        block.textContent = line || "\u200b";
        return block;
      });
      mirror.replaceChildren(...blocks);
      const lineHeight = Number.parseFloat(style.lineHeight);
      const nextLines = blocks.flatMap((block, index) =>
        Array.from(
          { length: Math.max(1, Math.round(block.offsetHeight / lineHeight)) },
          () => index,
        ),
      );
      editor.style.setProperty(
        "--editor-visual-line-count",
        String(nextLines.length),
      );
      setVisualLines((previous) =>
        previous.length === nextLines.length &&
        previous.every((line, index) => line === nextLines[index])
          ? previous
          : nextLines,
      );
    };

    const observer = new ResizeObserver(measure);
    observer.observe(textarea);
    measure();
    let active = true;
    void document.fonts.ready.then(() => {
      if (active) measure();
    });
    return () => {
      active = false;
      observer.disconnect();
      mirror.remove();
    };
  }, [content, editorRef, fontScale]);

  return visualLines;
}
