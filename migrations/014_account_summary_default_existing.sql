ALTER TABLE accounts MODIFY COLUMN summary_selected BOOLEAN NOT NULL DEFAULT TRUE;
UPDATE accounts SET summary_selected = TRUE WHERE summary_selected = FALSE;
