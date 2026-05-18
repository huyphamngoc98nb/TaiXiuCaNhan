-- Migration 018: keep only one active budget per category/wallet scope.
-- Scope edits between "all accounts" and "account type" used to leave both rows
-- active because the old row had a different account_type_scope.

UPDATE budgets
SET is_active = 0,
    updated_at = (strftime('%s', 'now') * 1000)
WHERE is_active = 1
  AND EXISTS (
    SELECT 1
    FROM budgets newer
    WHERE newer.is_active = 1
      AND newer.category_id = budgets.category_id
      AND (newer.wallet_id = budgets.wallet_id OR (newer.wallet_id IS NULL AND budgets.wallet_id IS NULL))
      AND (
        newer.updated_at > budgets.updated_at
        OR (newer.updated_at = budgets.updated_at AND newer.created_at > budgets.created_at)
        OR (newer.updated_at = budgets.updated_at AND newer.created_at = budgets.created_at AND newer.id > budgets.id)
      )
  );
