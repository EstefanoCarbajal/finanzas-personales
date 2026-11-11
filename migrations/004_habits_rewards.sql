CREATE TABLE habits (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  name VARCHAR(80) NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, id),
  UNIQUE (user_id, name),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE habit_completions (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  habit_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  completed_on DATE NOT NULL,
  points SMALLINT UNSIGNED NOT NULL DEFAULT 10,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, habit_id, completed_on),
  INDEX (user_id, completed_on),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (user_id, habit_id) REFERENCES habits(user_id, id),
  CHECK (points = 10)
) ENGINE=InnoDB;

CREATE TABLE personal_rewards (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  name VARCHAR(100) NOT NULL,
  cost_points INT UNSIGNED NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, id),
  UNIQUE (user_id, name),
  FOREIGN KEY (user_id) REFERENCES users(id),
  CHECK (cost_points > 0)
) ENGINE=InnoDB;

CREATE TABLE reward_redemptions (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  reward_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  week_key CHAR(8) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  cost_points INT UNSIGNED NOT NULL,
  redeemed_on DATE NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, week_key),
  INDEX (user_id, redeemed_on),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (user_id, reward_id) REFERENCES personal_rewards(user_id, id)
) ENGINE=InnoDB;
