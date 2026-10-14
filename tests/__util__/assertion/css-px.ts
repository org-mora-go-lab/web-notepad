import { expect, type Locator } from "@playwright/test";

type PxProperty = "width" | "height" | "minWidth" | "fontSize" | "lineHeight";

// Fractional sizes snap to layout units (16.8px reads as 16.7969px), so compare within 0.05px.
export async function expectCssPx(
  locator: Locator,
  property: PxProperty,
  value: number,
  pseudo?: "::before",
) {
  await expect
    .poll(() =>
      locator.evaluate(
        (element, { property, pseudo }) =>
          parseFloat(getComputedStyle(element, pseudo)[property]),
        { property, pseudo },
      ),
    )
    .toBeCloseTo(value, 1);
}
