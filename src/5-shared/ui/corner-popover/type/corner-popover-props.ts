import type { ReactNode } from "react";

export type CornerPopoverProps = {
  id: string;
  className: string;
  title: string;
  closeLabel: string;
  headerActions?: ReactNode;
  open: boolean;
  triggerSelector: string;
  onClose: () => void;
  children: ReactNode;
};
