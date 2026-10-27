import { expect, test } from "@playwright/test";

import { prepareMarkedWorkspace, switchWorkspaceToKorean } from "../__util__";

test("5. 언어 변경은 탭·편집기·줄 번호의 접근성 이름을 즉시 바꾼다", async ({
  page,
}) => {
  await prepareMarkedWorkspace(page);
  await expect(page.getByRole("tablist", { name: "Note tabs" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "New tab", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Change Alpha task tab color" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close Alpha task", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".line-rail")).toHaveAttribute(
    "aria-label",
    "Line numbers",
  );
  await expect(
    page.getByRole("textbox", { name: "Alpha task note content" }),
  ).toBeVisible();
  const panel = await switchWorkspaceToKorean(page);
  await expect(page.getByRole("tablist", { name: "메모 탭" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "새 탭", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Alpha task 탭 색상 변경" }),
  ).toBeVisible();
  await expect(page.locator(".line-rail")).toHaveAttribute(
    "aria-label",
    "라인 번호",
  );
  await expect(
    page.getByRole("textbox", { name: "Alpha task 메모 내용" }),
  ).toBeVisible();
  await panel.getByRole("button", { name: "설정 닫기", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Alpha task 닫기", exact: true }),
  ).toBeVisible();
});
