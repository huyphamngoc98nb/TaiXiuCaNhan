-- Migration 024: Stable system categories for loan workflows.
ALTER TABLE categories ADD COLUMN slug TEXT;
ALTER TABLE categories ADD COLUMN is_system INTEGER NOT NULL DEFAULT 0 CHECK (is_system IN (0, 1));

CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug) WHERE slug IS NOT NULL;

UPDATE categories
SET slug = 'transfer',
    is_system = 1
WHERE id = 'cat-transfer'
  AND slug IS NULL;

INSERT OR IGNORE INTO categories (id, slug, name, type, icon, color, is_system, created_at, updated_at)
VALUES
  ('b32b9bd5-3dd4-4b24-9d80-75903e1d4011', 'cho_vay', 'Cho vay', 'expense', 'hand-coins', '#F59E0B', 1, strftime('%s','now') * 1000, strftime('%s','now') * 1000),
  ('a83d3304-3c80-4e2c-969d-efc7340713cf', 'vay_no', 'Vay nợ', 'income', 'credit-card', '#3B82F6', 1, strftime('%s','now') * 1000, strftime('%s','now') * 1000),
  ('cc66e7ee-97d3-4d66-9b2a-d62896d2f904', 'thu_no', 'Thu nợ', 'income', 'arrow-down-circle', '#10B981', 1, strftime('%s','now') * 1000, strftime('%s','now') * 1000),
  ('d7dfc853-1c66-4e1c-8c05-4c4ee33491dd', 'tra_no', 'Trả nợ', 'expense', 'arrow-up-circle', '#EF4444', 1, strftime('%s','now') * 1000, strftime('%s','now') * 1000);
