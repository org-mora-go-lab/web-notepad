"use client";

import { ArchiveRestore, Trash2 } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/src/5-shared/hook";
import { ConfirmPopup } from "@/src/5-shared/ui";
import { SearchHighlight } from "@/src/5-shared/ui/search-field/component";
import { formatDate } from "@/src/5-shared/util";

import type { ClosedItemProps } from "../type";

export function ClosedItem({
  entry,
  searchQuery,
  onRestore,
  onRemove,
}: ClosedItemProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { t } = useI18n();
  const { tab } = entry;

  return (
    <article className="closed-item">
      <div className="closed-item-heading">
        <strong>
          <SearchHighlight text={tab.title} query={searchQuery} />
        </strong>
        <time dateTime={new Date(entry.closedAt).toISOString()}>
          {formatDate(entry.closedAt)}
        </time>
      </div>
      <p className={`closed-item-content ${tab.content.trim() ? "" : "is-empty"}`}>
        <SearchHighlight text={tab.content} query={searchQuery} />
      </p>
      <div className="closed-actions">
        <div className="closed-primary-actions">
          <button type="button" onClick={() => onRestore(entry.id)}>
            <ArchiveRestore size={14} />
            {t.reopen}
          </button>
        </div>
        <button
          className="remove-closed"
          type="button"
          onClick={() => setConfirmingDelete(true)}
          aria-label={t.deleteClosedTabFor(tab.title)}
          title={t.deleteClosedTab}
        >
          <Trash2 size={14} />
        </button>
      </div>
      {confirmingDelete && (
        <ConfirmPopup
          title={t.deleteClosedTabTitle}
          message={t.deleteClosedTabMessage(tab.title)}
          closeLabel={t.closeDeleteClosedTabConfirmation}
          closeTitle={t.close}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={() => {
            onRemove(entry.id);
            setConfirmingDelete(false);
          }}
        />
      )}
    </article>
  );
}
