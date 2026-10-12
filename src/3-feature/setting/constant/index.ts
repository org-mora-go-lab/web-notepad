import type { TabColor } from "@/src/4-entity/notepad";
import type { Language } from "@/src/5-shared/type";

export const TAB_COLOR_LABELS: Record<Language, Record<TabColor, string>> = {
  en: {
    gray: "Gray",
    red: "Red",
    orange: "Orange",
    yellow: "Yellow",
    green: "Green",
    teal: "Teal",
    indigo: "Indigo",
    purple: "Purple",
    pink: "Pink",
  },
  ko: {
    gray: "그레이",
    red: "레드",
    orange: "오렌지",
    yellow: "옐로",
    green: "그린",
    teal: "틸",
    indigo: "인디고",
    purple: "퍼플",
    pink: "핑크",
  },
};
