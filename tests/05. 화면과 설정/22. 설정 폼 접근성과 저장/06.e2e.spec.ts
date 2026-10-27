import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";

test("6. Panel Position은 Left와 Right를 제공하고 기본 Right를 선택한다", async ({
  page,
}) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const group = page.getByRole("radiogroup", { name: "Panel Position" });
  await expect(group.getByRole("radio")).toHaveCount(2);
  await expect(
    group.getByRole("radio", { name: "Right", exact: true }),
  ).toBeChecked();
});
