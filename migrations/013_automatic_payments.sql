ALTER TABLE scheduled_payments
  ADD COLUMN automatic_at DATETIME NULL,
  ADD INDEX scheduled_automatic (status, automatic_at);
