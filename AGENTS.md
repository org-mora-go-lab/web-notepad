<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commit Messages

After completing code changes, suggest a Korean commit message that matches the change. Keep one of the prefixes `test:`, `feat:`, `refactor:`, `doc`, `style:`, or `fix:`.

## E2E Test Structure

Every E2E test code file (`*.e2e.spec.ts`) must contain exactly one top-level `test(...)` declaration and register exactly one test case. Do not generate multiple tests from loops or parameterized declarations in one file. Split separate scenarios into their own numbered PRD requirements and matching E2E files. Shared resource files must not declare tests.

When writing E2E tests, create `__mock__/`, `__fixture__/`, `__util__/`, or `__constant__/` folders when shared test doubles, fixtures, helpers, or constants are needed. Put broadly reusable resources under `tests/`; put resources used only by one requirement title under that title's folder. Every such folder must include a barrel `index.ts`, and tests should import from the barrel when practical.

## Specification Synchronization

When functionality is added, removed, or improved, update `PRD.md` to match the current implementation in the same change. Treat `PRD.md` as the source of truth for the E2E test scope: when `PRD.md` changes, add, update, or remove the corresponding tests under `tests/` so they fully reflect the current requirements.

Keep the numbered structure in `PRD.md` and `tests/` in exact sync. Each `## N. Title` section must have a matching `tests/N. Title/` directory, and each numbered requirement under that section must have exactly one corresponding `N.e2e.spec.ts` file in that directory. The test file numbers and total count must match the PRD requirement numbers and count, with no missing or extra requirement tests. For example, if `## 10. 하단부 표시` has four numbered requirements, `tests/10. 하단부 표시/` must contain `1.e2e.spec.ts` through `4.e2e.spec.ts`, each covering its matching requirement. Update `tests/**` whenever a PRD requirement is added, changed, or removed, and update `PRD.md` whenever the requirement scope changes.

Do not consider the work complete until all updated E2E tests pass. Run `npm run test:e2e` and require a 100% pass rate; fix implementation, test, fixture, mock, or utility issues before reporting completion.

## Layer Structure

- `src/` is split into numbered layers, ordered from top to bottom:

  ```
  src/
      1-page/
      2-widget/
      3-feature/
      4-entity/
      5-shared/
  ```

- A layer may import only from layers with a higher number (lower in the list). Never import from a layer above it (for example, `3-feature` must not import from `2-widget` or `1-page`, and `5-shared` must not import from any other layer).
- Keep the number prefix in every path, such as `@/src/3-feature` or `@use "../../5-shared/style/variable"`.

## Feature and Widget Module Structure

- Each feature or widget module directly under `src/3-feature/` or `src/2-widget/` must implement its main module in its own `index.tsx`.
- `src/3-feature/index.ts` and `src/2-widget/index.ts` must export the public modules for their respective directories.
- Those top-level barrels may export only each module's main implementation from `./<module>` (resolved through that module's `index.tsx`); do not export subcomponents such as `PaneDivider` from them. Apply this restriction equally to feature and widget modules.
- Export subcomponents from the submodule's `component/index.ts` barrel, and import and use those subcomponents from the submodule's `index.tsx`.
- `1-page/home` and other consumers must import feature and widget modules through the public `3-feature/index.ts` and `2-widget/index.ts` barrels.

## Module Props Types

- Apply these rules to props-bearing modules and subcomponents in every numbered layer, including pages, widgets, features, entity UI if added, and shared UI.
- Define a module's main component props in its own `type/<module>-props.ts` file, named `<PascalCaseModuleName>Props` (for example, `dashboard/type/dashboard-props.ts` exports `DashboardProps`). Do not declare an inline `Props` alias or an anonymous props object in the component implementation.
- Keep subcomponent props in separate `type/<subcomponent>-props.ts` files inside the owning module, named after the subcomponent (for example, `dashboard/type/dashboard-column-props.ts` exports `DashboardColumnProps`). Keep each component's props contract in its own file; do not combine unrelated component props in one file.
- Every module's `type/` directory must have a lowercase `index.ts` barrel that exports its public types with `export type`. Module implementations, subcomponents, and hooks must import these types with `import type` through `./type` or `../type` as appropriate. Imports between files inside the same `type/` directory may remain direct.
- Props type files must use type-only imports for their dependencies. Keep reusable domain models and hook/function option types distinct from component props; use `Pick`, `Omit`, or other type composition when a component shares part of another contract.
- Keep props types in the module's own type barrel. The top-level feature, widget, and shared UI barrels still export only their main component implementations, not props types or subcomponents.
- Do not introduce empty props contracts for components that accept no props, or rename entity/domain data types to props types when the module has no component props.

## Internal Directory Barrels

- Every directory named `hook`, `util`, `component`, `constant`, or `type` under `src/` must include a lowercase `index.ts` barrel. Do not use `Index.ts` or `index.tsx` for these barrels.
- Export the directory's public APIs through its barrel. Keep JSX component implementations in separate `.tsx` files, not in the barrel.
- Imports from outside these directories must resolve through the directory's `index.ts` barrel instead of importing individual files directly. Imports between files within the same directory may remain direct to avoid circular dependencies.
- When adding, moving, or removing a public API, update its barrel and consumers in the same change. Keep feature and widget root implementations in `index.tsx` as specified above.

## Entity Layer

- `src/4-entity/` exists only to gather the functionality of a specific domain. Group each domain under its own `src/4-entity/<domain>/` directory (for example, `src/4-entity/notepad/` with its store, types, constants, and utilities) and export it through `src/4-entity/index.ts`.
- Do not put domain-independent code in `src/4-entity/`. If code is not tied to a specific domain, put it in `src/5-shared/` instead.

## Shared Layer

- Put domain-independent code shared across layers (`hook`, `type`, `ui`, `util`, `style`) under `src/5-shared/`, exported through `src/5-shared/index.ts`.

## Shared UI Components

- Put common UI components shared by feature, widget, or page modules under `src/5-shared/ui/`, not under a `component/` directory.
- Structure each one exactly like a feature, widget, or page module: a `src/5-shared/ui/<component>/` directory with its main implementation in `index.tsx` and its main stylesheet in `index.scss`. Apply the subcomponent `component/` and `style/` rules below to these modules as well.
- The top-level class selector in a UI component's `index.scss` must match its directory name (for example, `.side-panel` in `side-panel/index.scss`). Keep shared component styles in that stylesheet instead of SCSS mixins, and load it from the page stylesheet with `@use "../../5-shared/ui/<component>"`.
- `src/5-shared/ui/index.ts` may export only each UI component's main implementation. Consumers import these components through `@/src/5-shared/ui` (or `@/src/5-shared`) and put module-specific overrides in their own stylesheet, scoped under their own top-level class.

## Feature, Widget, and Page Stylesheets

- Each feature, widget, or page module must keep its main stylesheet in `index.scss` next to its `index.tsx`. Put optional SCSS files for subcomponents under that module's `style/` directory.
- The top-level class selector in a module's `index.scss` must match the module directory name (for example, `.body` in `body/index.scss` or `.bookmark` in `bookmark/index.scss`). Apply these stylesheet rules equally to `src/3-feature/`, `src/2-widget/`, and `src/1-page/` modules.
- Whenever a module adds `component/<sub-comp>.tsx`, it must add the matching `style/<sub-comp>.scss` in the same change, even if the stylesheet is initially empty. Apply this pairing rule to feature, widget, and page modules.
