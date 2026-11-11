ALTER TABLE movements ADD UNIQUE KEY uq_movements_user_id_id (user_id, id);

CREATE TABLE goals (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  account_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  name VARCHAR(100) NOT NULL,
  target_amount DECIMAL(13,2) NOT NULL,
  target_on DATE NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, id),
  INDEX (user_id, created_at),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (user_id, account_id) REFERENCES accounts(user_id, id),
  CHECK (target_amount > 0)
) ENGINE=InnoDB;

CREATE TABLE goal_contributions (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  goal_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  movement_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  request_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  amount DECIMAL(13,2) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, request_id),
  UNIQUE (movement_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (user_id, goal_id) REFERENCES goals(user_id, id),
  FOREIGN KEY (user_id, movement_id) REFERENCES movements(user_id, id),
  CHECK (amount > 0)
) ENGINE=InnoDB;
