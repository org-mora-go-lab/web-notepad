# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 04. 탭 - 메뉴/15.e2e.spec.ts >> 15. 뒤로 가기, Escape, 바깥 클릭으로 이동 없이 그룹 목록을 닫는다
- Location: tests/04. 탭 - 메뉴/15.e2e.spec.ts:20:5

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 0
+ Received  + 1

@@ -86,10 +86,11 @@
    ],
    "nextTabNumber": 5,
    "settings": Object {
      "fontScale": 1,
      "language": "en",
+     "panelPosition": "right",
      "panelSlide": false,
      "tabColorCycle": Array [
        "gray",
        "green",
        "purple",
```

# Page snapshot

```yaml
- generic [active] [ref=f3e1]:
  - main [ref=f3e2]:
    - generic [ref=f3e3]:
      - generic [ref=f3e7]:
        - tablist "메모 탭" [ref=f3e8]:
          - generic [ref=f3e10]:
            - button "Move me 탭 색상 변경" [ref=f3e11] [cursor=pointer]
            - tab "Move me" [selected] [ref=f3e12]:
              - generic "고정됨" [ref=f3e13]
          - button "새 탭 추가" [ref=f3e21] [cursor=pointer]
          - button "MENU" [ref=f3e24] [cursor=pointer]
        - generic [ref=f3e27]:
          - generic "라인 번호" [ref=f3e28]:
            - button "01" [ref=f3e29]
            - button "02" [pressed] [ref=f3e30]
          - textbox "Move me 메모 내용" [ref=f3e31]:
            - /placeholder: Take a note..
            - text: Move me selected line
      - generic [ref=f3e34]:
        - generic [ref=f3e36]:
          - button "BOOKMARK" [ref=f3e37] [cursor=pointer]
          - button "DASHBOARD" [ref=f3e42] [cursor=pointer]
        - 'button "그룹 선택: Ungrouped" [ref=f3e50] [cursor=pointer]':
          - generic "Ungrouped" [ref=f3e55]
    - generic:
      - complementary [aria-hidden] [ref=f3e56]:
        - generic [ref=f3e57]:
          - heading [level=2] [ref=f3e58]: Bookmarks
          - button [ref=f3e60] [cursor=pointer]
        - searchbox [ref=f3e68]
        - article [ref=f3e70]:
          - generic [ref=f3e71]:
            - strong [ref=f3e72]: Move me
            - time [ref=f3e73]: 70. 01. 01. 09:00 AM
          - paragraph [ref=f3e74]: selected line
          - generic [ref=f3e75]:
            - button [ref=f3e76] [cursor=pointer]: Open
            - button [ref=f3e79] [cursor=pointer]
      - complementary [aria-hidden] [ref=f3e83]:
        - generic [ref=f3e84]:
          - heading [level=2] [ref=f3e85]: Dashboard
          - button [ref=f3e87] [cursor=pointer]
        - generic [ref=f3e92]:
          - generic [ref=f3e93]:
            - heading [level=3] [ref=f3e94]:
              - text: Todo
              - generic [ref=f3e95]: "1"
            - article [ref=f3e97]:
              - button [ref=f3e98]:
                - strong [ref=f3e99]: Move me
                - generic [ref=f3e100]: selected line
          - heading [level=3] [ref=f3e102]:
            - text: WIP
            - generic [ref=f3e103]: "0"
          - heading [level=3] [ref=f3e106]:
            - text: Closed
            - generic [ref=f3e107]: "0"
      - complementary [aria-hidden] [ref=f3e109]:
        - generic [ref=f3e110]:
          - heading [level=2] [ref=f3e111]: Closed
          - button [ref=f3e113] [cursor=pointer]
        - searchbox [ref=f3e121]
        - paragraph [ref=f3e126]: Empty Closed
      - complementary [aria-hidden] [ref=f3e127]:
        - generic [ref=f3e128]:
          - heading [level=2] [ref=f3e129]: Search
          - button [ref=f3e131] [cursor=pointer]
        - searchbox [ref=f3e139]
        - paragraph [ref=f3e142]: Enter a search term
      - complementary [aria-hidden] [ref=f3e143]:
        - generic [ref=f3e144]:
          - heading [level=2] [ref=f3e145]: Settings
          - generic [ref=f3e146]:
            - button [ref=f3e147] [cursor=pointer]
            - button [ref=f3e151] [cursor=pointer]
        - generic [ref=f3e155]:
          - region [ref=f3e156]:
            - heading [level=3] [ref=f3e157]: Font Size
            - radiogroup [ref=f3e158]:
              - generic [ref=f3e159] [cursor=pointer]:
                - radio [ref=f3e160]
                - generic [ref=f3e161]: 80%
              - generic [ref=f3e162] [cursor=pointer]:
                - radio [ref=f3e163]
                - generic [ref=f3e164]: 90%
              - generic [ref=f3e165] [cursor=pointer]:
                - radio [checked] [ref=f3e166]
                - generic [ref=f3e167]: 100%
              - generic [ref=f3e168] [cursor=pointer]:
                - radio [ref=f3e169]
                - generic [ref=f3e170]: 110%
              - generic [ref=f3e171] [cursor=pointer]:
                - radio [ref=f3e172]
                - generic [ref=f3e173]: 120%
              - generic [ref=f3e174] [cursor=pointer]:
                - radio [ref=f3e175]
                - generic [ref=f3e176]: 130%
          - region [ref=f3e177]:
            - generic [ref=f3e178]:
              - heading [level=3] [ref=f3e179]: Tab Colors
              - button [ref=f3e180] [cursor=pointer]
              - button [ref=f3e184] [cursor=pointer]
            - paragraph [ref=f3e191]:
              - generic [ref=f3e192]: New tabs start with the first color.
              - generic [ref=f3e193]:
                - generic [ref=f3e194]: Gray
                - generic [ref=f3e195]: → Green
                - generic [ref=f3e196]: → Purple
            - radiogroup [ref=f3e198]:
              - radio [checked] [ref=f3e199] [cursor=pointer]
              - radio [ref=f3e200] [cursor=pointer]
              - radio [ref=f3e201] [cursor=pointer]
              - radio [ref=f3e202] [cursor=pointer]
              - radio [ref=f3e203] [cursor=pointer]
              - radio [ref=f3e204] [cursor=pointer]
              - radio [ref=f3e205] [cursor=pointer]
              - radio [ref=f3e206] [cursor=pointer]
              - radio [ref=f3e207] [cursor=pointer]
            - radiogroup [ref=f3e209]:
              - radio [disabled] [ref=f3e210]
              - radio [ref=f3e211] [cursor=pointer]
              - radio [ref=f3e212] [cursor=pointer]
              - radio [ref=f3e213] [cursor=pointer]
              - radio [checked] [ref=f3e214] [cursor=pointer]
              - radio [ref=f3e215] [cursor=pointer]
              - radio [ref=f3e216] [cursor=pointer]
              - radio [ref=f3e217] [cursor=pointer]
              - radio [ref=f3e218] [cursor=pointer]
            - radiogroup [ref=f3e220]:
              - radio [disabled] [ref=f3e221]
              - radio [ref=f3e222] [cursor=pointer]
              - radio [ref=f3e223] [cursor=pointer]
              - radio [ref=f3e224] [cursor=pointer]
              - radio [disabled] [ref=f3e225]
              - radio [ref=f3e226] [cursor=pointer]
              - radio [ref=f3e227] [cursor=pointer]
              - radio [checked] [ref=f3e228] [cursor=pointer]
              - radio [ref=f3e229] [cursor=pointer]
          - region [ref=f3e230]:
            - heading [level=3] [ref=f3e231]: Language
            - radiogroup [ref=f3e232]:
              - generic [ref=f3e233] [cursor=pointer]:
                - radio [checked] [ref=f3e234]
                - generic [ref=f3e235]: English
              - generic [ref=f3e236] [cursor=pointer]:
                - radio [ref=f3e237]
                - generic [ref=f3e238]: 한국어
          - region [ref=f3e239]:
            - heading [level=3] [ref=f3e240]: Panel Slide
            - radiogroup [ref=f3e241]:
              - generic [ref=f3e242] [cursor=pointer]:
                - radio [ref=f3e243]
                - generic [ref=f3e244]: "On"
              - generic [ref=f3e245] [cursor=pointer]:
                - radio [checked] [ref=f3e246]
                - generic [ref=f3e247]: "Off"
          - region [ref=f3e248]:
            - heading [level=3] [ref=f3e249]: Panel Position
            - radiogroup [ref=f3e250]:
              - generic [ref=f3e251] [cursor=pointer]:
                - radio [ref=f3e252]
                - generic [ref=f3e253]: Left
              - generic [ref=f3e254] [cursor=pointer]:
                - radio [checked] [ref=f3e255]
                - generic [ref=f3e256]: Right
  - alert [ref=f3e257]
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | import { BOTH_VIEWPORTS } from "../__constant__";
  4  | import {
  5  |   moveGroupSourceTab,
  6  |   openTabMenu,
  7  |   readStoredState,
  8  |   seedMoveGroupState,
  9  |   type StoredState,
  10 | } from "../__util__";
  11 | 
  12 | // Seeded storage gains default settings once the app persists again.
  13 | const withDefaults = (state: StoredState) => ({
  14 |   allGroupActiveTabId: null,
  15 |   ...state,
  16 |   closedTabs: state.closedTabs ?? [],
  17 |   settings: state.settings ?? { fontScale: 1, tabColorCycle: ["gray", "green", "purple"], language: "en", panelSlide: false },
  18 | });
  19 | 
  20 | test("15. 뒤로 가기, Escape, 바깥 클릭으로 이동 없이 그룹 목록을 닫는다", async ({ page }) => {
  21 |   const moveGroup = page.getByRole("menuitem", { name: "Move Group", exact: true });
  22 |   const menu = page.getByRole("menu", { name: "Move Group", exact: true });
  23 |   for (const viewport of BOTH_VIEWPORTS) {
  24 |     await page.setViewportSize(viewport);
  25 |     await seedMoveGroupState(page);
  26 |     const original = withDefaults(await readStoredState(page));
  27 |     await openTabMenu(moveGroupSourceTab(page), viewport);
  28 |     await moveGroup.click();
  29 |     await menu.getByRole("menuitem", { name: "Back to tab actions" }).click();
  30 |     await expect(page.getByRole("menu", { name: "Tab actions", exact: true })).toBeVisible();
  31 |     await expect(page.getByRole("menuitem", { name: "Unpin", exact: true })).toBeVisible();
  32 | 
  33 |     await moveGroup.click();
  34 |     await expect(menu).toBeVisible();
  35 |     await page.keyboard.press("Escape");
  36 |     await expect(page.getByRole("menu")).toHaveCount(0);
  37 | 
  38 |     await openTabMenu(moveGroupSourceTab(page), viewport);
  39 |     await moveGroup.click();
  40 |     await expect(menu).toBeVisible();
  41 |     await page.mouse.click(2, 200);
  42 |     await expect(page.getByRole("menu")).toHaveCount(0);
> 43 |     expect(withDefaults(await readStoredState(page))).toEqual(original);
     |                                                       ^ Error: expect(received).toEqual(expected) // deep equality
  44 |   }
  45 | });
  46 | 
```