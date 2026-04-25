"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { HandHeart, ChevronDown } from "lucide-react";

type Mode = "login" | "register" | "forgot";

const COUNTRIES = [
  { code: "BR", flag: "🇧🇷", name: "Brasil", ddi: "55", digits: 11, mask: "(##) #####-####" },
  { code: "US", flag: "🇺🇸", name: "EUA", ddi: "1", digits: 10, mask: "(###) ###-####" },
  { code: "CA", flag: "🇨🇦", name: "Canadá", ddi: "1", digits: 10, mask: "(###) ###-####" },
  { code: "PT", flag: "🇵🇹", name: "Portugal", ddi: "351", digits: 9, mask: "### ### ###" },
  { code: "GB", flag: "🇬🇧", name: "Reino Unido", ddi: "44", digits: 10, mask: "#### ### ####" },
  { code: "DE", flag: "🇩🇪", name: "Alemanha", ddi: "49", digits: 11, mask: "#### #######" },
  { code: "FR", flag: "🇫🇷", name: "França", ddi: "33", digits: 9, mask: "## ## ## ###" },
  { code: "ES", flag: "🇪🇸", name: "Espanha", ddi: "34", digits: 9, mask: "### ### ###" },
  { code: "IT", flag: "🇮🇹", name: "Itália", ddi: "39", digits: 10, mask: "### ### ####" },
  { code: "AR", flag: "🇦🇷", name: "Argentina", ddi: "54", digits: 10, mask: "### ####-####" },
  { code: "MX", flag: "🇲🇽", name: "México", ddi: "52", digits: 10, mask: "### ###-####" },
  { code: "CO", flag: "🇨🇴", name: "Colômbia", ddi: "57", digits: 10, mask: "### ###-####" },
  { code: "CL", flag: "🇨🇱", name: "Chile", ddi: "56", digits: 9, mask: "# ####-####" },
  { code: "PE", flag: "🇵🇪", name: "Peru", ddi: "51", digits: 9, mask: "### ### ###" },
  { code: "AO", flag: "🇦🇴", name: "Angola", ddi: "244", digits: 9, mask: "### ### ###" },
  { code: "MZ", flag: "🇲🇿", name: "Moçambique", ddi: "258", digits: 9, mask: "## ### ####" },
  { code: "ZA", flag: "🇿🇦", name: "África do Sul", ddi: "27", digits: 9, mask: "## ### ####" },
  { code: "IL", flag: "🇮🇱", name: "Israel", ddi: "972", digits: 9, mask: "##-###-####" },
  { code: "JP", flag: "🇯🇵", name: "Japão", ddi: "81", digits: 10, mask: "##-####-####" },
  { code: "AU", flag: "🇦🇺", name: "Austrália", ddi: "61", digits: 9, mask: "### ### ###" },
  { code: "NZ", flag: "🇳🇿", name: "Nova Zelândia", ddi: "64", digits: 9, mask: "### ### ###" },
  { code: "BO", flag: "🇧🇴", name: "Bolívia", ddi: "591", digits: 8, mask: "#### ####" },
  { code: "UY", flag: "🇺🇾", name: "Uruguai", ddi: "598", digits: 8, mask: "#### ####" },
  { code: "PY", flag: "🇵🇾", name: "Paraguai", ddi: "595", digits: 9, mask: "### ### ###" },
];

function applyMask(digits: string, mask: string): string {
  let result = "";
  let di = 0;
  for (let i = 0; i < mask.length && di < digits.length; i++) {
    if (mask[i] === "#") {
      result += digits[di++];
    } else {
      result += mask[i];
    }
  }
  return result;
}

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [phoneCountry, setPhoneCountry] = useState(COUNTRIES[0]);
  const [phoneDigits, setPhoneDigits] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");

  function showMsg(text: string, type: "error" | "success" = "error") {
    setMessage(text);
    setMessageType(type);
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    setPhoneDigits(raw.slice(0, phoneCountry.digits));
  }

  function handlePhoneKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && phoneDigits.length > 0) {
      e.preventDefault();
      setPhoneDigits((prev) => prev.slice(0, -1));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (mode === "register") {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        showMsg(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        const phone = phoneDigits ? phoneCountry.ddi + phoneDigits : null;
        await supabase.from("profiles").upsert(
          {
            id: data.user.id,
            display_name: fullName || null,
            city: city || null,
            state: state || null,
            birth_date: birthday || null,
            phone,
          },
          { onConflict: "id" }
        );
      }

      showMsg("Conta criada! Verifique seu e-mail e depois entre.", "success");
      setMode("login");
      setPassword("");
      setFullName("");
      setBirthday("");
      setCity("");
      setState("");
      setPhoneDigits("");
      setLoading(false);
      return;
    }

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        showMsg(error.message);
        setLoading(false);
        return;
      }

      showMsg("Link de redefinição enviado para seu e-mail.", "success");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      showMsg("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    router.push("/admin/feed");
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel — desktop only */}
      <div className="relative hidden flex-col justify-between bg-orange-500 p-12 lg:flex lg:w-[45%]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, #fff 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7c2d12 0%, transparent 50%)",
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
            <HandHeart size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white">Sistema Missionário</span>
        </div>

        <div className="relative z-10">
          <p className="text-5xl font-bold leading-tight text-white">
            Conectando missões
            <br />
            ao mundo.
          </p>
          <p className="mt-6 text-lg leading-8 text-orange-100">
            Compartilhe sua história, inspire pessoas e construa uma rede de parceiros que caminha com você.
          </p>
        </div>

        <div className="relative z-10 rounded-2xl bg-white/10 p-6">
          <p className="text-sm italic leading-7 text-orange-50">
            &quot;Ide por todo o mundo e pregai o evangelho a toda criatura.&quot;
          </p>
          <p className="mt-3 text-xs font-semibold text-orange-200">Marcos 16:15</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500">
            <HandHeart size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">Sistema Missionário</span>
        </div>

        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-slate-900">
            {mode === "login" ? "Bem-vindo de volta" : mode === "register" ? "Criar conta" : "Recuperar senha"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {mode === "login"
              ? "Entre para acompanhar missões e missionários."
              : mode === "register"
              ? "Junte-se à plataforma e conecte-se com missões ao redor do mundo."
              : "Informe seu e-mail para receber o link de redefinição."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === "register" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Nome completo
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {mode !== "forgot" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Senha
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            )}

            {mode === "register" && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Data de nascimento
                  </label>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Sua cidade"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Estado
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="UF"
                      maxLength={2}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>

                {/* WhatsApp / Phone */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    WhatsApp / Telefone
                  </label>
                  <div className="flex gap-2">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setCountryOpen(!countryOpen)}
                        className="flex h-full items-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      >
                        <span>{phoneCountry.flag}</span>
                        <span className="text-slate-600">+{phoneCountry.ddi}</span>
                        <ChevronDown size={14} className="text-slate-400" />
                      </button>

                      {countryOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setCountryOpen(false)}
                          />
                          <div className="absolute left-0 top-full z-50 mt-1 max-h-60 min-w-[220px] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
                            {COUNTRIES.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => {
                                  setPhoneCountry(c);
                                  setPhoneDigits("");
                                  setCountryOpen(false);
                                }}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <span>{c.flag}</span>
                                <span className="flex-1 text-left">{c.name}</span>
                                <span className="text-slate-400">+{c.ddi}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    <input
                      type="tel"
                      value={applyMask(phoneDigits, phoneCountry.mask)}
                      onChange={handlePhoneChange}
                      onKeyDown={handlePhoneKeyDown}
                      placeholder={phoneCountry.mask.replace(/#/g, "0")}
                      className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>
              </>
            )}

            {message && (
              <div
                className={`rounded-xl px-4 py-3 text-sm ${
                  messageType === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              {loading
                ? "Carregando..."
                : mode === "login"
                ? "Entrar"
                : mode === "register"
                ? "Criar conta"
                : "Enviar link"}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {mode !== "login" && (
              <button
                onClick={() => { setMode("login"); setMessage(""); }}
                className="text-slate-600 hover:text-orange-500"
              >
                Já tenho conta
              </button>
            )}
            {mode !== "register" && (
              <button
                onClick={() => { setMode("register"); setMessage(""); }}
                className="text-slate-600 hover:text-orange-500"
              >
                Criar conta
              </button>
            )}
            {mode !== "forgot" && (
              <button
                onClick={() => { setMode("forgot"); setMessage(""); }}
                className="text-slate-600 hover:text-orange-500"
              >
                Esqueci a senha
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
