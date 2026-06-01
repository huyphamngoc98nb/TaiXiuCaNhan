-- Migration 023: Loans and loan payment tracking.
CREATE TABLE IF NOT EXISTS loans (
  id TEXT PRIMARY KEY,
  wallet_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lend', 'borrow')),
  contact_name TEXT NOT NULL,
  contact_info TEXT,
  principal INTEGER NOT NULL CHECK (principal > 0),
  due_date TEXT,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'settled', 'cancelled')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER,
  FOREIGN KEY (wallet_id) REFERENCES wallets (id)
);

CREATE TABLE IF NOT EXISTS loan_payments (
  id TEXT PRIMARY KEY,
  loan_id TEXT NOT NULL,
  wallet_id TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  payment_date INTEGER NOT NULL,
  note TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (loan_id) REFERENCES loans (id) ON DELETE CASCADE,
  FOREIGN KEY (wallet_id) REFERENCES wallets (id)
);

CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_loans_due_date ON loans(due_date);
CREATE INDEX IF NOT EXISTS idx_loan_payments_loan_id ON loan_payments(loan_id);
