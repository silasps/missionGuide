-- ============================================================
-- Lançamento de abertura ("Saldo inicial") — histórico com data (a pedido
-- do usuário, 2026-09-08, ver system.architecture.md 7.20/Changelog): até
-- aqui o saldo inicial digitado na criação da conta era só um número em
-- `financial_accounts.balance`, sem data nem rastro no histórico de
-- lançamentos — não dava pra ver quando aquele valor tinha entrado, nem
-- corrigir a data depois. `transactions.source` ganha 'opening_balance':
-- o valor inicial passa a ser um lançamento normal (type income/expense
-- conforme o sinal, is_paid=true, editável/excluível como qualquer outro),
-- com `date` escolhida pelo usuário no `AccountWizard` (campo novo,
-- default hoje, pode ser retroativa — "essa conta já existia antes de eu
-- cadastrar aqui").
-- ============================================================
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_source_check;
ALTER TABLE public.transactions ADD CONSTRAINT transactions_source_check
  CHECK (source IN ('manual', 'whatsapp', 'api', 'recurring', 'open_finance', 'import', 'opening_balance'));

-- Backfill: contas cadastradas antes desta migration não têm esse
-- lançamento. Cria um `opening_balance` retroativo, datado da criação da
-- conta (`created_at::date` — melhor aproximação disponível pra quando o
-- saldo passou a existir no sistema; se o usuário quiser uma data mais
-- precisa depois, o lançamento é editável normalmente), no valor do saldo
-- atual da conta — sem alterar o saldo em si: o trigger `trg_update_balance`
-- fica desligado durante o insert, senão somaria esse valor de novo em
-- cima do que já está em `balance`, duplicando. Idempotente: pula conta
-- que já tem um `opening_balance` (reaplicar a migration não duplica),
-- conta com saldo zerado (nada pra documentar) e conta de cartão de
-- crédito (saldo ali é fatura, não depósito inicial — mesmo critério que
-- `AccountWizard` já usa ao criar, que sempre zera `balance` pra crédito).
ALTER TABLE public.transactions DISABLE TRIGGER trg_update_balance;

INSERT INTO public.transactions (account_id, profile_id, created_by_user_id, type, amount, currency, description, source, is_paid, date)
SELECT
  fa.id,
  fa.profile_id,
  fa.created_by_user_id,
  CASE WHEN fa.balance >= 0 THEN 'income' ELSE 'expense' END,
  ABS(fa.balance),
  fa.currency_code,
  'Saldo inicial',
  'opening_balance',
  true,
  fa.created_at::date
FROM public.financial_accounts fa
WHERE fa.balance <> 0
  AND fa.account_type <> 'credit'
  AND NOT EXISTS (
    SELECT 1 FROM public.transactions t WHERE t.account_id = fa.id AND t.source = 'opening_balance'
  );

ALTER TABLE public.transactions ENABLE TRIGGER trg_update_balance;
