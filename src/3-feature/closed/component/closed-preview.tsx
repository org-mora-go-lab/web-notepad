"use client";

import { ArchiveRestore, Trash2 } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/src/5-shared/hook";
import { ConfirmPopup } from "@/src/5-shared/ui";
import { SearchHighlight } from "@/src/5-shared/ui/search-field/component";
import { formatDate } from "@/src/5-shared/util";

import type { ClosedPreviewProps } from "../type";

export function ClosedPreview({
  entry,
  searchQuery,
  onRestore,
  onRemove,
}: ClosedPreviewProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { t } = useI18n();
  const { tab } = entry;

  return (
    <section className="closed-preview" aria-label={tab.title}>
      <header>
        <div>
          <strong>
            <SearchHighlight text={tab.title} query={searchQuery} />
          </strong>
          <time dateTime={new Date(entry.closedAt).toISOString()}>
            {formatDate(entry.closedAt)}
          </time>
        </div>
        <div className="closed-preview-actions">
          <button
            type="button"
            onClick={() => onRestore(entry.id)}
            aria-label={t.reopen}
            title={t.reopen}
          >
            <ArchiveRestore size={16} />
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            aria-label={t.deleteClosedTabFor(tab.title)}
            title={t.deleteClosedTab}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </header>
      <pre>
        <SearchHighlight text={tab.content} query={searchQuery} />
      </pre>
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
    </section>
  );
}
