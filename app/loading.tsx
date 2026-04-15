export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="h-16 border-b border-border/80 bg-nav-bg/95" />
      <div className="border-b border-border/80 bg-nav-bg/85 px-4 py-3">
        <div className="mx-auto h-6 max-w-7xl animate-pulse rounded-full bg-card/70" />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse rounded-[2rem] border border-border/70 bg-card/45 p-8">
          <div className="h-4 w-32 rounded-full bg-primary/40" />
          <div className="mt-5 h-14 max-w-3xl rounded-2xl bg-card" />
          <div className="mt-4 h-5 max-w-2xl rounded-full bg-card" />
          <div className="mt-3 h-5 max-w-xl rounded-full bg-card" />
          <div className="mt-8 h-[22rem] rounded-[1.5rem] bg-card" />
        </div>
      </div>
    </div>
  );
}
