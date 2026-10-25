import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { selectBoardPost } from "../../__util__";

test("7. 저장 실패 시 작성 중 내용을 유지하고 다시 저장할 수 있다", async ({
  page,
  boardPost,
}) => {
  await page.goto("/?role=admin");
  await page.locator("textarea.note-area").fill("Unrelated note");
  await selectBoardPost(page, boardPost.title);
  await page.getByRole("button", { name: "Edit post", exact: true }).click();
  await page.getByLabel("Description", { exact: true }).fill("Keep this draft");
  await page.getByLabel("Description", { exact: true }).press("Alt+Backspace");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("textarea.note-area")).toHaveValue("Unrelated note");
  await page.getByLabel("Description", { exact: true }).fill("Keep this draft");
  await page.route("**/api/board?role=admin", (route) =>
    route.fulfill({ status: 503, json: { error: "Unavailable" } }),
  );
  await page.getByRole("button", { name: "Save post", exact: true }).click();
  await expect(page.locator("#board-panel").getByRole("alert")).toContainText(
    "Your input has been kept",
  );
  await expect(page.getByLabel("Description", { exact: true })).toHaveValue(
    "Keep this draft",
  );
  await page.unroute("**/api/board?role=admin");
  await page.getByRole("button", { name: "Save post", exact: true }).click();
  await expect(
    page.getByRole("searchbox", { name: "Search shared groups" }),
  ).toBeVisible();
});
