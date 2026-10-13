import { expect, test } from "@playwright/test";

import { openPanel } from "../__util__";
import { dashboardColumn, dashboardPanel, seedDashboardTabs } from "./__util__";

test("7. 비어 있는 컬럼도 카드 하나가 들어갈 만큼의 공간을 유지하고 테두리 없이 제목 아래 어디에 놓아도 이동한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const card = (await dashboardColumn(page, "todo").locator(".dashboard-card").boundingBox())!;

  const source = dashboardColumn(page, "todo").locator(".dashboard-card");
  const target = dashboardColumn(page, "done");
  const area = target.locator(".dashboard-cards");
  const firstTargetCard = area.locator(".dashboard-card").first();
  const beforeDrag = (await firstTargetCard.boundingBox())!;
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
  await source.dispatchEvent("dragstart", { dataTransfer });
  await target.dispatchEvent("dragover", { dataTransfer });
  await expect(target).toHaveClass(/is-drop-target/);
  const highlightedArea = (await area.boundingBox())!;
  const duringDrag = (await firstTargetCard.boundingBox())!;
  expect(duringDrag).toEqual(beforeDrag);
  expect(duringDrag.y - highlightedArea.y).toBeCloseTo(6, 0);
  expect(duringDrag.x - highlightedArea.x).toBeCloseTo(6, 0);
  expect(highlightedArea.x + highlightedArea.width - duringDrag.x - duringDrag.width).toBeCloseTo(6, 0);
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
  expect(await firstTargetCard.boundingBox()).toEqual(beforeDrag);
  await expect(area).toHaveCSS("box-shadow", "none");
  await source.dispatchEvent("dragend", { dataTransfer });
  await expect(area).toHaveCSS("outline-style", "none");

  await dashboardColumn(page, "todo").locator(".dashboard-card").dragTo(dashboardColumn(page, "done"));
  await expect(dashboardColumn(page, "todo").locator(".dashboard-card")).toHaveCount(0);
  await expect(target).not.toHaveClass(/is-drop-target/);
  await expect(area).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  const empty = (await dashboardColumn(page, "todo").locator(".dashboard-cards").boundingBox())!;
  expect(empty.height).toBeGreaterThanOrEqual(card.height);
  await expect(dashboardColumn(page, "todo").locator(".dashboard-cards")).toHaveCSS("border-top-width", "0px");

  // Dropping far below the title, near the bottom of the column, still moves the card.
  const column = (await dashboardColumn(page, "todo").boundingBox())!;
  const list = (await dashboardPanel(page).locator(".dashboard-list").boundingBox())!;
  // The column reaches the bottom of the panel (minus its 14px padding).
  expect(column.y + column.height).toBeCloseTo(list.y + list.height - 14, 0);
  await dashboardColumn(page, "done").locator(".dashboard-card").first().dragTo(dashboardColumn(page, "todo"), {
    targetPosition: { x: column.width / 2, y: column.height - 8 },
  });
  await expect(dashboardColumn(page, "todo").locator(".dashboard-card")).toHaveCount(1);
});
