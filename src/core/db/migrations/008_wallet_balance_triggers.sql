-- Migration 008: Wallet balance triggers and transfer check constraint

-- 1. Initial sync of all wallet balances
UPDATE wallets SET balance = (
  SELECT 
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) -
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) -
    COALESCE(SUM(CASE WHEN type = 'transfer' THEN amount ELSE 0 END), 0)
  FROM transactions 
  WHERE wallet_id = wallets.id AND deleted_at IS NULL
) + (
  SELECT COALESCE(SUM(amount), 0)
  FROM transactions
  WHERE to_wallet_id = wallets.id AND type = 'transfer' AND deleted_at IS NULL
);

-- 2. Trigger to enforce transfer constraints (Bug-05 check constraint replacement)
CREATE TRIGGER IF NOT EXISTS trg_transactions_transfer_check_ins
BEFORE INSERT ON transactions
FOR EACH ROW
BEGIN
  SELECT CASE
    WHEN NEW.type = 'transfer' AND NEW.to_wallet_id IS NULL THEN
      RAISE(ABORT, 'to_wallet_id is required for transfer transactions')
    WHEN NEW.type != 'transfer' AND NEW.to_wallet_id IS NOT NULL THEN
      RAISE(ABORT, 'to_wallet_id must be NULL for non-transfer transactions')
  END;
END;

CREATE TRIGGER IF NOT EXISTS trg_transactions_transfer_check_upd
BEFORE UPDATE ON transactions
FOR EACH ROW
BEGIN
  SELECT CASE
    WHEN NEW.type = 'transfer' AND NEW.to_wallet_id IS NULL THEN
      RAISE(ABORT, 'to_wallet_id is required for transfer transactions')
    WHEN NEW.type != 'transfer' AND NEW.to_wallet_id IS NOT NULL THEN
      RAISE(ABORT, 'to_wallet_id must be NULL for non-transfer transactions')
  END;
END;

-- 3. Triggers to keep wallet balances in sync (Bug-06)

CREATE TRIGGER IF NOT EXISTS trg_wallets_balance_after_insert
AFTER INSERT ON transactions
WHEN NEW.deleted_at IS NULL
BEGIN
  -- Update source wallet
  UPDATE wallets SET balance = (
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN type = 'transfer' THEN amount ELSE 0 END), 0)
    FROM transactions 
    WHERE wallet_id = NEW.wallet_id AND deleted_at IS NULL
  ) + (
    SELECT COALESCE(SUM(amount), 0)
    FROM transactions
    WHERE to_wallet_id = NEW.wallet_id AND type = 'transfer' AND deleted_at IS NULL
  ) WHERE id = NEW.wallet_id;

  -- Update destination wallet if transfer
  UPDATE wallets SET balance = (
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN type = 'transfer' THEN amount ELSE 0 END), 0)
    FROM transactions 
    WHERE wallet_id = NEW.to_wallet_id AND deleted_at IS NULL
  ) + (
    SELECT COALESCE(SUM(amount), 0)
    FROM transactions
    WHERE to_wallet_id = NEW.to_wallet_id AND type = 'transfer' AND deleted_at IS NULL
  ) WHERE id = NEW.to_wallet_id AND NEW.type = 'transfer';
END;

CREATE TRIGGER IF NOT EXISTS trg_wallets_balance_after_update
AFTER UPDATE ON transactions
BEGIN
  -- Update OLD source wallet
  UPDATE wallets SET balance = (
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN type = 'transfer' THEN amount ELSE 0 END), 0)
    FROM transactions 
    WHERE wallet_id = OLD.wallet_id AND deleted_at IS NULL
  ) + (
    SELECT COALESCE(SUM(amount), 0)
    FROM transactions
    WHERE to_wallet_id = OLD.wallet_id AND type = 'transfer' AND deleted_at IS NULL
  ) WHERE id = OLD.wallet_id;

  -- Update NEW source wallet (if different)
  UPDATE wallets SET balance = (
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN type = 'transfer' THEN amount ELSE 0 END), 0)
    FROM transactions 
    WHERE wallet_id = NEW.wallet_id AND deleted_at IS NULL
  ) + (
    SELECT COALESCE(SUM(amount), 0)
    FROM transactions
    WHERE to_wallet_id = NEW.to_wallet_id AND type = 'transfer' AND deleted_at IS NULL
  ) WHERE id = NEW.wallet_id AND NEW.wallet_id != OLD.wallet_id;

  -- Update OLD destination wallet if it was a transfer
  UPDATE wallets SET balance = (
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN type = 'transfer' THEN amount ELSE 0 END), 0)
    FROM transactions 
    WHERE wallet_id = OLD.to_wallet_id AND deleted_at IS NULL
  ) + (
    SELECT COALESCE(SUM(amount), 0)
    FROM transactions
    WHERE to_wallet_id = OLD.to_wallet_id AND type = 'transfer' AND deleted_at IS NULL
  ) WHERE id = OLD.to_wallet_id AND OLD.type = 'transfer';

  -- Update NEW destination wallet if it is a transfer
  UPDATE wallets SET balance = (
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN type = 'transfer' THEN amount ELSE 0 END), 0)
    FROM transactions 
    WHERE wallet_id = NEW.to_wallet_id AND deleted_at IS NULL
  ) + (
    SELECT COALESCE(SUM(amount), 0)
    FROM transactions
    WHERE to_wallet_id = NEW.to_wallet_id AND type = 'transfer' AND deleted_at IS NULL
  ) WHERE id = NEW.to_wallet_id AND NEW.type = 'transfer' AND (NEW.to_wallet_id != OLD.to_wallet_id OR OLD.type != 'transfer');
END;

CREATE TRIGGER IF NOT EXISTS trg_wallets_balance_after_delete
AFTER DELETE ON transactions
BEGIN
  -- Update source wallet
  UPDATE wallets SET balance = (
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN type = 'transfer' THEN amount ELSE 0 END), 0)
    FROM transactions 
    WHERE wallet_id = OLD.wallet_id AND deleted_at IS NULL
  ) + (
    SELECT COALESCE(SUM(amount), 0)
    FROM transactions
    WHERE to_wallet_id = OLD.wallet_id AND type = 'transfer' AND deleted_at IS NULL
  ) WHERE id = OLD.wallet_id;

  -- Update destination wallet if transfer
  UPDATE wallets SET balance = (
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN type = 'transfer' THEN amount ELSE 0 END), 0)
    FROM transactions 
    WHERE wallet_id = OLD.to_wallet_id AND deleted_at IS NULL
  ) + (
    SELECT COALESCE(SUM(amount), 0)
    FROM transactions
    WHERE to_wallet_id = OLD.to_wallet_id AND type = 'transfer' AND deleted_at IS NULL
  ) WHERE id = OLD.to_wallet_id AND OLD.type = 'transfer';
END;
