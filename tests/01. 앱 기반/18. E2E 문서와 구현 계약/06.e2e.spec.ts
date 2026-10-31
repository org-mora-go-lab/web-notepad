import { existsSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import { testsRoot, walk } from "./__util__";

test("6. 테스트 공통 리소스 디렉터리는 외부 진입점인 index.ts 배럴을 제공한다", async () => {
  const resourceDirectories = new Set<string>();
  for (const file of walk(testsRoot)) {
    let directory = path.dirname(file);
    while (directory !== testsRoot) {
      if (
        /^__(?:fixture|util|mock|constant)__$/.test(path.basename(directory))
      ) {
        resourceDirectories.add(directory);
      }
      directory = path.dirname(directory);
    }
  }
  const missing = [...resourceDirectories]
    .filter((directory) => !existsSync(path.join(directory, "index.ts")))
    .map((directory) => path.relative(testsRoot, directory));

  expect(missing).toEqual([]);
});
