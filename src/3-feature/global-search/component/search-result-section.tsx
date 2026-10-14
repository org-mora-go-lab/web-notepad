import type { SearchResultSectionProps } from "../type";

export function SearchResultSection({
  title,
  className,
  children,
}: SearchResultSectionProps) {
  return (
    <section className={`global-search-section ${className}`}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}
