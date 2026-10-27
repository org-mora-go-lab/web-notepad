import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { seedStoredStateOnLoad } from "../../__util__";

test("2. 저장 상태 복원 전에는 로딩을 거쳐 복원된 편집 화면을 표시한다", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const observedWindow = window as typeof window & {
      __loadingObserved?: boolean;
    };
    observedWindow.__loadingObserved = false;

    new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (
            node instanceof Element &&
            (node.matches(".home.is-loading") ||
              node.querySelector(".home.is-loading"))
          ) {
            observedWindow.__loadingObserved = true;
          }
        }
      }
    }).observe(document, { childList: true, subtree: true });
  });

  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-restored", "restored after hydration", {
          title: "Restored",
        }),
      ]),
    ],
  });
  await expect(page.locator("textarea")).toHaveValue(
    "restored after hydration",
  );
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as typeof window & { __loadingObserved?: boolean })
            .__loadingObserved,
      ),
    )
    .toBe(true);
  await expect(page.locator(".home.is-loading")).toHaveCount(0);
});
