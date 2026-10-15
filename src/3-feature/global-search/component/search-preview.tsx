import { FileText } from "lucide-react";

import { useI18n } from "@/src/5-shared/hook";
import { SearchHighlight } from "@/src/5-shared/ui/search-field/component";

import type { SearchPreviewProps } from "../type";

export function SearchPreview({
  groupName,
  bookmark,
  query,
}: SearchPreviewProps) {
  const { t } = useI18n();

  return (
    <section className="global-search-preview" aria-label={t.searchPreview}>
      <header>
        <FileText size={16} aria-hidden="true" />
        <div>
          <strong>
            <SearchHighlight text={bookmark.title} query={query} />
          </strong>
          <span>
            <SearchHighlight text={groupName} query={query} />
          </span>
        </div>
      </header>
      <pre>
        <SearchHighlight text={bookmark.content} query={query} />
      </pre>
    </section>
  );
}
