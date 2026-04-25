import Link from "next/link";

type Props = {
  username: string;
  post: {
    id: string;
    title: string;
    slug: string | null;
    excerpt: string | null;
    cover_url: string | null;
  };
};

export default function SocialPostCard({ username, post }: Props) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {post.cover_url ? (
        <img
          src={post.cover_url}
          alt={post.title}
          className="aspect-video w-full object-cover"
        />
      ) : (
        <div className="flex aspect-video items-center justify-center bg-slate-100 text-slate-400">
          Sem capa
        </div>
      )}

      <div className="p-5">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          {post.title}
        </h2>

        {post.excerpt ? (
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
            {post.excerpt}
          </p>
        ) : null}

        {post.slug ? (
          <Link
            href={`/m/${username}/publicacoes/${post.slug}`}
            className="mt-5 inline-flex text-sm font-semibold text-slate-900"
          >
            Ler publicação
          </Link>
        ) : null}
      </div>
    </article>
  );
}