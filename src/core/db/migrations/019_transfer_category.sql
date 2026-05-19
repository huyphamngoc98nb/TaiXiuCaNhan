-- Migration 019: add a stable system category for wallet transfers.
-- The categories table only supports income/expense, so transfers use this
-- expense-scoped category while their transaction type remains 'transfer'.

INSERT OR IGNORE INTO categories (id, name, type, icon, color, created_at, updated_at)
VALUES ('cat-transfer', 'Transfer', 'expense', 'arrow-left-right', '#6366f1', strftime('%s','now') * 1000, strftime('%s','now') * 1000);
