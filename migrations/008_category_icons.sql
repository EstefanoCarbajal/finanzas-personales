ALTER TABLE categories
  ADD COLUMN icon VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NULL,
  ADD CONSTRAINT chk_category_icon CHECK (icon IS NULL OR icon IN ('food','transport','home','fun','health','bag','education','pet','coffee','gift','salary','work','growth','heart','travel','tag'));
