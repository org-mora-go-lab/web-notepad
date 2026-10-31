import { readFileSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import { e2eFiles, testsRoot } from "./__util__";

test("4. E2E 파일은 품질 계약 반복 주석 없이 실행 코드 20줄 이상으로 구성한다", async () => {
  const tooShort: string[] = [];
  const repeatedContract: string[] = [];

  for (const file of e2eFiles()) {
    const source = readFileSync(file, "utf8");
    const lineCount =
      source.split(/\r?\n/).length - (source.endsWith("\n") ? 1 : 0);
    const relative = path.relative(testsRoot, file);
    if (lineCount < 20) tooShort.push(`${relative}: ${lineCount}`);
    if (/\/\*\*\s*\n\s*\*\s*E2E 품질 계약/.test(source)) {
      repeatedContract.push(relative);
    }
  }

  await test.step("최소 실행 코드 길이를 확인한다", async () => {
    expect(tooShort).toEqual([]);
  });
  await test.step("반복 품질 주석이 없음을 확인한다", async () => {
    expect(repeatedContract).toEqual([]);
  });
});
