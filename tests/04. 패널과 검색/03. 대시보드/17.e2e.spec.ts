import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "./__util__";

test("17. 드롭 영역은 탭 분할과 같은 배경·점선을 표시하고 이탈·드롭하면 강조를 제거한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const source = dashboardColumn(page, "todo").locator(".dashboard-card");
  const target = dashboardColumn(page, "done");
  const area = target.locator(".dashboard-cards");
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
  await source.dispatchEvent("dragstart", { dataTransfer });
  await target.dispatchEvent("dragover", { dataTransfer });
  await expect(target).toHaveClass(/is-drop-target/);
  await expect(area).toHaveCSS("border-radius", "0px");
  await expect(area).toHaveCSS("background-color", "rgba(143, 227, 176, 0.08)");
  await expect(area).toHaveCSS("outline-style", "dashed");
  await expect(area).toHaveCSS("outline-width", "1px");
  await expect(area).toHaveCSS("outline-offset", "-1px");
  const signal = await area.evaluate((element) => getComputedStyle(element).getPropertyValue("--color-signal").trim());
  const expectedColor = await area.evaluate((element, color) => {
    const probe = document.createElement("span");
    probe.style.color = color;
    element.appendChild(probe);
    const result = getComputedStyle(probe).color;
    probe.remove();
    return result;
  }, signal);
  await expect(area).toHaveCSS("outline-color", expectedColor);
  await expect(area).toHaveCSS("box-shadow", "none");
  await expect(area).toHaveCSS("transition-duration", "0s");
  await expect(area).toHaveCSS("border-top-width", "0px");
  await target.dispatchEvent("dragleave", { dataTransfer });
  await expect(target).not.toHaveClass(/is-drop-target/);
  await expect(area).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(area).toHaveCSS("box-shadow", "none");
  await source.dispatchEvent("dragend", { dataTransfer });
  await expect(area).toHaveCSS("outline-style", "none");

  await source.dragTo(target);
  await expect(target).not.toHaveClass(/is-drop-target/);
  await expect(area).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
});
