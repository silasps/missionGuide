"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/current-profile";

function cleanString(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function parseAmount(value: FormDataEntryValue | null) {
  const raw = cleanString(value).replace(/\./g, "").replace(",", ".");
  if (!raw) return null;

  const amount = Number(raw);
  return Number.isFinite(amount) ? amount : null;
}

function cleanType(value: FormDataEntryValue | null) {
  return cleanString(value) === "income" ? "income" : "expense";
}

function cleanCurrency(value: FormDataEntryValue | null) {
  const currency = cleanString(value).toUpperCase();
  return ["BRL", "USD", "EUR"].includes(currency) ? currency : "BRL";
}

export async function addTransaction(fd: FormData) {
  const { supabase, profile } = await getCurrentProfile();

  const date = cleanString(fd.get("date"));
  const description = cleanString(fd.get("description"));
  const categoryId = cleanString(fd.get("category_id"));
  const amount = parseAmount(fd.get("amount"));
  const currency = cleanCurrency(fd.get("currency"));
  const type = cleanType(fd.get("type"));
  const titheEligible = type === "income" && cleanString(fd.get("tithe_eligible")) === "on";

  if (!date) throw new Error("Informe a data do lançamento.");
  if (!description) throw new Error("Informe a descrição do lançamento.");
  if (amount === null) throw new Error("Informe o valor do lançamento.");

  const { error } = await supabase.from("finance_transactions").insert({
    profile_id: profile.id,
    date,
    description,
    amount,
    currency,
    type,
    tithe_eligible: titheEligible,
    category_id: categoryId || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/financeiro");
}

export async function updateTransaction(id: string, fd: FormData) {
  const { supabase, profile } = await getCurrentProfile();

  const date = cleanString(fd.get("date"));
  const description = cleanString(fd.get("description"));
  const categoryId = cleanString(fd.get("category_id"));
  const amount = parseAmount(fd.get("amount"));
  const currency = cleanCurrency(fd.get("currency"));
  const type = cleanType(fd.get("type"));
  const titheEligible = type === "income" && cleanString(fd.get("tithe_eligible")) === "on";

  if (!date) throw new Error("Informe a data do lançamento.");
  if (!description) throw new Error("Informe a descrição do lançamento.");
  if (amount === null) throw new Error("Informe o valor do lançamento.");

  const { error } = await supabase
    .from("finance_transactions")
    .update({
      date,
      description,
      amount,
      currency,
      type,
      tithe_eligible: titheEligible,
      category_id: categoryId || null,
    })
    .eq("id", id)
    .eq("profile_id", profile.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/financeiro");
}

export async function deleteTransaction(id: string) {
  const { supabase, profile } = await getCurrentProfile();

  const { error } = await supabase
    .from("finance_transactions")
    .delete()
    .eq("id", id)
    .eq("profile_id", profile.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/financeiro");
}

export async function addCategory(fd: FormData) {
  const { supabase, profile } = await getCurrentProfile();
  const name = cleanString(fd.get("name"));

  if (!name) throw new Error("Informe o nome da categoria.");

  const { error } = await supabase.from("finance_categories").insert({
    profile_id: profile.id,
    name,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/financeiro");
}

export async function updateCategory(id: string, fd: FormData) {
  const { supabase, profile } = await getCurrentProfile();
  const name = cleanString(fd.get("name"));

  if (!name) throw new Error("Informe o nome da categoria.");

  const { error } = await supabase
    .from("finance_categories")
    .update({ name })
    .eq("id", id)
    .eq("profile_id", profile.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/financeiro");
}

export async function deleteCategory(id: string) {
  const { supabase, profile } = await getCurrentProfile();

  const { error: unlinkError } = await supabase
    .from("finance_transactions")
    .update({ category_id: null })
    .eq("category_id", id)
    .eq("profile_id", profile.id);

  if (unlinkError) throw new Error(unlinkError.message);

  const { error } = await supabase
    .from("finance_categories")
    .delete()
    .eq("id", id)
    .eq("profile_id", profile.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/financeiro");
}
