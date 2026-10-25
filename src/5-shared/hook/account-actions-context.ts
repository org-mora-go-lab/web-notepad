"use client";

import { createContext } from "react";

import type { AccountActions } from "../type";

export const AccountActionsContext = createContext<AccountActions | null>(null);
