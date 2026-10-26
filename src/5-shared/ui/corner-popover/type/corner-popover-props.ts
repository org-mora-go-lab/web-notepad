import type { ReactNode } from "react";

export type CornerPopoverProps = {
  id: string;
  className: string;
  title: string;
  closeLabel: string;
  headerActions?: ReactNode;
  open: boolean;
  position: "top" | "bottom";
  triggerSelector: string;
  outsideIgnoreSelector?: string;
  onClose: () => void;
  children: ReactNode;
};
