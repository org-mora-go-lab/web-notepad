import { expect, test } from "@playwright/test";

import { groupsCommand } from "../../__util__";

test("7. 생성 입력란은 Groups 톤을 유지하고 추가 버튼의 아이콘과 테두리만 밝게 표시한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();

  await expect(page.locator(".group-create-form")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(page.getByRole("textbox", { name: "New group name" })).toHaveCSS(
    "background-color",
    "rgb(21, 21, 20)",
  );
  const createButton = page.getByRole("button", { name: "Create group" });
  await expect(createButton).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(createButton).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(createButton).toHaveCSS("border-color", "rgb(80, 80, 80)");
});
