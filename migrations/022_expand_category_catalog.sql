ALTER TABLE categories
  DROP CONSTRAINT chk_category_icon,
  DROP CONSTRAINT chk_category_color,
  ADD CONSTRAINT chk_category_icon_catalog CHECK (
    icon IS NULL OR icon IN (
      'food','transport','home','fun','health','bag','education','pet','coffee','gift','salary','work','growth','heart','travel','tag',
      'fuel','utilities','tech','music','sports','insurance','subscriptions','taxes'
    )
  ),
  ADD CONSTRAINT chk_category_color_catalog CHECK (
    color IS NULL OR color IN ('sun','leaf','blue','violet','pink','sand','coral','red','teal','cyan','indigo','lime','copper','slate')
  );
