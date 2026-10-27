import { expect, test } from "@playwright/test";

import { seedBookmarkContentItems } from "./__fixture__";

test("5. 북마크의 나머지 내용은 접지 않은 전체 내용으로 표시한다", async ({
  page,
}) => {
  const { detailLines } = await seedBookmarkContentItems(page);
  const content = page
    .locator(".bookmark-item")
    .first()
    .locator(".bookmark-item-content");

  await expect(content).toHaveText(detailLines.join("\n"), {
    useInnerText: true,
  });
  expect(
    await content.evaluate(
      (element) => element.scrollHeight <= element.clientHeight,
    ),
  ).toBe(true);
});
