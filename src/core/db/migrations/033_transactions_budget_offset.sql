ALTER TABLE transactions
  ADD COLUMN is_budget_offset INTEGER NOT NULL DEFAULT 0;

ALTER TABLE transactions
  ADD COLUMN offset_budget_id TEXT DEFAULT NULL;
