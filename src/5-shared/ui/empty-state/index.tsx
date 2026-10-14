import type { EmptyStateProps } from "./type";

export function EmptyState({
  message,
  icon,
  className = "",
  search = false,
}: EmptyStateProps) {
  return (
    <div className={`empty-state ${search ? "is-search" : ""} ${className}`}>
      {icon}
      <p>{message}</p>
    </div>
  );
}
