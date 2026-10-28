import { expect, test } from "@playwright/test";

import {
  createGroup,
  groupActionsButton,
  groupsCommand,
  moreCommand,
  systemGroupCommand,
} from "../../__util__";

test("7. 이름 있는 그룹의 ⋮ 버튼은 고정·수정·삭제 명령을 연다", async ({
  page,
}) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "Work");
  await groupActionsButton(page, "Work").click();

  const actions = ["Pin Work group", "Edit Work group", "Delete Work group"];
  const tops = [];
  for (const name of actions) {
    const button = page.getByRole("button", { name, exact: true });
    await expect(button).toBeVisible();
    const icon = (await button.locator("svg").boundingBox())!;
    const label = (await button.locator("span").boundingBox())!;
    expect(label.x).toBeGreaterThan(icon.x + icon.width);
    expect(
      Math.abs(label.y + label.height / 2 - icon.y - icon.height / 2),
    ).toBeLessThan(2);
    tops.push((await button.boundingBox())!.y);
  }
  expect(tops[0]).toBeLessThan(tops[1]);
  expect(tops[1]).toBeLessThan(tops[2]);

  const surfaceProperties = [
    "background-color",
    "border",
    "border-radius",
    "box-shadow",
    "padding",
  ];
  const itemProperties = [
    "min-height",
    "padding",
    "border",
    "border-radius",
    "font-size",
    "gap",
    "align-items",
  ];
  const groupSurface = await page
    .locator(".group-action-dropdown")
    .evaluate((element, properties) => {
      const style = getComputedStyle(element);
      return properties.map((property) => style.getPropertyValue(property));
    }, surfaceProperties);
  expect(groupSurface[2]).toBe("5px");
  const groupItem = await page
    .getByRole("button", { name: actions[0], exact: true })
    .evaluate((element, properties) => {
      const style = getComputedStyle(element);
      return properties.map((property) => style.getPropertyValue(property));
    }, itemProperties);

  await moreCommand(page).click();
  const menu = page.locator(".group-more-menu");
  await expect(menu).toBeVisible();
  expect(
    await menu.evaluate((element, properties) => {
      const style = getComputedStyle(element);
      return properties.map((property) => style.getPropertyValue(property));
    }, surfaceProperties),
  ).toEqual(groupSurface);
  expect(
    await menu
      .locator("button")
      .first()
      .evaluate((element, properties) => {
        const style = getComputedStyle(element);
        return properties.map((property) => style.getPropertyValue(property));
      }, itemProperties),
  ).toEqual(groupItem);

  await systemGroupCommand(page).click();
  const systemMenu = page.locator(".group-system-menu");
  await expect(systemMenu).toBeVisible();
  expect(
    await systemMenu.evaluate((element, properties) => {
      const style = getComputedStyle(element);
      return properties.map((property) => style.getPropertyValue(property));
    }, surfaceProperties),
  ).toEqual(groupSurface);
});
