import path from "node:path";

import { expect, test } from "@playwright/test";

import { prdRoot, requirementDocuments, requirementEntries } from "./__util__";

test("7. 상세 PRD는 1개 이상 10개 이하의 연속된 번호 요구사항으로 구성한다", async () => {
  const invalid: string[] = [];
  for (const document of requirementDocuments()) {
    const entries = requirementEntries(document);
    const sequential = entries.every(
      ({ number }, index) => number === index + 1,
    );
    if (entries.length < 1 || entries.length > 10 || !sequential) {
      invalid.push(path.relative(prdRoot, document));
    }
  }

  await test.step("문서별 요구사항 개수와 번호 연속성을 확인한다", async () => {
    expect(invalid).toEqual([]);
  });
});
