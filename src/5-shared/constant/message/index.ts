import type { Language } from "../../type";
import { en, type Messages } from "./en";
import { ko } from "./ko";

export type { Messages } from "./en";

export const MESSAGES: Record<Language, Messages> = { en, ko };

export const LANGUAGES: readonly Language[] = ["en", "ko"];

// Each language is listed by its own name.
export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  ko: "한국어",
};
