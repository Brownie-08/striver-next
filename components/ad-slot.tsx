type AdSlotProps = {
  size: "billboard" | "leaderboard";
};

export function AdSlot({ size }: AdSlotProps) {
  const dimensions = size === "billboard" ? "970 x 250" : "728 x 90";
  const minHeight = size === "billboard" ? "min-h-[250px]" : "min-h-[90px]";

  return (
    <div
      className={`mx-auto my-8 hidden max-w-[970px] items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 ${minHeight} md:flex`}
    >
      <div className="text-center">
        <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-muted">
          Advertisement
        </p>
        <p className="text-sm text-muted">Reserved ad slot: {dimensions}</p>
      </div>
    </div>
  );
}
