import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

// Starts dragging a tab and holds it over the pane editor at the given relative position.
// Returns a function that moves the tab back to where it started and releases it.
export async function hoverTabOverPane(
  page: Page,
  tab: Locator,
  pane: Locator,
  xRatio: number,
  yRatio: number,
) {
  const draggableTab = tab.locator(
    "xpath=ancestor-or-self::*[@draggable='true'][1]",
  );
  const draggableHandle = await draggableTab.elementHandle();
  if (!draggableHandle) throw new Error("Could not resolve draggable tab");
  await draggableHandle.evaluate((element) => {
    const transfer = new DataTransfer();
    (window as typeof window & { __e2eTabTransfer?: DataTransfer })[
      "__e2eTabTransfer"
    ] = transfer;
    element.dispatchEvent(
      new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: transfer,
      }),
    );
  });
  await expect(draggableTab).toHaveClass(/is-dragging/);
  // Enter the editor in its upper part first so later moves register as drag-over updates.
  await moveOverPane(page, pane, xRatio, 0.25);
  await moveOverPane(page, pane, xRatio, yRatio);
  return async () => {
    await draggableHandle.evaluate((element) => {
      const testWindow = window as typeof window & {
        __e2eTabTransfer?: DataTransfer;
      };
      element.dispatchEvent(
        new DragEvent("dragend", {
          bubbles: true,
          dataTransfer: testWindow.__e2eTabTransfer,
        }),
      );
      delete testWindow.__e2eTabTransfer;
    });
  };
}

// Moves the held pointer over the pane editor at the given relative position.
export async function moveOverPane(
  page: Page,
  pane: Locator,
  xRatio: number,
  yRatio: number,
) {
  const body = pane.locator(".body");
  const bodyBox = (await body.boundingBox())!;
  await body.evaluate(
    (element, point) => {
      const transfer = (
        window as typeof window & { __e2eTabTransfer?: DataTransfer }
      ).__e2eTabTransfer;
      for (const type of ["dragenter", "dragover"])
        element.dispatchEvent(
          new DragEvent(type, {
            bubbles: true,
            cancelable: true,
            clientX: point.x,
            clientY: point.y,
            dataTransfer: transfer,
          }),
        );
    },
    {
      x: bodyBox.x + bodyBox.width * xRatio,
      y: bodyBox.y + bodyBox.height * yRatio,
    },
  );
}
