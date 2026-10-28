import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import {
  authenticateBrowser,
  openBoard,
  selectBoardPost,
} from "../../__util__";

test("7. 보드 작업 버튼은 넓은 화면에서 나란히 놓고 복사 문구와 아이콘을 중앙 정렬한다", async ({
  page,
  context,
  boardPost,
  boardOwnerToken,
}) => {
  await authenticateBrowser(context, boardOwnerToken);
  await page.goto("/");
  await openBoard(page);
  await selectBoardPost(page, boardPost.title);
  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 844 });
    const copy = page.getByRole("button", {
      name: "Copy invitation link",
      exact: true,
    });
    const cancel = page.getByRole("button", {
      name: "Cancel Sharing",
      exact: true,
    });
    await copy.scrollIntoViewIfNeeded();
    const box = (await copy.boundingBox())!,
      other = (await cancel.boundingBox())!;
    if (width > 512) {
      expect(box.y).toBeCloseTo(other.y, 0);
      expect(box.x).toBeGreaterThanOrEqual(other.x + other.width);
    } else {
      expect(box.y).toBeGreaterThanOrEqual(other.y + other.height);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
    }
    const text = (await copy.locator("span").boundingBox())!,
      icon = (await copy.locator("svg").boundingBox())!;
    expect((text.x + icon.x + icon.width) / 2).toBeCloseTo(
      box.x + box.width / 2,
      0,
    );
    expect(text.y + text.height / 2).toBeCloseTo(icon.y + icon.height / 2, 0);
  }
});
