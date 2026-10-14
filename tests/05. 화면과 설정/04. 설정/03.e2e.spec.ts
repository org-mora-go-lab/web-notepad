import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { expectCssPx, openSettingsPanel } from "../../__util__";
import { settingsPanel, tabColorRadio } from "./__util__";

const COLOR_LABELS = ["Gray", "Red", "Orange", "Yellow", "Green", "Teal", "Indigo", "Purple", "Pink"];

test("3. 탭 색상 순서의 1·2·3번째 색상을 기본 9가지 색상 중에서 영문으로 선택하며 기본값은 Gray → Green → Purple다, 순서 안내의 색상 이름은 위아래 2px 여백과 해당 색상 배경으로 표시하고 선택 행 앞에 순번 숫자는 표시하지 않는다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);

  for (const order of [1, 2, 3]) {
    const group = settingsPanel(page).getByRole("radiogroup", { name: `Tab color ${order}` });
    const radios = group.getByRole("radio");
    await expect(radios).toHaveCount(9);
    expect(await radios.evaluateAll(items => items.map(item => item.getAttribute("aria-label"))))
      .toEqual(COLOR_LABELS);
    for (const radio of await radios.all()) await expect(radio).toBeVisible();
    await expect(group.locator("xpath=..")).toHaveText("");
  }
  await expect(tabColorRadio(page, 1, "Gray")).toBeChecked();
  await expect(tabColorRadio(page, 2, "Green")).toBeChecked();
  await expect(tabColorRadio(page, 3, "Purple")).toBeChecked();
  const hint = settingsPanel(page).locator(".setting-hint");
  await expect(hint).toHaveText("New tabs start with the first color.Gray → Green → Purple");
  expect(await hint.innerText()).toBe(
    "New tabs start with the first color.\nGray → Green → Purple",
  );
  await expect(hint.locator(".setting-hint-text")).toHaveCSS("padding-bottom", "10px");
  const chips = hint.locator(".setting-color-chip");
  await expect(chips).toHaveText(["Gray", "Green", "Purple"]);
  for (const [index, color] of ["rgb(184, 184, 176)", "rgb(143, 227, 176)", "rgb(195, 166, 245)"].entries()) {
    await expect(chips.nth(index)).toHaveCSS("background-color", color);
    await expect(chips.nth(index)).toHaveCSS("color", "rgb(17, 17, 16)");
    await expect(chips.nth(index)).toHaveCSS("padding", "2px 5px");
  }
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expectCssPx(hint, "fontSize", viewport.width <= 640 ? 18 : 15);
  }

  await tabColorRadio(page, 2, "Red").check();
  await expect(tabColorRadio(page, 2, "Red")).toBeChecked();
  await expect(tabColorRadio(page, 2, "Green")).not.toBeChecked();
  await expect(hint).toContainText("Gray → Red → Purple");
});
