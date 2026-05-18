-- Migration 017: keep only one active budget per category/scope.
-- Older builds allowed one active budget per period, so changing monthly to weekly
-- could leave both rows active for the same category and scope.

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
        newer.account_type_scope = budgets.account_type_scope
        OR (newer.account_type_scope IS NULL AND budgets.account_type_scope IS NULL)
      )
      AND (
        newer.updated_at > budgets.updated_at
        OR (newer.updated_at = budgets.updated_at AND newer.created_at > budgets.created_at)
        OR (newer.updated_at = budgets.updated_at AND newer.created_at = budgets.created_at AND newer.id > budgets.id)
      )
  );

CREATE INDEX IF NOT EXISTS idx_budgets_active_scope
  ON budgets(category_id, wallet_id, account_type_scope, is_active);
