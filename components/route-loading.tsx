type RouteLoadingProps = {
  tone?: "light" | "dark";
};

function SkeletonBlock({
  className,
  tone,
}: {
  className: string;
  tone: "light" | "dark";
}) {
  const color =
    tone === "dark"
      ? "bg-slate-800/80 route-loading-shimmer"
      : "bg-slate-200/80 route-loading-shimmer";

  return <div className={`${color} ${className}`} />;
}

export default function RouteLoading({ tone = "light" }: RouteLoadingProps) {
  const mutedText = tone === "dark" ? "text-slate-400" : "text-slate-500";
  const card =
    tone === "dark"
      ? "border-slate-800 bg-slate-900/70"
      : "border-slate-200 bg-white";

  return (
    <div
      className={`mx-auto w-full max-w-6xl ${
        tone === "dark" ? "text-white" : "text-slate-900"
      }`}
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Carregando página</span>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <SkeletonBlock className="h-4 w-28 rounded-full" tone={tone} />
          <SkeletonBlock className="mt-3 h-8 w-full max-w-sm rounded-lg" tone={tone} />
        </div>
        <SkeletonBlock className="hidden h-10 w-32 rounded-xl sm:block" tone={tone} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className={`rounded-2xl border p-4 shadow-sm ${card}`}>
            <SkeletonBlock className="h-4 w-20 rounded-full" tone={tone} />
            <SkeletonBlock className="mt-4 h-8 w-24 rounded-lg" tone={tone} />
            <SkeletonBlock className="mt-3 h-3 w-full rounded-full" tone={tone} />
          </div>
        ))}
      </div>

      <div className={`mt-5 rounded-2xl border p-4 shadow-sm ${card}`}>
        <div className="flex items-center gap-3">
          <SkeletonBlock className="h-12 w-12 rounded-full" tone={tone} />
          <div className="flex-1">
            <SkeletonBlock className="h-4 w-36 rounded-full" tone={tone} />
            <p className={`mt-2 text-sm ${mutedText}`}>Carregando...</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {[0, 1, 2, 3].map((item) => (
            <SkeletonBlock key={item} className="h-12 w-full rounded-xl" tone={tone} />
          ))}
        </div>
      </div>
    </div>
  );
}
