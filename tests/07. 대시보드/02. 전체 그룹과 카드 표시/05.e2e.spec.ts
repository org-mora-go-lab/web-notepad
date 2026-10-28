import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { dashboardColumn, openPanel, writeStoredState } from "../../__util__";

test("5. 카드 제목은 남는 너비를 사용하고 북마크 표시와 겹치지 않는다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 640, height: 800 });
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("plain", "[컨텐츠입니다.]\n내용입니다. 내용입니다.", {
          tabColor: "gray",
          dashboardStatus: "todo",
        }),
        createTabFixture("marked", "북마크\n북마크 내용", {
          tabColor: "gray",
          dashboardStatus: "todo",
          bookmarked: true,
        }),
      ]),
    ],
  });
  await openPanel(page, "dashboard-panel");
  await page.locator(".dashboard-expand").click();
  const plain = dashboardColumn(page, "todo").locator(".dashboard-card", {
    hasText: "[컨텐츠입니다.]",
  });
  await expect
    .poll(() =>
      plain.locator("strong").evaluate((title) => {
        const range = document.createRange();
        range.selectNodeContents(title);
        return (
          range.getBoundingClientRect().height <=
          parseFloat(getComputedStyle(title).lineHeight) + 1
        );
      }),
    )
    .toBe(true);
  const marked = dashboardColumn(page, "todo").locator(".dashboard-card", {
    hasText: "북마크 내용",
  });
  expect(
    await marked.evaluate((card) => {
      const range = document.createRange();
      range.selectNodeContents(card.querySelector("strong")!);
      return (
        range.getBoundingClientRect().right <=
        card.querySelector(".dashboard-card-bookmark")!.getBoundingClientRect()
          .left
      );
    }),
  ).toBe(true);
});
