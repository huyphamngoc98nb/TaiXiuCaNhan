-- Idempotency metadata for transactions created by domain workflows.
ALTER TABLE transactions ADD COLUMN source_type TEXT;
ALTER TABLE transactions ADD COLUMN source_id TEXT;
ALTER TABLE transactions ADD COLUMN source_event TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_transactions_active_source
ON transactions(source_type, source_id, source_event)
WHERE deleted_at IS NULL
  AND source_type IS NOT NULL
  AND source_id IS NOT NULL
  AND source_event IS NOT NULL;
