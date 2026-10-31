import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export const repositoryRoot = process.cwd();
export const prdRoot = path.join(repositoryRoot, "tests-prd");
export const testsRoot = path.join(repositoryRoot, "tests");

export function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

export function requirementDocuments(): string[] {
  return walk(prdRoot).filter((file) => file.endsWith(".md"));
}

export function e2eFiles(): string[] {
  return walk(testsRoot).filter((file) => file.endsWith(".e2e.spec.ts"));
}

export function requirementEntries(file: string) {
  return [...readFileSync(file, "utf8").matchAll(/^(\d+)\.\s+(.+)$/gm)].map(
    ([, number, title]) => ({ number: Number(number), title }),
  );
}
