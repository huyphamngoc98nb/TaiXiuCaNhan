-- Migration 022: Credit-card metadata and statement scaffolding.
ALTER TABLE wallets ADD COLUMN annual_fee REAL;

CREATE TABLE IF NOT EXISTS credit_card_statements (
  id TEXT PRIMARY KEY,
  wallet_id TEXT NOT NULL,
  period_start INTEGER NOT NULL,
  period_end INTEGER NOT NULL,
  closing_at INTEGER NOT NULL,
  due_at INTEGER NOT NULL,
  statement_balance REAL NOT NULL DEFAULT 0,
  paid_amount REAL NOT NULL DEFAULT 0,
  remaining_amount REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('open', 'closed', 'partial', 'paid', 'overdue')) DEFAULT 'open',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (wallet_id) REFERENCES wallets (id) ON DELETE CASCADE,
  UNIQUE(wallet_id, period_start, period_end)
);

CREATE INDEX IF NOT EXISTS idx_transactions_wallet_date ON transactions(wallet_id, transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_to_wallet ON transactions(to_wallet_id);
CREATE INDEX IF NOT EXISTS idx_credit_card_statements_due ON credit_card_statements(wallet_id, due_at);
