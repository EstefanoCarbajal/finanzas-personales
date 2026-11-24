ALTER TABLE accounts
  ADD COLUMN credit_network VARCHAR(32) NULL,
  ADD COLUMN credit_model VARCHAR(64) NULL;
