import type { Page } from "@playwright/test";

// Reads the editor layout values shared by the PC and mobile format tests.
export const getEditorFormat = (page: Page) =>
  page.locator(".note-editor").evaluate((element) => {
    const lineRail = element.querySelector(".line-rail")!;
    const firstLine = lineRail.querySelector("span")!;
    const textarea = element.querySelector(".note-area")!;
    const editorStyle = getComputedStyle(element);

    return {
      lineRailWidth: lineRail.getBoundingClientRect().width,
      // The variable scales with the font setting, so read the resolved line number height.
      lineHeight: `${firstLine.getBoundingClientRect().height}px`,
      topPadding: editorStyle.getPropertyValue("--editor-top-padding").trim(),
      lineNumberPadding: getComputedStyle(firstLine).paddingRight,
      editorPadding: getComputedStyle(textarea).padding,
    };
  });
