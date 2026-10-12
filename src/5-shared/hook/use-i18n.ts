"use client";

import { createContext, useContext } from "react";

import { MESSAGES } from "../constant";
import type { Language } from "../type";

export const I18nContext = createContext<Language>("en");

export function useI18n() {
  const language = useContext(I18nContext);
  return { language, t: MESSAGES[language] };
}
