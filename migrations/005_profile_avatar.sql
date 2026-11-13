CREATE TABLE user_preferences (
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  avatar_id ENUM('koala','fox','cat','panda','rabbit','bear') NOT NULL DEFAULT 'koala',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
