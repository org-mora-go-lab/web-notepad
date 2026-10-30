export function Loading() {
  return (
    <main className="home is-loading" role="status" aria-label="Syncing notes">
      <div className="loading-skeleton" aria-hidden="true">
        <div className="loading-skeleton-header" />
        <div className="loading-skeleton-tab" />
        <div className="loading-skeleton-editor">
          <i />
          <i />
          <i />
        </div>
        <div className="loading-skeleton-footer" />
      </div>
      <span className="loading-mark">SYNCING NOTEPAD_</span>
    </main>
  );
}
