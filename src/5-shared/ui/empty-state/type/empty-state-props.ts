import type { ReactNode } from "react";

export type EmptyStateProps = {
  message: string;
  icon?: ReactNode;
  className?: string;
  search?: boolean;
};
