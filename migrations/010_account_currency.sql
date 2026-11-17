ALTER TABLE accounts
  ADD COLUMN currency CHAR(3) NOT NULL DEFAULT 'PEN',
  ADD CONSTRAINT chk_accounts_currency CHECK (currency IN ('PEN', 'USD'));

ALTER TABLE movements
  ADD COLUMN currency CHAR(3) NOT NULL DEFAULT 'PEN',
  ADD CONSTRAINT chk_movements_currency CHECK (currency IN ('PEN', 'USD'));
