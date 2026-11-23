CREATE TABLE user_admins (
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

INSERT INTO user_admins (user_id)
SELECT id FROM users WHERE (SELECT COUNT(*) FROM users) = 1;
