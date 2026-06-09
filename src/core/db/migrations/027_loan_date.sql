-- Add the actual date when money was lent or borrowed.
ALTER TABLE loans ADD COLUMN loan_date TEXT;

UPDATE loans
SET loan_date = date(created_at / 1000, 'unixepoch', 'localtime')
WHERE loan_date IS NULL;
