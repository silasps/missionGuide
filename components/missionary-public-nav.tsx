import Link from "next/link";

export default function MissionaryPublicNav({
  username,
}: {
  username: string;
}) {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl gap-6 overflow-x-auto px-4 py-4 text-sm font-medium text-slate-600 sm:px-6">
        <Link
          href={`/m/${username}`}
          className="whitespace-nowrap hover:text-slate-900"
        >
          Início
        </Link>

        <Link
          href={`/m/${username}/publicacoes`}
          className="whitespace-nowrap hover:text-slate-900"
        >
          Publicações
        </Link>

        <Link
          href={`/m/${username}/historia`}
          className="whitespace-nowrap hover:text-slate-900"
        >
          História
        </Link>

        <Link
          href={`/m/${username}/parceria`}
          className="whitespace-nowrap hover:text-slate-900"
        >
          Seja parceiro
        </Link>

        <Link
          href={`/m/${username}/orar`}
          className="whitespace-nowrap hover:text-slate-900"
        >
          Pedido de oração
        </Link>
      </div>
    </nav>
  );
}