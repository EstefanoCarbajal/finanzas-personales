CREATE TABLE users (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE sessions (
  token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX (expires_at)
) ENGINE=InnoDB;

CREATE TABLE login_limits (
  bucket CHAR(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  attempts INT UNSIGNED NOT NULL DEFAULT 0,
  window_end DATETIME NOT NULL
) ENGINE=InnoDB;

CREATE TABLE accounts (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  name VARCHAR(80) NOT NULL,
  UNIQUE (user_id, id),
  UNIQUE (user_id, name),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE categories (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  name VARCHAR(80) NOT NULL,
  kind ENUM('income','expense') NOT NULL,
  UNIQUE (user_id, id),
  UNIQUE (user_id, name, kind),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE movements (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  request_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  kind ENUM('income','expense','transfer') NOT NULL,
  account_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  destination_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
  category_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
  amount DECIMAL(13,2) NOT NULL,
  description VARCHAR(100) NOT NULL,
  occurred_on DATE NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, request_id),
  INDEX (user_id, occurred_on),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (user_id, account_id) REFERENCES accounts(user_id, id),
  FOREIGN KEY (user_id, destination_id) REFERENCES accounts(user_id, id),
  FOREIGN KEY (user_id, category_id) REFERENCES categories(user_id, id),
  CHECK (amount > 0),
  CHECK ((kind = 'transfer' AND destination_id IS NOT NULL AND destination_id <> account_id AND category_id IS NULL)
    OR (kind IN ('income','expense') AND destination_id IS NULL AND category_id IS NOT NULL))
) ENGINE=InnoDB;
