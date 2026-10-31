import Script from "next/script";
import type { ReactNode } from "react";

import { HOME_RETURN_FOCUS_KEY } from "@/src/5-shared/constant";

export default function BoardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Script id="mark-board-return" strategy="beforeInteractive">
        {`try{sessionStorage.setItem(${JSON.stringify(HOME_RETURN_FOCUS_KEY)},"1")}catch{}`}
      </Script>
      {children}
    </>
  );
}
