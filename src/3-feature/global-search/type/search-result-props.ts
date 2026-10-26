export type SearchResultProps = {
  category: string;
  kind?: "tab";
  groupName?: string;
  title: string;
  description?: string;
  query: string;
  ariaLabel: string;
  onSelect: () => void;
  selected?: boolean;
};
