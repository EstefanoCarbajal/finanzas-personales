ALTER TABLE categories
  ADD COLUMN color VARCHAR(12) CHARACTER SET ascii COLLATE ascii_bin NULL,
  ADD CONSTRAINT chk_category_color CHECK (color IS NULL OR color IN ('sun','leaf','blue','violet','pink','sand'));
