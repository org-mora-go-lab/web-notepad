import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";

test("4. English와 한국어 선택지는 올바른 lang 속성을 가진다", async ({
  page,
}) => {
  await page.goto("/");
  await openSettingsPanel(page);
  await expect(
    page.getByRole("radio", { name: "English" }).locator(".."),
  ).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("radio", { name: "한국어" }).locator(".."),
  ).toHaveAttribute("lang", "ko");
});
