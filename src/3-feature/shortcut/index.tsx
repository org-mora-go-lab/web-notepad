"use client";

import { useI18n } from "@/src/5-shared/hook";
import { SidePanel } from "@/src/5-shared/ui";

import type { ShortcutProps } from "./type";

export function Shortcut({
  open,
  onClose,
}: ShortcutProps) {
  const { t } = useI18n();
  const shortcuts = [
    { action: t.shortcutToggleGroups, keys: ["Option + F11"] },
    { action: t.shortcutNewTab, keys: ["Option + Tab"] },
    { action: t.shortcutCloseTab, keys: ["Option + Backspace"] },
    {
      action: t.shortcutMoveTab,
      keys: ["Option + Arrow Up", "Option + Arrow Down"],
    },
    { action: t.shortcutSelectAll, keys: ["Cmd + A", "Option + A"] },
    { action: t.shortcutUndo, keys: ["Cmd + Z"] },
    { action: t.shortcutRedo, keys: ["Cmd + Shift + Z"] },
    { action: t.shortcutBold, keys: ["Cmd + B"] },
    { action: t.shortcutToggleDashboard, keys: ["Option + F12"] },
    { action: t.shortcutInsertTab, keys: ["Tab"] },
    { action: t.shortcutLineRange, keys: [`Shift + ${t.click}`] },
  ];

  return (
    <SidePanel
      className="shortcut"
      id="shortcuts-panel"
      title={t.shortcutTitle}
      open={open}
      closeLabel={t.closePanel(t.shortcutTitle)}
      ariaLabel={t.shortcutTitle}
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
