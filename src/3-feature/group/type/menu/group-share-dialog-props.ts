import type { GroupEntry } from "@/src/4-entity/notepad";

export type GroupShareDialogProps = {
  group: GroupEntry;
  onClose: () => void;
  onShared: (originalId: string, sharedGroup: GroupEntry) => void;
};
