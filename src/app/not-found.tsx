import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full p-6 border border-border rounded-md bg-card text-card-foreground text-center space-y-4">
        <span className="text-2xl font-bold text-muted-foreground">404</span>
        <h2 className="text-lg font-semibold">Page Not Found</h2>
        <p className="text-xs text-muted-foreground">
          The requested page or repository record could not be found.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
