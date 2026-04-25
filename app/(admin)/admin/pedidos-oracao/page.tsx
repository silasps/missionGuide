import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function PedidosOracaoAdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: requests, error } = await supabase
    .from("prayer_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <p className="text-sm text-slate-400">Admin</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Pedidos de oração</h1>
      </div>

      {requests?.length ? (
        <div className="grid gap-4">
          {requests.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-5"
            >
              <h2 className="text-lg font-semibold text-white">
                {item.full_name || "Anônimo"}
              </h2>

              <div className="mt-2 space-y-1 text-sm text-slate-400">
                {item.email ? <p>E-mail: {item.email}</p> : null}
                {item.whatsapp ? <p>WhatsApp: {item.whatsapp}</p> : null}
                <p>Status: {item.status}</p>
                <p>Privado: {item.is_private ? "Sim" : "Não"}</p>
              </div>

              <p className="mt-4 rounded-2xl bg-slate-950 p-4 text-sm leading-7 text-slate-300">
                {item.request_text}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-10 text-slate-400">
          Nenhum pedido recebido ainda.
        </div>
      )}
    </div>
  );
}