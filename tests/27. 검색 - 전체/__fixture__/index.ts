import { createClosedTabFixture, createGroupFixture, createTabFixture } from "../../__fixture__";

export function createGlobalSearchState() {
  const workGroup = createGroupFixture("work", "Work", [
    createTabFixture("work-tab", "Quarterly goals"),
  ], {
    bookmarks: [{
      id: "work-bookmark",
      sourceTabId: "work-tab",
      title: "Work plan",
      content: "Quarterly goals",
      tabColor: "green",
      selectedLines: [],
      createdAt: 1,
    }],
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