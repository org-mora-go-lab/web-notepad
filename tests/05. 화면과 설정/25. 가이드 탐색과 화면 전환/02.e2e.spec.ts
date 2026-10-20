import { expect, test } from "@playwright/test";

import { openGuide } from "../../__util__";

test("2. 다음 단계에서 Previous를 누르면 이전 제목과 설명으로 돌아간다", async ({
  page,
}) => {
  await page.goto("/");
  const guide = await openGuide(page);
  const description = await guide
    .locator(".user-guide-description p")
    .innerText();
  await guide.getByRole("button", { name: "Next", exact: true }).click();
  await expect(guide.locator("h4")).toHaveText("Write notes");
  await guide.getByRole("button", { name: "Previous", exact: true }).click();
  await expect(guide.locator("h4")).toHaveText("Keyboard shortcuts");
  await expect(guide.locator(".user-guide-description p")).toHaveText(
    description,
  );
});
