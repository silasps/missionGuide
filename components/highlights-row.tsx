import Link from "next/link";

type Highlight = {
  id: string;
  title: string;
  cover_url: string | null;
};

export default function HighlightsRow({
  highlights,
  username,
}: {
  highlights: Highlight[];
  username: string;
}) {
  if (!highlights.length) return null;

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <p className="text-sm font-medium text-slate-500">Destaques da missão</p>

        <div className="mt-5 flex gap-5 overflow-x-auto pb-2">
          {highlights.map((item) => (
            <Link
              key={item.id}
              href={`/m/${username}/destaques/${item.id}`}
              className="min-w-[88px] text-center"
            >
              <div className="mx-auto h-20 w-20 rounded-full border-2 border-slate-300 p-1">
                {item.cover_url ? (
                  <img
                    src={item.cover_url}
                    alt={item.title}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-xs text-slate-500">
                    Sem img
                  </div>
                )}
              </div>

              <p className="mt-2 line-clamp-2 text-xs font-medium text-slate-700">
                {item.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}