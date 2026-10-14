import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { closePanelWithX, panelPinButton } from "../__util__";

test("9. X로 고정 패널을 닫아도 다음 패널을 고정 상태로 연다", async ({
  page,
}) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "dashboard-panel");
  await panelPinButton(page, "dashboard-panel").click();
  await closePanelWithX(page, "dashboard-panel");

  await openPanel(page, "global-search-panel");
  await expect(panelPinButton(page, "global-search-panel")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator(".global-search")).toHaveClass(/is-pinned/);
});
