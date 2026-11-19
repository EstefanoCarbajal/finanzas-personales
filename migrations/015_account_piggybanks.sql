CREATE TABLE account_piggybanks (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  account_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  slot TINYINT UNSIGNED NOT NULL,
  name VARCHAR(60) NOT NULL,
  amount DECIMAL(13,2) NOT NULL,
  target_on DATE NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, account_id, slot),
  FOREIGN KEY (user_id, account_id) REFERENCES accounts(user_id, id),
  CHECK (slot BETWEEN 1 AND 4),
  CHECK (amount > 0)
) ENGINE=InnoDB;

CREATE TABLE piggybank_requests (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  PRIMARY KEY (user_id, id),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;
