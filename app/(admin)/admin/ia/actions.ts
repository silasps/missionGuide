"use server";

import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/current-profile";

export async function createAIDraft(formData: FormData) {
  const { supabase, profile } = await getCurrentProfile();

  const generationType = String(formData.get("generation_type") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const purpose = String(formData.get("purpose") || "").trim();
  const challengeDescription = String(formData.get("challenge_description") || "").trim();
  const audience = String(formData.get("audience") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const costs = String(formData.get("costs") || "").trim();
  const prayerPoints = String(formData.get("prayer_points") || "").trim();

  if (!generationType) {
    throw new Error("Tipo de geração é obrigatório.");
  }

  const promptContext = {
    purpose,
    challenge_description: challengeDescription,
    audience,
    location,
    costs,
    prayer_points: prayerPoints,
  };

  const generatedResult =
    generationType === "desafio"
      ? {
          summary:
            "Rascunho inicial criado. Aqui ficará a resposta estruturada da IA na próxima etapa.",
          carousel_suggestion: [
            "Slide 1 — Apresente o desafio",
            "Slide 2 — Mostre onde acontecerá",
            "Slide 3 — Explique o impacto",
            "Slide 4 — Mostre como participar",
            "Slide 5 — Compartilhe pedidos de oração",
          ],
          video_suggestion:
            "Grave um vídeo de 1 minuto explicando o desafio, mostrando seu rosto, contexto e convite à participação.",
        }
      : {
          summary:
            "Rascunho inicial criado. Aqui ficará a resposta estruturada da IA na próxima etapa.",
        };

  const { data, error } = await supabase
    .from("ai_generations")
    .insert({
      profile_id: profile.id,
      generation_type: generationType,
      title: title || null,
      prompt_context: promptContext,
      generated_result: generatedResult,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/admin/ia/${generationType}/${data.id}`);
}