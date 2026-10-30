export function Loading() {
  return (
    <div
      className="initial-sync-lock"
      role="status"
      aria-label="Syncing notes"
      aria-busy="true"
    >
      <span className="initial-sync-progress" aria-hidden="true" />
    </div>
  );
}
