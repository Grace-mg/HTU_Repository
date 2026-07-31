export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background text-foreground">
      <div className="max-w-xl space-y-4">
        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
          PROJECT-HUB Repository
        </span>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          University Project &amp; Thesis Repository
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Centralized academic platform for storing, organizing, and searching student projects and theses.
        </p>
        <div className="p-4 rounded-md border border-border bg-card text-card-foreground text-left text-xs space-y-2">
          <div className="font-semibold text-foreground">System Status</div>
          <div className="flex justify-between py-1 border-b border-border">
            <span className="text-muted-foreground">Foundation Status</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">Phase 1 Configured</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Backend Data Source</span>
            <span className="font-medium text-muted-foreground">—</span>
          </div>
        </div>
      </div>
    </main>
  );
}
