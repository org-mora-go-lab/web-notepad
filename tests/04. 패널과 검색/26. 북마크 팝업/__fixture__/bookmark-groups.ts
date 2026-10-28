import {
  createBookmarkFixture,
  createGroupFixture,
  createTabFixture,
} from "../../../__fixture__";

export function createBookmarkGroupsState() {
  return {
    activeGroupId: "ungrouped",
    nextTabNumber: 3,
    groups: [
      createGroupFixture(
        "ungrouped",
        "Ungrouped",
        [
          createTabFixture("home-tab", "Home note\nHome content", {
            bookmarked: true,
          }),
        ],
        {
          bookmarks: [
            createBookmarkFixture(
              "home-bookmark",
              "home-tab",
              "Home note\nHome content",
            ),
          ],
        },
      ),
      createGroupFixture(
        "work",
        "Work",
        [
          createTabFixture("work-tab", "Work note\nWork content", {
            bookmarked: true,
          }),
        ],
        {
          bookmarks: [
            createBookmarkFixture(
              "work-bookmark",
              "work-tab",
              "Work note\nWork content",
              { createdAt: 2, updatedAt: 2 },
            ),
          ],
        },
      ),
    ],
  };
}
