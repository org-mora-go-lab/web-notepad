import { useSyncExternalStore } from "react";

import type { Language } from "@/src/5-shared/type";

import { USER_GUIDE_STEPS } from "../constant";

const MOBILE_QUERY = "(max-width: 512px)";
const subscribeMobile = (onChange: () => void) => {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const isMobile = () => window.matchMedia(MOBILE_QUERY).matches;

export function useGuideSteps(language: Language) {
  const mobile = useSyncExternalStore(subscribeMobile, isMobile, () => false);
  const steps = USER_GUIDE_STEPS[language];
  return mobile ? steps.filter((step) => !step.shortcutEntry) : steps;
}
