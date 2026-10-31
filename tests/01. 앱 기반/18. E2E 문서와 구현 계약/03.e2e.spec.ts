import { readFileSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";
import ts from "typescript";

import { e2eFiles, testsRoot } from "./__util__";

test("3. 각 E2E 파일은 하나의 최상위 테스트만 선언한다", async () => {
  const invalid: string[] = [];
  for (const file of e2eFiles()) {
    const source = ts.createSourceFile(
      file,
      readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    let declarations = 0;
    const visit = (node: ts.Node) => {
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === "test"
      )
        declarations += 1;
      ts.forEachChild(node, visit);
    };
    visit(source);
    if (declarations !== 1) invalid.push(path.relative(testsRoot, file));
  }

  expect(invalid).toEqual([]);
});
