import { createBookmarkFixture, createClosedTabFixture, createGroupFixture, createTabFixture } from "../../../__fixture__";

export function createGlobalSearchState(bookmarkCount = 1) {
  const workGroup = createGroupFixture("work", "Work", [
    createTabFixture("work-tab", "Quarterly goals"),
  ], {
    bookmarks: Array.from({ length: bookmarkCount }, (_, index) => createBookmarkFixture(
      index === 0 ? "work-bookmark" : `work-bookmark-${index}`,
      "work-tab",
      index === 0 ? "Work quarterly goals" : `Work goals ${index}`,
      { title: index === 0 ? "Work plan" : `Work plan ${index}`, tabColor: "green", createdAt: index + 1, updatedAt: index + 1 },
    )),
  });
  const ungrouped = createGroupFixture("ungrouped", "Ungrouped", [
    createTabFixture("current-tab", "Current note"),
  ]);
  const personalGroup = createGroupFixture("personal", "Personal", [
    createTabFixture("personal-tab", "Personal note"),
  ]);
  return {
    activeGroupId: ungrouped.id,
    groups: [ungrouped, workGroup, personalGroup],
    nextTabNumber: 3,
    closedTabs: [
      createClosedTabFixture("closed-work", workGroup.id,
        createTabFixture("closed-tab", "Archived draft")),
      createClosedTabFixture("closed-personal", personalGroup.id,
        createTabFixture("personal-closed-tab", "Archived personal draft")),
    ],
  };
}
