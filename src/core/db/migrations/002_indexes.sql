CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_category_date ON transactions(category_id, transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_type_date ON transactions(type, transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_date ON transactions(wallet_id, transaction_date);
CREATE INDEX IF NOT EXISTS idx_recurring_bills_due_active ON recurring_bills(next_due_date, is_active);
