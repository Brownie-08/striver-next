"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="w-full max-w-2xl rounded-[1.75rem] border border-border/70 bg-card/45 p-8 shadow-[0_24px_70px_rgba(3,5,6,0.38)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
          Something went wrong
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold text-foreground">
          The WordPress content could not be loaded.
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          {error.message ||
            "Try the request again in a moment. The frontend is waiting on the headless CMS response."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:-translate-y-0.5"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
