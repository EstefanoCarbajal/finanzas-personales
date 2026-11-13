ALTER TABLE user_preferences
  ADD CONSTRAINT chk_avatar_choice CHECK (avatar_id <> '');
