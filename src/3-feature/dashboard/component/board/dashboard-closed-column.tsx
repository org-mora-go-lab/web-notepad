"use client";

import { ArchiveRestore, Trash2 } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/src/5-shared/hook";
import { ConfirmPopup } from "@/src/5-shared/ui";

import type { DashboardClosedColumnProps } from "../../type";

export function DashboardClosedColumn({
  entries,
  showGroupNames,
  onRestore,
  onRemove,
}: DashboardClosedColumnProps) {
  const { t } = useI18n();
  const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null);
  const deleteEntry = entries.find(({ entry }) => entry.id === deleteEntryId)?.entry;

  return (
    <section
      className="dashboard-column dashboard-closed-column"
      aria-label={t.closedTitle}
    >
      <h3 className="dashboard-column-status">
        <span>{t.closedTitle}</span>
        <span className="dashboard-count">{entries.length}</span>
      </h3>
      <div className="dashboard-cards">
        {entries.map(({ entry, groupName }) => (
          <article className="dashboard-card dashboard-closed-card" key={entry.id}>
            <div className="dashboard-card-open">
              <strong title={entry.tab.title}>{entry.tab.title}</strong>
              {showGroupNames && (
                <span className="dashboard-card-group">{groupName}</span>
              )}
              <span className="dashboard-closed-actions">
                <button
                  type="button"
                  aria-label={t.reopen}
                  title={t.reopen}
                  onClick={() => onRestore(entry.id)}
                >
                  <ArchiveRestore size={16} />
                </button>
                <button
                  type="button"
                  aria-label={t.deleteClosedTabFor(entry.tab.title)}
                  title={t.deleteClosedTab}
                  onClick={() => setDeleteEntryId(entry.id)}
                >
                  <Trash2 size={16} />
                </button>
              </span>
            </div>
          </article>
        ))}
      </div>
      {deleteEntry && (
        <ConfirmPopup
          title={t.deleteClosedTabTitle}
          message={t.deleteClosedTabMessage(deleteEntry.tab.title)}
          closeLabel={t.closeDeleteClosedTabConfirmation}
          closeTitle={t.close}
          onCancel={() => setDeleteEntryId(null)}
          onConfirm={() => {
            onRemove(deleteEntry.id);
            setDeleteEntryId(null);
          }}
        />
      )}
    </section>
  );
}
