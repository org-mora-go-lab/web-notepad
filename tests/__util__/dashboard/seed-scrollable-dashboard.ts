import type { Page } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { writeStoredState } from "../state";
import { openPanel } from "../workspace";

export async function seedScrollableDashboard(page: Page) {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture(
        "ungrouped",
        "Ungrouped",
        Array.from({ length: 30 }, (_, index) =>
          createTabFixture(`tab-${index}`, `Task ${index}\nBody`, {
            tabColor: index % 3 === 0 ? "gray" : index % 3 === 1 ? "indigo" : "teal",
          }),
        ),
      ),
    ],
  });
  await openPanel(page, "dashboard-panel");
}
