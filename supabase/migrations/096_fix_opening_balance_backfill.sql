-- ============================================================
-- Correção de bug real na migration 095, achado pelo usuário na conta de
-- Silas logo depois de aplicá-la (2026-09-08, ver system.architecture.md
-- 7.20/Changelog): o backfill de lá usava `financial_accounts.balance`
-- (o saldo ATUAL da conta, hoje) como se fosse o saldo do dia em que a
-- conta foi criada — só é o mesmo número pra uma conta que nunca teve
-- nenhuma transação real desde a criação. Pra qualquer conta com
-- atividade real depois (a imensa maioria das contas em uso — ex.: uma
-- receita recebida depois da criação), o lançamento `opening_balance`
-- backfillado nasceu com um valor inflado, e `buildFinancialTimeline`
-- passou a contar esse valor errado JUNTO com as transações reais
-- subsequentes na reconstrução mês a mês — produzindo números fantasiosos
-- ("Saldo Anterior" negativo numa conta que nunca esteve negativa, no
-- caso relatado). Importante: `financial_accounts.balance` em si NUNCA foi
-- alterado por nenhuma das duas migrations (a 095 já desligava o trigger
-- durante o backfill) — o dinheiro real sempre esteve certo, só a
-- "documentação" histórica (o lançamento) e o gráfico derivado dela
-- ficaram errados.
--
-- Correção: recalcula cada lançamento `opening_balance` existente por
-- diferença — saldo atual da conta menos a soma de TODAS as outras
-- transações pagas dela (`source <> 'opening_balance'`) — que é
-- justamente o saldo que a conta tinha antes de qualquer transação real,
-- o valor certo pro dia da criação. Fórmula idempotente e segura tanto
-- pra linha errada da 095 quanto pra uma linha certa criada ao vivo pelo
-- `AccountWizard` já corrigido: como o trigger de saldo não olha `date`
-- (só soma toda transação paga, não importa quando aconteceu), uma conta
-- sem nenhuma atividade real recalcula pro mesmíssimo valor que já tinha
-- — não muda nada nela. Só corrige de verdade quem tinha atividade real
-- por cima do valor errado.
-- ============================================================
ALTER TABLE public.transactions DISABLE TRIGGER trg_update_balance;

WITH corrected AS (
  SELECT
    ob.id AS opening_tx_id,
    fa.balance - COALESCE((
      SELECT SUM(CASE WHEN t.type = 'income' THEN t.amount WHEN t.type = 'expense' THEN -t.amount ELSE 0 END)
      FROM public.transactions t
      WHERE t.account_id = fa.id AND t.is_paid = true AND t.source <> 'opening_balance'
    ), 0) AS correct_amount
  FROM public.transactions ob
  JOIN public.financial_accounts fa ON fa.id = ob.account_id
  WHERE ob.source = 'opening_balance'
)
UPDATE public.transactions t
SET
  type = CASE WHEN corrected.correct_amount >= 0 THEN 'income' ELSE 'expense' END,
  amount = ABS(corrected.correct_amount)
FROM corrected
WHERE t.id = corrected.opening_tx_id
  AND corrected.correct_amount <> 0;

-- Caso o valor correto dê exatamente zero (atividade real desde a
-- criação já "consumiu" todo o saldo inicial) — nada a documentar, mesmo
-- critério que a 095 já usava pra pular conta zerada ao criar o backfill.
DELETE FROM public.transactions t
USING (
  SELECT
    ob.id AS opening_tx_id,
    fa.balance - COALESCE((
      SELECT SUM(CASE WHEN t2.type = 'income' THEN t2.amount WHEN t2.type = 'expense' THEN -t2.amount ELSE 0 END)
      FROM public.transactions t2
      WHERE t2.account_id = fa.id AND t2.is_paid = true AND t2.source <> 'opening_balance'
    ), 0) AS correct_amount
  FROM public.transactions ob
  JOIN public.financial_accounts fa ON fa.id = ob.account_id
  WHERE ob.source = 'opening_balance'
) AS corrected
WHERE t.id = corrected.opening_tx_id
  AND corrected.correct_amount = 0;

ALTER TABLE public.transactions ENABLE TRIGGER trg_update_balance;
