ALTER TABLE accounts
  ADD COLUMN account_type ENUM('asset', 'credit') NOT NULL DEFAULT 'asset',
  ADD COLUMN credit_limit DECIMAL(13,2) NULL,
  ADD COLUMN opening_debt DECIMAL(13,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN last_four CHAR(4) CHARACTER SET ascii NULL,
  ADD CONSTRAINT chk_account_credit CHECK (
    (account_type = 'asset' AND credit_limit IS NULL AND opening_debt = 0 AND last_four IS NULL)
    OR (account_type = 'credit' AND credit_limit IS NOT NULL AND credit_limit > 0
      AND opening_debt >= 0 AND opening_debt <= credit_limit
      AND (last_four IS NULL OR last_four REGEXP '^[0-9]{4}$'))
  );
