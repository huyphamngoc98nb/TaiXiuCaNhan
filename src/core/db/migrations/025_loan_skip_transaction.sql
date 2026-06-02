-- Migration 025: Allow tracking loans without recording an opening wallet transaction.

PRAGMA foreign_keys=OFF;
PRAGMA defer_foreign_keys=ON;

ALTER TABLE loans ADD COLUMN skip_transaction INTEGER NOT NULL DEFAULT 0;
-- 0 = tạo transaction, 1 = bỏ qua

DROP TABLE IF EXISTS loans_new;

CREATE TABLE loans_new (
  id TEXT PRIMARY KEY,
  wallet_id TEXT,
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
  skip_transaction INTEGER NOT NULL DEFAULT 0 CHECK (skip_transaction IN (0, 1)),
  CHECK (skip_transaction = 1 OR wallet_id IS NOT NULL),
  FOREIGN KEY (wallet_id) REFERENCES wallets (id)
);

INSERT INTO loans_new (
  id, wallet_id, type, contact_name, contact_info, principal,
  due_date, note, status, created_at, updated_at, deleted_at, skip_transaction
)
SELECT
  id, wallet_id, type, contact_name, contact_info, principal,
  due_date, note, status, created_at, updated_at, deleted_at, COALESCE(skip_transaction, 0)
FROM loans;

DROP TABLE loans;
ALTER TABLE loans_new RENAME TO loans;

CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_loans_due_date ON loans(due_date);

PRAGMA foreign_keys=ON;
