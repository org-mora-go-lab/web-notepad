import { type Page, test as base } from "@playwright/test";

import { signedSession } from "../../../__fixture__";
import { authenticateBrowser } from "../../../__util__";

export const syncTest = base.extend<{ devices: { desktop: Page; mobile: Page; userId: string } }>({
  devices: async ({ browser, baseURL }, provide) => {
    const userId = `device-sync-${crypto.randomUUID()}`;
    const token = signedSession({ id: userId, nickname: "Sync User", expiresAt: Date.now() + 300_000 });
    const desktopContext = await browser.newContext({ baseURL, viewport: { width: 1280, height: 800 } });
    const mobileContext = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    try {
      await authenticateBrowser(desktopContext, token);
      await authenticateBrowser(mobileContext, token);
      await provide({ desktop: await desktopContext.newPage(), mobile: await mobileContext.newPage(), userId });
    } finally {
      await desktopContext.close();
      await mobileContext.close();
    }
  },
});
