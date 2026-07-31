"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-900 font-sans">
        <div className="max-w-md w-full p-6 border border-slate-200 rounded-md bg-white text-center space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-red-600">Critical Application Error</h2>
          <p className="text-xs text-slate-600">
            {error.message || "A severe error occurred in the root layout."}
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 text-xs font-medium rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
