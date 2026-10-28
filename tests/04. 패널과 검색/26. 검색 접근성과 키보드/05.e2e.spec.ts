import { expect, test } from "@playwright/test";

test("5. 검색 입력란은 Search everything 이름과 안내 문구를 제공한다", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".group-select-command").click();
  await page.locator(".more-command").click();
  await page.getByRole("button", { name: "SEARCH", exact: true }).click();
  const search = page.getByRole("searchbox", { name: "Search everything" });
  await expect(search).toHaveAttribute("placeholder", "Search everything");
});
