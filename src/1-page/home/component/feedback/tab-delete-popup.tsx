import { X } from "lucide-react";

import { ConfirmPopup, isAltBackspace, useI18n } from "@/src/5-shared";

import type { TabDeletePopupProps } from "../../type";

export function TabDeletePopup({ onConfirm, onCancel }: TabDeletePopupProps) {
  const { t } = useI18n();
  return (
    <ConfirmPopup
      title={t.deleteTabTitle}
      message={t.deleteTabMessage}
      closeLabel={t.closeDeleteTabConfirmation}
      closeTitle={t.close}
      confirmLabel={t.close}
      confirmIcon={<X size={14} aria-hidden="true" />}
      onConfirm={onConfirm}
      onCancel={onCancel}
      onKeyDown={(event, close) => {
        if (!isAltBackspace(event)) return false;
        event.preventDefault();
        if (!event.repeat) close(onConfirm);
        return true;
      }}
    />
  );
}
