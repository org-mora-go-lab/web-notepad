"use client";

import { createContext } from "react";

export const SavingTabsContext = createContext<readonly string[]>([]);
