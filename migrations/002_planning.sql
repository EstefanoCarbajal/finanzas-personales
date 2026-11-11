CREATE TABLE budgets (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  category_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  month_start DATE NOT NULL,
  amount DECIMAL(13,2) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, category_id, month_start),
  INDEX (user_id, month_start),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (user_id, category_id) REFERENCES categories(user_id, id),
  CHECK (DAYOFMONTH(month_start) = 1),
  CHECK (amount > 0)
) ENGINE=InnoDB;

CREATE TABLE scheduled_payments (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  account_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  category_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  description VARCHAR(100) NOT NULL,
  amount DECIMAL(13,2) NOT NULL,
  due_on DATE NOT NULL,
  status ENUM('scheduled','paid','cancelled') NOT NULL DEFAULT 'scheduled',
  paid_on DATE NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_id, status, due_on),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (user_id, account_id) REFERENCES accounts(user_id, id),
  FOREIGN KEY (user_id, category_id) REFERENCES categories(user_id, id),
  CHECK (amount > 0),
  CHECK ((status = 'paid' AND paid_on IS NOT NULL) OR (status <> 'paid' AND paid_on IS NULL))
) ENGINE=InnoDB;
