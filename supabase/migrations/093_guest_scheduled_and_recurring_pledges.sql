-- Permite registrar oferta agendada ("não posso agora") e parceria
-- recorrente manual ("ser parceiro fixo") sem conta — mesmo padrão que
-- `pledges` já usa pra doação avulsa (migration 012): reporter_user_id e
-- partner_id ficam opcionais, com nome/e-mail/telefone do convidado
-- guardados direto na linha, e insert liberado pra qualquer chamador (RLS
-- de leitura/escrita do próprio dono/logado continuam intactas).
ALTER TABLE public.scheduled_pledges
  ALTER COLUMN reporter_user_id DROP NOT NULL,
  ALTER COLUMN partner_id DROP NOT NULL,
  ADD COLUMN reporter_name  TEXT,
  ADD COLUMN reporter_email TEXT,
  ADD COLUMN reporter_phone TEXT;

-- Fica redundante assim que existe insert público (true OR ... = true) —
-- mesmo estado de pledges, que nunca teve policy de insert-self.
DROP POLICY "scheduled_pledges_insert_self" ON public.scheduled_pledges;

CREATE POLICY "scheduled_pledges_insert_public" ON public.scheduled_pledges
  FOR INSERT WITH CHECK (true);

ALTER TABLE public.recurring_pledges
  ALTER COLUMN reporter_user_id DROP NOT NULL,
  ALTER COLUMN partner_id DROP NOT NULL,
  ADD COLUMN reporter_name  TEXT,
  ADD COLUMN reporter_email TEXT,
  ADD COLUMN reporter_phone TEXT;

DROP POLICY "recurring_pledges_insert_self" ON public.recurring_pledges;

CREATE POLICY "recurring_pledges_insert_public" ON public.recurring_pledges
  FOR INSERT WITH CHECK (true);
