"use client";

import { useI18n } from "@/src/5-shared/hook";
import { SidePanel } from "@/src/5-shared/ui";

type Props = {
  open: boolean;
  pinned: boolean;
  onTogglePin: () => void;
  onClose: () => void;
};

export function Shortcut({ open, pinned, onTogglePin, onClose }: Props) {
  const { t } = useI18n();
  const shortcuts = [
    { action: t.shortcutNewTab, keys: ["Option + Tab"] },
    { action: t.shortcutCloseTab, keys: ["Option + Backspace"] },
    { action: t.shortcutMoveTab, keys: ["Option + Arrow Up", "Option + Arrow Down"] },
    { action: t.shortcutSelectAll, keys: ["Cmd + A", "Option + A"] },
    { action: t.shortcutMoveRight, keys: ["Option + F12"] },
    { action: t.shortcutMoveLeft, keys: ["Option + F11"] },
    { action: t.shortcutInsertTab, keys: ["Tab"] },
    { action: t.shortcutLineRange, keys: [`Shift + ${t.click}`] },
  ];

  return (
    <SidePanel
      className="shortcut"
      id="shortcuts-panel"
      title={t.shortcutTitle}
      open={open}
      pinned={pinned}
      onTogglePin={onTogglePin}
      closeLabel="단축키 닫기"
      ariaLabel="키보드 단축키"
      onClose={onClose}
    >
      <dl className="shortcut-list">
        {shortcuts.map(({ action, keys }) => (
          <div className="shortcut-row" key={action}>
            <dt>{action}</dt>
            <dd>
              {keys.map((key) => (
                <kbd key={key}>{key}</kbd>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </SidePanel>
  );
}
