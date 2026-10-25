import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { selectBoardPost } from "../../__util__";

test("1. role admin으로 접속하면 관리 화면을 열고 수정 내용은 다른 방문자에게도 저장된다", async ({
  page,
  request,
  boardPost,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem("web-notepad-group-sidebar-open", "true"));
  await page.goto("/?role=admin");
  await expect(page.locator("#board-panel")).toBeVisible();
  await expect(page.locator("#groups-menu")).toHaveCount(0);
  await expect(page.getByText("Admin mode", { exact: true })).toBeVisible();
  await selectBoardPost(page, boardPost.title);
  await page.getByRole("button", { name: "Edit post", exact: true }).click();
  const title = boardPost.title + " updated";
  await page.getByLabel("Post title", { exact: true }).fill(title);
  await page
    .getByLabel("Description", { exact: true })
    .fill("Updated description");
  await page.getByRole("button", { name: "Save post", exact: true }).click();
  await page
    .getByRole("searchbox", { name: "Search shared groups" })
    .fill(title);
  await expect(page.locator(".board-card")).toContainText(
    "Updated description",
  );
  const { posts } = await (await request.get("/api/board")).json();
  expect(
    posts.find((p: { id: string }) => p.id === boardPost.id),
  ).toMatchObject({ title, description: "Updated description" });
});
