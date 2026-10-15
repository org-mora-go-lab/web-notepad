import { FileText } from "lucide-react";

import { useI18n } from "@/src/5-shared/hook";

import type { SearchPreviewProps } from "../type";

export function SearchPreview({ groupName, bookmark }: SearchPreviewProps) {
  const { t } = useI18n();

  return (
    <section className="global-search-preview" aria-label={t.searchPreview}>
      <header>
        <FileText size={16} aria-hidden="true" />
        <div>
          <strong>{bookmark.title}</strong>
          <span>{groupName}</span>
        </div>
      </header>
      <pre>{bookmark.content}</pre>
    </section>
  );
}
