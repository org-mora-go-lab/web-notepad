import { expect, test } from "@playwright/test";

test("7. HTML 형태로 작성한 노트는 재방문해도 실행 없이 원문을 유지한다", async ({
  page,
}) => {
  await page.goto("/");
  const content = '<script>alert("x")</script>\n<img src=x onerror=alert(1)>';
  await page.locator("textarea").fill(content);
  await page.reload();
  await expect(page.locator("textarea")).toHaveValue(content);
  await expect(page.locator(".note-editor img")).toHaveCount(0);
  await expect(page.getByRole("tab")).toContainText(
    '<script>alert("x")</script>',
  );
});
