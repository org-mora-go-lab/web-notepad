"use client";

import { createContext } from "react";

import type { GroupSharingActions } from "../type";

export const GroupSharingContext = createContext<GroupSharingActions | null>(
  null,
);
