ALTER TABLE accounts
  ADD COLUMN opening_balance DECIMAL(13,2) NOT NULL DEFAULT 0.00,
  ADD CONSTRAINT chk_accounts_opening_balance CHECK (opening_balance >= 0);
