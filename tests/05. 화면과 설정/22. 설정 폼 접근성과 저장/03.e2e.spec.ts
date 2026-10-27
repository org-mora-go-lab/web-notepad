import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";

test("3. Language 설정은 두 언어를 각 언어 표기로 제공한다", async ({
  page,
}) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const group = page.getByRole("radiogroup", { name: "Language" });
  await expect(group.getByRole("radio")).toHaveCount(2);
  await expect(group.getByRole("radio", { name: "English" })).toBeChecked();
  await expect(group.getByRole("radio", { name: "한국어" })).not.toBeChecked();
});
