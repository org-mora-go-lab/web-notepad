import { ConfirmPopup, isAltBackspace, useI18n } from "@/src/5-shared";

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

export function TabDeletePopup({ onConfirm, onCancel }: Props) {
  const { t } = useI18n();
  return (
    <ConfirmPopup
      title={t.deleteTabTitle}
      message={t.deleteTabMessage}
      closeLabel="Close deletion confirmation"
      closeTitle={t.close}
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
