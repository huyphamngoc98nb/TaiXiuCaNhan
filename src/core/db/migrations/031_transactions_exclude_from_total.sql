ALTER TABLE transactions
  ADD COLUMN exclude_from_total INTEGER NOT NULL DEFAULT 0;
