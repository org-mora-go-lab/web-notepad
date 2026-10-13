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
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
  await source.dispatchEvent("dragstart", { dataTransfer });
  await target.dispatchEvent("dragover", { dataTransfer });
  await expect(target).toHaveClass(/is-drop-target/);
  const brighter = await area.evaluate((element) => {
    const style = getComputedStyle(element);
    const context = document.createElement("canvas").getContext("2d")!;
    const channels = (color: string) => {
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      return Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3);
    };
    const original = channels(style.getPropertyValue("--color-raised").trim());
    return channels(style.backgroundColor).every((value, index) =>
      value > original[index] && Math.abs(value - (255 * 0.12 + original[index] * 0.88)) <= 1,
    );
  });
  expect(brighter).toBe(true);
  await expect(area).toHaveCSS("border-top-width", "0px");
  await target.dispatchEvent("dragleave", { dataTransfer });
  await expect(target).not.toHaveClass(/is-drop-target/);
  await expect(area).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await source.dispatchEvent("dragend", { dataTransfer });

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
